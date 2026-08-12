from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.db.database import get_db
from backend.app.db.models import KnowledgeDoc
from backend.app.schemas.chat import KnowledgeDocOut, KnowledgeDocCreate
from backend.app.agents.knowledge_indexer import index_knowledge_document

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])


@router.get("/docs", response_model=List[KnowledgeDocOut])
async def list_knowledge_docs(db: AsyncSession = Depends(get_db)):
    """Retrieve list of indexed organizational documents."""
    result = await db.execute(select(KnowledgeDoc).order_by(KnowledgeDoc.created_at.desc()))
    return result.scalars().all()


@router.post("/upload", response_model=KnowledgeDocOut)
async def upload_knowledge_doc(
    title: str = Form(...),
    category: str = Form("SOP"),
    content: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    """Upload and index an organizational document into ChromaDB."""
    doc = KnowledgeDoc(
        title=title,
        category=category,
        content=content,
        chunk_count=1,
        is_indexed=True
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    # Index into ChromaDB vector database
    chunks_indexed = index_knowledge_document(
        doc_id=doc.id,
        title=doc.title,
        category=doc.category,
        content=doc.content
    )

    doc.chunk_count = chunks_indexed
    await db.commit()
    await db.refresh(doc)

    return doc
