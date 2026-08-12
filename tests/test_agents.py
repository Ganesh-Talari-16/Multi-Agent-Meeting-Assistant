import unittest
from backend.app.agents.summarizer import generate_summary
from backend.app.agents.action_item import extract_action_items
from backend.app.agents.decision_tracker import extract_decisions
from backend.app.agents.report_generator import generate_meeting_pdf_report


class TestAgents(unittest.TestCase):
    def test_summarizer_agent(self):
        sample_text = "Alex and Sarah agreed to implement ChromaDB vector search by August 15th."
        result = generate_summary(sample_text)
        self.assertIn("executive_summary", result)
        self.assertIn("key_points", result)
        self.assertIsInstance(result["key_points"], list)

    def test_action_item_agent(self):
        sample_text = "David will build the FastAPI JWT auth endpoints by Friday."
        items = extract_action_items(sample_text)
        self.assertIsInstance(items, list)
        self.assertGreater(len(items), 0)
        self.assertIn("task_description", items[0])

    def test_decision_tracker_agent(self):
        sample_text = "We formally decided to use JWT tokens with RBAC across all microservices."
        decisions = extract_decisions(sample_text)
        self.assertIsInstance(decisions, list)
        self.assertGreater(len(decisions), 0)
        self.assertIn("decision_text", decisions[0])

    def test_pdf_report_generator(self):
        meeting_data = {
            "title": "Architecture Sync",
            "created_at": "2026-08-12",
            "summary": {"executive_summary": "Quarterly architecture sync."},
            "action_items": [{"task_description": "Setup DB", "assignee_name": "David", "priority": "High", "due_date": "2026-08-15", "status": "Pending"}],
            "decisions": [{"topic": "Auth", "decision_text": "Use JWT", "category": "Security"}]
        }
        pdf_bytes = generate_meeting_pdf_report(meeting_data)
        self.assertIsInstance(pdf_bytes, bytes)
        self.assertGreater(len(pdf_bytes), 0)


if __name__ == "__main__":
    unittest.main()

