import pytest
from backend.app.agents.intent_classifier import (
    classify_user_intent,
    INTENT_MEETING_METADATA,
    INTENT_ACTION_ITEMS,
    INTENT_DECISIONS,
    INTENT_SUMMARY,
    INTENT_PARTICIPANTS
)
from backend.app.agents.rag_query import answer_rag_query


def test_intent_classification_meeting_metadata():
    res = classify_user_intent("When was the meeting conducted?")
    assert res["intent"] == INTENT_MEETING_METADATA
    assert res["confidence"] >= 0.90


def test_intent_classification_action_items():
    res = classify_user_intent("Who owns the ChromaDB task?")
    assert res["intent"] == INTENT_ACTION_ITEMS
    assert res["confidence"] >= 0.90


def test_intent_classification_decisions():
    res = classify_user_intent("What decisions were made about authentication?")
    assert res["intent"] == INTENT_DECISIONS
    assert res["confidence"] >= 0.90


def test_intent_classification_summary():
    res = classify_user_intent("Summarize the meeting.")
    assert res["intent"] == INTENT_SUMMARY


def test_intent_classification_participants():
    res = classify_user_intent("Who attended the meeting?")
    assert res["intent"] == INTENT_PARTICIPANTS


def test_rag_query_meeting_metadata():
    res = answer_rag_query("When was the meeting conducted?")
    assert "Meeting Date:" in res["answer"]
    assert "August 12, 2026" in res["answer"]
    assert len(res["citations"]) > 0
    assert "Metadata" in res["citations"][0]["title"]


def test_rag_query_action_items():
    res = answer_rag_query("Who owns the ChromaDB task?")
    assert "Action Item" in res["answer"]
    assert "Sarah Jenkins" in res["answer"]
    assert "Set up ChromaDB vector store" in res["answer"]


def test_rag_query_decisions():
    res = answer_rag_query("What decisions were made?")
    assert "Decision" in res["answer"]
    assert "JWT" in res["answer"] or "RBAC" in res["answer"] or "Authentication" in res["answer"]


def test_rag_query_unrelated_anti_hallucination():
    res = answer_rag_query("What is the capital of Jupiter?")
    assert "could not find information related to your question" in res["answer"].lower()
    assert len(res["citations"]) == 0
