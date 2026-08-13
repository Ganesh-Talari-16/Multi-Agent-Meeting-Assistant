import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from backend.app.db.database import get_db
from backend.app.db.models import Meeting, Transcript, Summary, ActionItem, Decision, Notification
from backend.app.schemas.meeting import MeetingOut, MeetingCreate
from backend.app.agents.coordinator import run_meeting_pipeline

router = APIRouter(prefix="/meetings", tags=["Meetings"])

UPLOAD_DIR = "./uploaded_media"
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def execute_meeting_pipeline_task(meeting_id: str, title: str, audio_path: str, raw_transcript: str):
    """Background worker task for processing meeting via Multi-Agent pipeline."""
    from backend.app.db.database import AsyncSessionLocal
    
    pipeline_res = run_meeting_pipeline(
        meeting_id=meeting_id,
        title=title,
        audio_path=audio_path,
        raw_transcript_override=raw_transcript
    )
    
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Meeting).where(Meeting.id == meeting_id))
        meeting = result.scalars().first()
        if not meeting:
            return

        from sqlalchemy import delete

        if pipeline_res.get("error"):
            meeting.status = "failed"
            await db.commit()
            return

        # Clear existing meeting artifact records to support idempotent re-processing
        await db.execute(delete(Transcript).where(Transcript.meeting_id == meeting_id))
        await db.execute(delete(Summary).where(Summary.meeting_id == meeting_id))
        await db.execute(delete(ActionItem).where(ActionItem.meeting_id == meeting_id))
        await db.execute(delete(Decision).where(Decision.meeting_id == meeting_id))
        await db.flush()

        # 1. Save Transcript
        transcript = Transcript(
            meeting_id=meeting_id,
            raw_text=pipeline_res.get("transcript_text", ""),
            diarized_segments_json=pipeline_res.get("diarized_segments", []),
            word_count=len(pipeline_res.get("transcript_text", "").split())
        )
        db.add(transcript)

        # 2. Save Summary
        summary = Summary(
            meeting_id=meeting_id,
            executive_summary=pipeline_res.get("summary", {}).get("executive_summary", ""),
            key_points_json=pipeline_res.get("summary", {}).get("key_points", []),
            topics_json=pipeline_res.get("summary", {}).get("discussion_topics", [])
        )
        db.add(summary)

        # 3. Save Action Items
        for item in pipeline_res.get("action_items", []):
            ai = ActionItem(
                meeting_id=meeting_id,
                task_description=item.get("task_description", ""),
                assignee_name=item.get("assignee_name", "Unassigned"),
                assignee_email=item.get("assignee_email"),
                priority=item.get("priority", "Medium"),
                due_date=item.get("due_date"),
                status=item.get("status", "Pending")
            )
            db.add(ai)

        # 4. Save Decisions
        for dec in pipeline_res.get("decisions", []):
            d = Decision(
                meeting_id=meeting_id,
                topic=dec.get("topic", "General"),
                decision_text=dec.get("decision_text", ""),
                rationale=dec.get("rationale"),
                decision_makers_json=dec.get("decision_makers", []),
                category=dec.get("category", "General")
            )
            db.add(d)

        # 5. Save Notifications
        for n in pipeline_res.get("notifications", []):
            notif = Notification(
                title=n.get("title", "Meeting Alert"),
                message=n.get("message", ""),
                notification_type=n.get("notification_type", "info")
            )
            db.add(notif)

        meeting.status = "processed"
        await db.commit()


@router.post("/upload", response_model=MeetingOut)
async def upload_meeting(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    description: Optional[str] = Form(None),
    raw_transcript: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    """Upload meeting audio/video recording or text transcript for AI processing."""
    file_path = ""
    if file:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    meeting = Meeting(
        title=title,
        description=description,
        audio_path=file_path if file_path else None,
        status="transcribing"
    )
    db.add(meeting)
    await db.commit()
    await db.refresh(meeting)

    background_tasks.add_task(
        execute_meeting_pipeline_task,
        meeting_id=meeting.id,
        title=title,
        audio_path=file_path,
        raw_transcript=raw_transcript or ""
    )

    return meeting


@router.get("/", response_model=List[MeetingOut])
async def list_meetings(skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)):
    """Retrieve list of all processed meeting records."""
    query = (
        select(Meeting)
        .options(selectinload(Meeting.transcript), selectinload(Meeting.summary))
        .order_by(Meeting.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{meeting_id}", response_model=MeetingOut)
async def get_meeting_details(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve complete details for a specific meeting."""
    query = (
        select(Meeting)
        .options(selectinload(Meeting.transcript), selectinload(Meeting.summary))
        .where(Meeting.id == meeting_id)
    )
    result = await db.execute(query)
    meeting = result.scalars().first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.post("/{meeting_id}/reprocess", response_model=MeetingOut)
async def reprocess_meeting(
    meeting_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Trigger background re-processing of a meeting using Multi-Agent pipeline."""
    result = await db.execute(select(Meeting).where(Meeting.id == meeting_id))
    meeting = result.scalars().first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    meeting.status = "transcribing"
    await db.commit()

    background_tasks.add_task(
        execute_meeting_pipeline_task,
        meeting_id=meeting.id,
        title=meeting.title,
        audio_path=meeting.audio_path or "",
        raw_transcript=""
    )

    return meeting
