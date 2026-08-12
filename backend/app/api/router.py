from fastapi import APIRouter
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.meetings import router as meetings_router
from backend.app.api.v1.action_items import router as action_items_router
from backend.app.api.v1.decisions import router as decisions_router
from backend.app.api.v1.chat import router as chat_router
from backend.app.api.v1.knowledge import router as knowledge_router
from backend.app.api.v1.notifications import router as notifications_router
from backend.app.api.v1.reports import router as reports_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(meetings_router)
api_router.include_router(action_items_router)
api_router.include_router(decisions_router)
api_router.include_router(chat_router)
api_router.include_router(knowledge_router)
api_router.include_router(notifications_router)
api_router.include_router(reports_router)
