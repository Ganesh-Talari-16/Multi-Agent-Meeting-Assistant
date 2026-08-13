import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.security import create_access_token, decode_access_token
from backend.app.agents.coordinator import run_meeting_pipeline
from backend.app.agents.report_generator import generate_meeting_pdf_report

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "online"


def test_auth_login_with_login_schema():
    """Verify login with email & password without needing full_name."""
    login_payload = {
        "email": "alex.chen@company.com",
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    # If user doesn't exist yet in DB during standalone test run, status is 401, not 422 validation error
    assert response.status_code in [200, 401]
    assert response.status_code != 422


def test_meeting_pipeline_and_pdf_generation():
    """Verify multi-agent pipeline execution and reportlab PDF rendering."""
    res = run_meeting_pipeline(
        meeting_id="test-integration-001",
        title="Integration Sync",
        raw_transcript_override="Alex: We will deploy the FastAPI backend to production by Friday. Sarah: Approved."
    )
    assert res["meeting_id"] == "test-integration-001"
    assert "summary" in res
    assert "action_items" in res

    pdf_bytes = generate_meeting_pdf_report({
        "title": "Test Sync",
        "summary": {"executive_summary": "Sync summary"},
        "action_items": res["action_items"],
        "decisions": res["decisions"]
    })
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0


def test_token_encode_decode_padding():
    """Verify JWT base64 fallback decoder handles padding correctly."""
    token = create_access_token(subject="user-123")
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "user-123"
