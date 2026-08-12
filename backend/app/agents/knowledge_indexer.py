import os
import logging
from typing import List, Dict, Any, Optional
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

# Global ChromaDB client reference
_chroma_client = None
_meeting_collection = None
_knowledge_collection = None


def get_chroma_collections():
    """Initialize and retrieve persistent ChromaDB collections."""
    global _chroma_client, _meeting_collection, _knowledge_collection
    
    if _meeting_collection is not None and _knowledge_collection is not None:
        return _meeting_collection, _knowledge_collection
        
    try:
        import chromadb
        os.makedirs(settings.CHROMADB_DIR, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(path=settings.CHROMADB_DIR)
        
        _meeting_collection = _chroma_client.get_or_create_collection(
            name="meeting_transcripts",
            metadata={"hnsw:space": "cosine"}
        )
        _knowledge_collection = _chroma_client.get_or_create_collection(
            name="org_knowledge_docs",
            metadata={"hnsw:space": "cosine"}
        )
        logger.info("ChromaDB vector store collections successfully initialized.")
    except Exception as e:
        logger.warning(f"ChromaDB initialization fallback mode active: {e}")
        # In-memory mock collection fallback if chromadb dependency issues arise
        class MockCollection:
            def __init__(self, name):
                self.name = name
                self.store = {}
            def add(self, ids, documents, metadatas=None):
                for i, doc in zip(ids, documents):
                    self.store[i] = {"doc": doc, "metadata": metadatas[0] if metadatas else {}}
            def query(self, query_texts, n_results=5, where=None):
                results = list(self.store.values())[:n_results]
                return {
                    "documents": [[r["doc"] for r in results]],
                    "metadatas": [[r["metadata"] for r in results]],
                    "distances": [[0.1 * idx for idx in range(len(results))]]
                }

        _meeting_collection = MockCollection("meeting_transcripts")
        _knowledge_collection = MockCollection("org_knowledge_docs")

    return _meeting_collection, _knowledge_collection


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Simple character chunker with window overlap."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
    return chunks if chunks else [text]


def index_meeting_transcript(meeting_id: str, title: str, transcript_text: str) -> int:
    """Index a meeting transcript into ChromaDB vector store."""
    logger.info(f"Indexing meeting transcript {meeting_id} into ChromaDB...")
    meeting_col, _ = get_chroma_collections()
    
    chunks = chunk_text(transcript_text)
    ids = [f"{meeting_id}_chunk_{idx}" for idx in range(len(chunks))]
    metadatas = [
        {
            "meeting_id": meeting_id,
            "title": title,
            "chunk_index": idx,
            "source_type": "meeting_transcript"
        }
        for idx in range(len(chunks))
    ]
    
    meeting_col.add(ids=ids, documents=chunks, metadatas=metadatas)
    logger.info(f"Successfully indexed {len(chunks)} transcript chunks for meeting {meeting_id}")
    return len(chunks)


def index_knowledge_document(doc_id: str, title: str, category: str, content: str) -> int:
    """Index an organizational knowledge document into ChromaDB."""
    logger.info(f"Indexing knowledge doc {doc_id} ('{title}') into ChromaDB...")
    _, knowledge_col = get_chroma_collections()
    
    chunks = chunk_text(content)
    ids = [f"{doc_id}_chunk_{idx}" for idx in range(len(chunks))]
    metadatas = [
        {
            "doc_id": doc_id,
            "title": title,
            "category": category,
            "chunk_index": idx,
            "source_type": "org_doc"
        }
        for idx in range(len(chunks))
    ]
    
    knowledge_col.add(ids=ids, documents=chunks, metadatas=metadatas)
    logger.info(f"Successfully indexed {len(chunks)} chunks for knowledge doc '{title}'")
    return len(chunks)
