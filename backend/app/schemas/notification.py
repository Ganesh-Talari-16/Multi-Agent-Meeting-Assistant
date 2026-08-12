from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NotificationCreate(BaseModel):
    user_id: Optional[str] = None
    title: str
    message: str
    notification_type: Optional[str] = "info"  # warning, info, deadline
    action_item_id: Optional[str] = None


class NotificationOut(BaseModel):
    id: str
    title: str
    message: str
    notification_type: str
    is_read: bool
    action_item_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
