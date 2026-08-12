# Multi-Agent Meeting Assistant

An enterprise startup-grade AI SaaS platform for processing meeting audio/video recordings, extracting diarized transcripts, generating executive summaries, extracting action items & formal decisions, indexing organizational knowledge into ChromaDB for RAG queries, sending notifications, and exporting PDF meeting minutes.

![System Architecture](./system%20design.png)

---

## Technical Stack

- **Backend**: Python 3.12+, FastAPI, SQLAlchemy (Async), Pydantic v2, JWT Authentication & RBAC.
- **Multi-Agent Orchestration**: LangGraph, LangChain, Google Gemini 2.5 Flash / Gemini 1.5 Flash.
- **Speech Processing**: OpenAI Whisper, Speaker Diarization.
- **Vector Database & RAG**: ChromaDB persistent vector store.
- **Report Generation**: ReportLab PDF exporter.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **DevOps**: Docker, Docker Compose.

---

## Agent System Architecture

1. **Coordinator Agent (`backend/app/agents/coordinator.py`)**: Executes sequential workflow pipeline: Speech -> Summary -> Action Items -> Decisions -> Vector Indexer -> Notification Generator.
2. **Summarizer Agent (`backend/app/agents/summarizer.py`)**: Produces structured executive summaries and key discussion points.
3. **Action Item Agent (`backend/app/agents/action_item.py`)**: Identifies assigned tasks, owners, deadlines, and priority levels.
4. **Decision Tracker Agent (`backend/app/agents/decision_tracker.py`)**: Logs business/technical decisions, rationale, and stakeholders.
5. **Knowledge Indexer Agent (`backend/app/agents/knowledge_indexer.py`)**: Chunks documents/transcripts and indexes embeddings into ChromaDB vector collections.
6. **RAG Query Agent (`backend/app/agents/rag_query.py`)**: Performs semantic vector retrieval across ChromaDB and synthesizes answers with source citations.
7. **Notification Agent (`backend/app/agents/notification.py`)**: Generates due-date reminders and high priority task alerts.
8. **Report Generator Agent (`backend/app/agents/report_generator.py`)**: Builds professional PDF Meeting Minutes.

---

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your Gemini API key in `.env`:

```env
GEMINI_API_KEY="your-api-key-here"
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

Access Interactive API Documentation at: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access Web Dashboard at: `http://localhost:5173`

---

## Testing Strategy

Run test suite using `pytest`:

```bash
pytest tests/
```

---

## Docker Deployment

Build and run using Docker Compose:

```bash
docker-compose up --build
```
