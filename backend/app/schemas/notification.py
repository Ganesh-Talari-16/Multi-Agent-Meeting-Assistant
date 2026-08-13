from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class NotificationCreate(BaseModel):
    user_id: Optional[str] = None
    title: str
    message: str
    notification_type: Optional[str] = "info"  # warning, info, deadline
    action_item_id: Optional[str] = None


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    message: str
    notification_type: str
    is_read: bool
    action_item_id: Optional[str] = None
    created_at: datetime
