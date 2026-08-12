from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from backend.app.db.database import get_db
from backend.app.db.models import Meeting
from backend.app.agents.report_generator import generate_meeting_pdf_report

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/meeting/{meeting_id}/pdf")
async def export_meeting_pdf(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Generate and stream downloadable PDF Meeting Minutes report."""
    query = (
        select(Meeting)
        .options(
            selectinload(Meeting.summary),
            selectinload(Meeting.action_items),
            selectinload(Meeting.decisions)
        )
        .where(Meeting.id == meeting_id)
    )
    result = await db.execute(query)
    meeting = result.scalars().first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    meeting_data = {
        "title": meeting.title,
        "created_at": meeting.created_at.strftime("%Y-%m-%d %H:%M") if meeting.created_at else "",
        "summary": {
            "executive_summary": meeting.summary.executive_summary if meeting.summary else "No summary available.",
            "key_points_json": meeting.summary.key_points_json if meeting.summary else []
        },
        "action_items": [
            {
                "task_description": ai.task_description,
                "assignee_name": ai.assignee_name,
                "priority": ai.priority,
                "due_date": ai.due_date,
                "status": ai.status
            }
            for ai in meeting.action_items
        ],
        "decisions": [
            {
                "topic": d.topic,
                "decision_text": d.decision_text,
                "rationale": d.rationale,
                "category": d.category
            }
            for d in meeting.decisions
        ]
    }

    pdf_bytes = generate_meeting_pdf_report(meeting_data)
    filename = f"Meeting_Minutes_{meeting_id[:8]}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
