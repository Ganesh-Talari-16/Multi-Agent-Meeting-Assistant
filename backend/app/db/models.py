import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean, Integer, JSON
from sqlalchemy.orm import relationship
from backend.app.db.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="Member", nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    meetings = relationship("Meeting", back_populates="creator", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    audio_path = Column(String(512), nullable=True)
    file_type = Column(String(50), default="audio/mp3")
    duration_seconds = Column(Integer, default=0)
    status = Column(String(50), default="uploaded", index=True)  # uploaded, transcribing, processed, failed
    created_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    creator = relationship("User", back_populates="meetings")
    participants = relationship("MeetingParticipant", back_populates="meeting", cascade="all, delete-orphan")
    transcript = relationship("Transcript", back_populates="meeting", uselist=False, cascade="all, delete-orphan")
    summary = relationship("Summary", back_populates="meeting", uselist=False, cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="meeting", cascade="all, delete-orphan")
    decisions = relationship("Decision", back_populates="meeting", cascade="all, delete-orphan")


class MeetingParticipant(Base):
    __tablename__ = "meeting_participants"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    meeting_id = Column(String(36), ForeignKey("meetings.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    role = Column(String(100), default="Participant")

    meeting = relationship("Meeting", back_populates="participants")


class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    meeting_id = Column(String(36), ForeignKey("meetings.id"), nullable=False, unique=True)
    raw_text = Column(Text, nullable=False)
    diarized_segments_json = Column(JSON, nullable=True)  # [{speaker: "Speaker A", start: 0, end: 12, text: "..."}]
    language = Column(String(10), default="en")
    word_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    meeting = relationship("Meeting", back_populates="transcript")


class Summary(Base):
    __tablename__ = "summaries"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    meeting_id = Column(String(36), ForeignKey("meetings.id"), nullable=False, unique=True)
    executive_summary = Column(Text, nullable=False)
    key_points_json = Column(JSON, nullable=True)  # ["point 1", "point 2"]
    topics_json = Column(JSON, nullable=True)  # [{"topic": "...", "discussion": "..."}]
    created_at = Column(DateTime(timezone=True), default=utc_now)

    meeting = relationship("Meeting", back_populates="summary")


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    meeting_id = Column(String(36), ForeignKey("meetings.id"), nullable=False)
    task_description = Column(Text, nullable=False)
    assignee_name = Column(String(255), nullable=True, default="Unassigned")
    assignee_email = Column(String(255), nullable=True)
    priority = Column(String(50), default="Medium")  # High, Medium, Low
    due_date = Column(String(100), nullable=True)
    status = Column(String(50), default="Pending")  # Pending, In Progress, Completed
    created_at = Column(DateTime(timezone=True), default=utc_now)

    meeting = relationship("Meeting", back_populates="action_items")


class Decision(Base):
    __tablename__ = "decisions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    meeting_id = Column(String(36), ForeignKey("meetings.id"), nullable=False)
    topic = Column(String(255), nullable=False)
    decision_text = Column(Text, nullable=False)
    rationale = Column(Text, nullable=True)
    decision_makers_json = Column(JSON, nullable=True)  # ["Alice", "Bob"]
    category = Column(String(100), default="General")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    meeting = relationship("Meeting", back_populates="decisions")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="info")  # warning, info, deadline
    is_read = Column(Boolean, default=False)
    action_item_id = Column(String(36), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="notifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(36), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="audit_logs")


class KnowledgeDoc(Base):
    __tablename__ = "knowledge_docs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="SOP")  # SOP, Policy, Spec, Architecture
    file_path = Column(String(512), nullable=True)
    content = Column(Text, nullable=False)
    chunk_count = Column(Integer, default=1)
    is_indexed = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
