import logging
from typing import Dict, Any, List, TypedDict
from backend.app.agents.whisper_transcriber import transcribe_audio_file
from backend.app.agents.summarizer import generate_summary
from backend.app.agents.action_item import extract_action_items
from backend.app.agents.decision_tracker import extract_decisions
from backend.app.agents.knowledge_indexer import index_meeting_transcript
from backend.app.agents.notification import generate_action_item_notifications

logger = logging.getLogger(__name__)


class MeetingState(TypedDict):
    meeting_id: str
    title: str
    audio_path: str
    transcript_text: str
    diarized_segments: List[Dict[str, Any]]
    summary: Dict[str, Any]
    action_items: List[Dict[str, Any]]
    decisions: List[Dict[str, Any]]
    indexed_chunks: int
    notifications: List[Dict[str, Any]]
    error: str


def run_meeting_pipeline(meeting_id: str, title: str, audio_path: str = "", raw_transcript_override: str = "") -> Dict[str, Any]:
    """Coordinator Agent: Orchestrates the multi-agent meeting processing pipeline.
    
    Uses LangGraph StateGraph design pattern to execute sequential agent nodes:
    Speech Transcriber -> Summarizer -> Action Item Extractor -> Decision Tracker -> Knowledge Indexer -> Notification Generator.
    """
    logger.info(f"Coordinator Agent initiating pipeline for meeting {meeting_id}: '{title}'")
    
    state: MeetingState = {
        "meeting_id": meeting_id,
        "title": title,
        "audio_path": audio_path,
        "transcript_text": "",
        "diarized_segments": [],
        "summary": {},
        "action_items": [],
        "decisions": [],
        "indexed_chunks": 0,
        "notifications": [],
        "error": ""
    }
    
    try:
        # Step 1: Speech Processing Node
        if raw_transcript_override:
            state["transcript_text"] = raw_transcript_override
            state["diarized_segments"] = [
                {"speaker": "Speaker 1", "start": 0.0, "end": 30.0, "text": raw_transcript_override}
            ]
        else:
            transcription = transcribe_audio_file(audio_path)
            state["transcript_text"] = transcription.get("raw_text", "")
            state["diarized_segments"] = transcription.get("diarized_segments", [])
            
        # Step 2: Summarizer Agent Node
        state["summary"] = generate_summary(state["transcript_text"])
        
        # Step 3: Action Item Extractor Node
        state["action_items"] = extract_action_items(state["transcript_text"])
        
        # Step 4: Decision Tracker Agent Node
        state["decisions"] = extract_decisions(state["transcript_text"])
        
        # Step 5: Knowledge Indexer Agent Node
        state["indexed_chunks"] = index_meeting_transcript(
            meeting_id=meeting_id,
            title=title,
            transcript_text=state["transcript_text"]
        )
        
        # Step 6: Notification Agent Node
        state["notifications"] = generate_action_item_notifications(state["action_items"])
        
        logger.info(f"Coordinator Agent pipeline successfully completed for meeting {meeting_id}.")
        return state
        
    except Exception as e:
        logger.error(f"Coordinator Agent pipeline failed: {e}")
        state["error"] = str(e)
        return state
