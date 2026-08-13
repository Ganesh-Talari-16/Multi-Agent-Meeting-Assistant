from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime


class ParticipantBase(BaseModel):
    name: str
    email: Optional[str] = None
    role: Optional[str] = "Participant"


class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    raw_transcript_text: Optional[str] = None  # If text transcript uploaded directly
    participants: Optional[List[ParticipantBase]] = []


class TranscriptSegment(BaseModel):
    speaker: str
    start: float
    end: float
    text: str


class TranscriptOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    raw_text: str
    diarized_segments_json: Optional[List[dict]] = None
    language: str
    word_count: int
    created_at: datetime


class SummaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    executive_summary: str
    key_points_json: Optional[List[str]] = []
    topics_json: Optional[List[dict]] = []
    created_at: datetime


class MeetingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: Optional[str] = None
    audio_path: Optional[str] = None
    duration_seconds: int
    status: str
    created_at: datetime
    updated_at: datetime
    transcript: Optional[TranscriptOut] = None
    summary: Optional[SummaryOut] = None


class ProcessMeetingRequest(BaseModel):
    meeting_id: str
