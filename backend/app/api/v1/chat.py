from fastapi import APIRouter, HTTPException
from backend.app.schemas.chat import ChatQueryRequest, ChatQueryResponse
from backend.app.agents.rag_query import answer_rag_query

router = APIRouter(prefix="/chat", tags=["RAG Chat"])


@router.post("/query", response_model=ChatQueryResponse)
async def query_knowledge_base(request: ChatQueryRequest):
    """Execute RAG question-answering query across ChromaDB vector store and return response with source citations."""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query text cannot be empty")

    res = answer_rag_query(
        query=request.query,
        meeting_id=request.meeting_id,
        category_filter=request.category_filter,
        top_k=request.top_k or 5,
        chat_history=request.chat_history
    )
    return res
