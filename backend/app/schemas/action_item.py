from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ActionItemCreate(BaseModel):
    meeting_id: str
    task_description: str
    assignee_name: Optional[str] = "Unassigned"
    assignee_email: Optional[str] = None
    priority: Optional[str] = "Medium"
    due_date: Optional[str] = None
    status: Optional[str] = "Pending"


class ActionItemUpdate(BaseModel):
    task_description: Optional[str] = None
    assignee_name: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = None


class ActionItemOut(BaseModel):
    id: str
    meeting_id: str
    task_description: str
    assignee_name: Optional[str] = "Unassigned"
    assignee_email: Optional[str] = None
    priority: str
    due_date: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
