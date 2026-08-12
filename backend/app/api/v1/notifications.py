from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.db.database import get_db
from backend.app.db.models import Notification
from backend.app.schemas.notification import NotificationOut

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=List[NotificationOut])
async def get_notifications(db: AsyncSession = Depends(get_db)):
    """Retrieve all notifications ordered by creation date."""
    result = await db.execute(select(Notification).order_by(Notification.created_at.desc()))
    return result.scalars().all()


@router.put("/{notification_id}/read", response_model=NotificationOut)
async def mark_notification_read(notification_id: str, db: AsyncSession = Depends(get_db)):
    """Mark a notification alert as read."""
    result = await db.execute(select(Notification).where(Notification.id == notification_id))
    notif = result.scalars().first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    await db.commit()
    await db.refresh(notif)
    return notif
