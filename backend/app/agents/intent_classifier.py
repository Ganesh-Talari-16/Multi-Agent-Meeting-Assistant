import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Intent Categories
INTENT_MEETING_METADATA = "MEETING_METADATA"
INTENT_ACTION_ITEMS = "ACTION_ITEMS"
INTENT_DECISIONS = "DECISIONS"
INTENT_SUMMARY = "SUMMARY"
INTENT_PARTICIPANTS = "PARTICIPANTS"
INTENT_SOP_DOCS = "SOP_DOCS"
INTENT_GENERAL_RAG = "GENERAL_RAG"


def classify_user_intent(query: str) -> Dict[str, Any]:
    """
    Classify user query into target intent categories to route search to exact structured DB tables
    or vector collections before vector chunk retrieval.
    """
    q_lower = query.lower().strip()
    
    # 1. Meeting Metadata (Date, Time, Conducted, When, Title, Duration)
    metadata_keywords = [
        "when was the meeting", "meeting conducted", "meeting date", "date of the meeting",
        "when did the meeting take place", "when was it held", "meeting title", "how long was the meeting",
        "meeting duration", "when was this meeting"
    ]
    if any(kw in q_lower for kw in metadata_keywords):
        return {
            "intent": INTENT_MEETING_METADATA,
            "confidence": 0.95,
            "target_entity": "meeting_metadata"
        }
        
    # 2. Participants / Attendees
    participant_keywords = [
        "who attended", "who was in the meeting", "who were the participants",
        "list attendees", "who joined", "meeting attendees", "speakers in the meeting"
    ]
    if any(kw in q_lower for kw in participant_keywords):
        return {
            "intent": INTENT_PARTICIPANTS,
            "confidence": 0.95,
            "target_entity": "meeting_participants"
        }

    # 3. Action Items (Owner, Assignee, Task, Deadline, Due Date, Status)
    action_item_keywords = [
        "who owns", "who is assigned", "assigned to", "action item", "action items",
        "task", "tasks", "deadline", "due date", "pending task", "task owner",
        "chromadb task", "jwt task", "auth task"
    ]
    if any(kw in q_lower for kw in action_item_keywords):
        return {
            "intent": INTENT_ACTION_ITEMS,
            "confidence": 0.92,
            "target_entity": "action_items"
        }

    # 4. Decisions (Decided, Decision, Outcome, Rationale, Architecture choice)
    decision_keywords = [
        "what decisions", "what was decided", "decision", "decisions", "agreed on",
        "outcome of", "rationale for", "why did we choose", "decision made"
    ]
    if any(kw in q_lower for kw in decision_keywords):
        return {
            "intent": INTENT_DECISIONS,
            "confidence": 0.92,
            "target_entity": "decisions"
        }

    # 5. Summaries
    summary_keywords = [
        "summarize", "summary", "executive summary", "key takeaways", "overview of the meeting",
        "what was discussed", "main points"
    ]
    if any(kw in q_lower for kw in summary_keywords):
        return {
            "intent": INTENT_SUMMARY,
            "confidence": 0.90,
            "target_entity": "summaries"
        }

    # 6. SOPs & Enterprise Documents
    sop_keywords = [
        "sop", "sop-042", "policy", "standard operating procedure", "architecture standard",
        "enterprise policy", "guideline"
    ]
    if any(kw in q_lower for kw in sop_keywords):
        return {
            "intent": INTENT_SOP_DOCS,
            "confidence": 0.90,
            "target_entity": "org_knowledge_docs"
        }

    # Default fallback
    return {
        "intent": INTENT_GENERAL_RAG,
        "confidence": 0.70,
        "target_entity": "general_knowledge"
    }
