import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.db.database import init_db, AsyncSessionLocal
from backend.app.db.models import Meeting, Transcript, Summary, ActionItem, Decision, Notification
from backend.app.api.router import api_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_initial_demo_data():
    """Seed database with an initial sample meeting if empty for instant out-of-the-box demo."""
    async with AsyncSessionLocal() as db:
        from sqlalchemy.future import select
        res = await db.execute(select(Meeting))
        if res.scalars().first():
            return  # Already seeded or has user data
            
        logger.info("Seeding database with initial demonstration meeting...")
        demo_meeting = Meeting(
            id="demo-meeting-001",
            title="Q3 Product & Architecture Sync",
            description="Strategic review of AI multi-agent platform, RAG search engine, and security compliance.",
            status="processed",
            duration_seconds=320
        )
        db.add(demo_meeting)
        
        transcript = Transcript(
            meeting_id="demo-meeting-001",
            raw_text="Alex: Good morning team. Let's start our quarterly roadmap review. First, regarding the AI search optimization project, Sarah will lead the ChromaDB integration by Friday. Sarah: Sounds good, I will set up the vector store schema and document chunking pipeline by August 15th. David: What about the OAuth2 authorization and RBAC integration for API security? Alex: We formally decided to implement JWT tokens with role-based access control across all microservices. David will take ownership of the FastAPI auth endpoints with deadline of August 18th. Sarah: Great. Also, we agreed to store meeting PDF reports directly in cloud storage with public signed URLs. Alex: Perfect. Let's schedule our next sync for Monday.",
            diarized_segments_json=[
                {"speaker": "Alex Chen (Product Lead)", "start": 0.0, "end": 14.5, "text": "Good morning team. Let's start our quarterly roadmap review. First, regarding the AI search optimization project, Sarah will lead the ChromaDB integration by Friday."},
                {"speaker": "Sarah Jenkins (Senior AI Engineer)", "start": 15.0, "end": 28.2, "text": "Sounds good, I will set up the vector store schema and document chunking pipeline by August 15th."},
                {"speaker": "David Miller (Backend Architect)", "start": 29.0, "end": 35.8, "text": "What about the OAuth2 authorization and RBAC integration for API security?"},
                {"speaker": "Alex Chen (Product Lead)", "start": 36.0, "end": 52.4, "text": "We formally decided to implement JWT tokens with role-based access control across all microservices. David will take ownership of the FastAPI auth endpoints with deadline of August 18th."},
                {"speaker": "Sarah Jenkins (Senior AI Engineer)", "start": 53.0, "end": 64.1, "text": "Great. Also, we agreed to store meeting PDF reports directly in cloud storage with public signed URLs."},
                {"speaker": "Alex Chen (Product Lead)", "start": 64.5, "end": 70.0, "text": "Perfect. Let me summarize all action items and decisions before we conclude."}
            ],
            word_count=138
        )
        db.add(transcript)
        
        summary = Summary(
            meeting_id="demo-meeting-001",
            executive_summary="The engineering leadership team reviewed Q3 milestones, confirming ChromaDB vector indexing under Sarah, FastAPI JWT/RBAC security under David, and ReportLab PDF exports.",
            key_points_json=[
                "ChromaDB selected as standard enterprise vector store.",
                "OAuth2 JWT authentication mandatory across all API endpoints.",
                "PDF meeting minutes automatically dispatched upon processing completion."
            ],
            topics_json=[
                {"topic": "Vector Store & RAG", "discussion": "Designed chunking and embedding indexing workflows."},
                {"topic": "Security & RBAC", "discussion": "Finalized role-based scope checks for administrative access."}
            ]
        )
        db.add(summary)
        
        db.add(ActionItem(
            meeting_id="demo-meeting-001",
            task_description="Set up ChromaDB vector store schema and document chunking pipeline for RAG search.",
            assignee_name="Sarah Jenkins",
            priority="High",
            due_date="2026-08-15",
            status="Pending"
        ))
        db.add(ActionItem(
            meeting_id="demo-meeting-001",
            task_description="Implement OAuth2 JWT authentication and role-based access control (RBAC) in FastAPI backend.",
            assignee_name="David Miller",
            priority="High",
            due_date="2026-08-18",
            status="In Progress"
        ))
        
        db.add(Decision(
            meeting_id="demo-meeting-001",
            topic="Authentication & Authorization Architecture",
            decision_text="Adopt JWT tokens paired with Role-Based Access Control (RBAC) across FastAPI endpoints.",
            rationale="Ensures stateless API scaling and consistent permission enforcement for enterprise tenants.",
            decision_makers_json=["Alex Chen", "David Miller"],
            category="Security"
        ))
        
        db.add(Notification(
            title="Action Item High Priority",
            message="Reminder for Sarah Jenkins: Task 'Set up ChromaDB vector store' is due on 2026-08-15.",
            notification_type="deadline"
        ))
        
        await db.commit()
        logger.info("Demo meeting successfully seeded.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Application Services & Database...")
    await init_db()
    await seed_initial_demo_data()
    yield
    logger.info("Shutting down Application Services...")


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Enterprise Startup-Grade Multi-Agent Meeting Assistant API with Speech Processing, RAG Search, and PDF Export.",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health", tags=["Health"])
async def health_check():
    """Application health probe."""
    return {"status": "online", "app": settings.APP_NAME, "version": "1.0.0"}
