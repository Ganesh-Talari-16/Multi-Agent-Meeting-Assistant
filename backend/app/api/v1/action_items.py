from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.db.database import get_db
from backend.app.db.models import ActionItem
from backend.app.schemas.action_item import ActionItemOut, ActionItemUpdate, ActionItemCreate

router = APIRouter(prefix="/action-items", tags=["Action Items"])


@router.get("/", response_model=List[ActionItemOut])
async def list_action_items(
    meeting_id: Optional[str] = None,
    status: Optional[str] = None,
    assignee: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve action items with optional filtering by meeting, status, or assignee."""
    query = select(ActionItem)
    if meeting_id:
        query = query.where(ActionItem.meeting_id == meeting_id)
    if status:
        query = query.where(ActionItem.status == status)
    if assignee:
        query = query.where(ActionItem.assignee_name.ilike(f"%{assignee}%"))
        
    query = query.order_by(ActionItem.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=ActionItemOut)
async def create_action_item(item_in: ActionItemCreate, db: AsyncSession = Depends(get_db)):
    """Manually add an action item."""
    ai = ActionItem(
        meeting_id=item_in.meeting_id,
        task_description=item_in.task_description,
        assignee_name=item_in.assignee_name or "Unassigned",
        assignee_email=item_in.assignee_email,
        priority=item_in.priority or "Medium",
        due_date=item_in.due_date,
        status=item_in.status or "Pending"
    )
    db.add(ai)
    await db.commit()
    await db.refresh(ai)
    return ai


@router.put("/{item_id}", response_model=ActionItemOut)
async def update_action_item(item_id: str, item_in: ActionItemUpdate, db: AsyncSession = Depends(get_db)):
    """Update task status, assignee, priority, or due date."""
    result = await db.execute(select(ActionItem).where(ActionItem.id == item_id))
    ai = result.scalars().first()
    if not ai:
        raise HTTPException(status_code=404, detail="Action item not found")

    if item_in.task_description is not None:
        ai.task_description = item_in.task_description
    if item_in.assignee_name is not None:
        ai.assignee_name = item_in.assignee_name
    if item_in.priority is not None:
        ai.priority = item_in.priority
    if item_in.due_date is not None:
        ai.due_date = item_in.due_date
    if item_in.status is not None:
        ai.status = item_in.status

    await db.commit()
    await db.refresh(ai)
    return ai
