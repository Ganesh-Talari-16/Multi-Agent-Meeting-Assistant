from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.db.database import get_db
from backend.app.db.models import Decision
from backend.app.schemas.decision import DecisionOut, DecisionCreate

router = APIRouter(prefix="/decisions", tags=["Decisions"])


@router.get("/", response_model=List[DecisionOut])
async def list_decisions(
    meeting_id: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve decision log records with optional filtering by meeting or category."""
    query = select(Decision)
    if meeting_id:
        query = query.where(Decision.meeting_id == meeting_id)
    if category:
        query = query.where(Decision.category == category)

    query = query.order_by(Decision.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=DecisionOut)
async def create_decision(dec_in: DecisionCreate, db: AsyncSession = Depends(get_db)):
    """Manually log a business or technical decision."""
    d = Decision(
        meeting_id=dec_in.meeting_id,
        topic=dec_in.topic,
        decision_text=dec_in.decision_text,
        rationale=dec_in.rationale,
        decision_makers_json=dec_in.decision_makers_json or [],
        category=dec_in.category or "General"
    )
    db.add(d)
    await db.commit()
    await db.refresh(d)
    return d
