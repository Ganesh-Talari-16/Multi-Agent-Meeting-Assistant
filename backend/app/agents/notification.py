import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)


def generate_action_item_notifications(action_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Notification Agent: Scans action items and generates reminders and deadline notifications."""
    logger.info("Notification Agent scanning action items...")
    notifications = []
    
    for item in action_items:
        assignee = item.get("assignee_name", "Team Member")
        task = item.get("task_description", "")
        due = item.get("due_date", "Soon")
        priority = item.get("priority", "Medium")
        
        notif_type = "deadline" if priority == "High" else "info"
        title = f"Action Item Assigned: {priority} Priority"
        message = f"Reminder for {assignee}: Task '{task[:60]}...' is due on {due}."
        
        notifications.append({
            "title": title,
            "message": message,
            "notification_type": notif_type,
            "action_item_id": item.get("id")
        })
        
    return notifications
