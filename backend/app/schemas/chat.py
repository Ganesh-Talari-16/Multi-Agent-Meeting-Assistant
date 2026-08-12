from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class ChatQueryRequest(BaseModel):
    query: str
    meeting_id: Optional[str] = None
    category_filter: Optional[str] = None
    top_k: Optional[int] = 5


class ChatCitation(BaseModel):
    source_type: str  # meeting_transcript, org_doc, decision
    title: str
    content_snippet: str
    relevance_score: float
    metadata: Optional[Dict[str, Any]] = None


class ChatQueryResponse(BaseModel):
    query: str
    answer: str
    citations: List[ChatCitation] = []
    generated_at: datetime = datetime.now()


class KnowledgeDocCreate(BaseModel):
    title: str
    category: Optional[str] = "SOP"
    content: str


class KnowledgeDocOut(BaseModel):
    id: str
    title: str
    category: str
    chunk_count: int
    is_indexed: bool
    created_at: datetime

    class Config:
        from_attributes = True
