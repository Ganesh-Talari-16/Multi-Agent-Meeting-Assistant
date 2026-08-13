from pydantic import BaseModel, ConfigDict
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
    model_config = ConfigDict(from_attributes=True)

    id: str
    meeting_id: str
    topic: str
    decision_text: str
    rationale: Optional[str] = None
    decision_makers_json: Optional[List[str]] = []
    category: str
    created_at: datetime
