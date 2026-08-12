from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DecisionCreate(BaseModel):
    meeting_id: str
    topic: str
    decision_text: str
    rationale: Optional[str] = None
    decision_makers_json: Optional[List[str]] = []
    category: Optional[str] = "General"


class DecisionOut(BaseModel):
    id: str
    meeting_id: str
    topic: str
    decision_text: str
    rationale: Optional[str] = None
    decision_makers_json: Optional[List[str]] = []
    category: str
    created_at: datetime

    class Config:
        from_attributes = True
