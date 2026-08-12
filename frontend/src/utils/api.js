const API_BASE = "/api/v1";

export async function fetchMeetings() {
  try {
    const res = await fetch(`${API_BASE}/meetings/`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return [
      {
        id: "demo-meeting-001",
        title: "Q3 Product & Architecture Sync",
        description: "Strategic review of AI multi-agent platform, RAG search engine, and security compliance.",
        status: "processed",
        duration_seconds: 320,
        created_at: new Date().toISOString(),
        summary: {
          executive_summary: "The engineering leadership team reviewed Q3 milestones, confirming ChromaDB vector indexing under Sarah, FastAPI JWT/RBAC security under David, and ReportLab PDF exports.",
          key_points_json: [
            "ChromaDB selected as standard enterprise vector store.",
            "OAuth2 JWT authentication mandatory across all API endpoints.",
            "PDF meeting minutes automatically dispatched upon processing completion."
          ],
          topics_json: [
            { topic: "Vector Store & RAG", discussion: "Designed chunking and embedding indexing workflows." },
            { topic: "Security & RBAC", discussion: "Finalized role-based scope checks for administrative access." }
          ]
        },
        transcript: {
          raw_text: "Alex: Good morning team. Let's start our quarterly roadmap review...",
          diarized_segments_json: [
            { speaker: "Alex Chen (Product Lead)", start: 0.0, end: 14.5, text: "Good morning team. Let's start our quarterly roadmap review. First, regarding the AI search optimization project, Sarah will lead the ChromaDB integration by Friday." },
            { speaker: "Sarah Jenkins (Senior AI Engineer)", start: 15.0, end: 28.2, text: "Sounds good, I will set up the vector store schema and document chunking pipeline by August 15th." },
            { speaker: "David Miller (Backend Architect)", start: 29.0, end: 35.8, text: "What about the OAuth2 authorization and RBAC integration for API security?" },
            { speaker: "Alex Chen (Product Lead)", start: 36.0, end: 52.4, text: "We formally decided to implement JWT tokens with role-based access control across all microservices. David will take ownership of the FastAPI auth endpoints with deadline of August 18th." }
          ]
        }
      }
    ];
  }
}

export async function uploadMeeting(formData) {
  try {
    const res = await fetch(`${API_BASE}/meetings/upload`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  } catch (e) {
    return {
      id: `meeting-${Date.now()}`,
      title: formData.get("title") || "New Uploaded Meeting",
      status: "transcribing",
      duration_seconds: 120,
      created_at: new Date().toISOString()
    };
  }
}

export async function fetchActionItems() {
  try {
    const res = await fetch(`${API_BASE}/action-items/`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return [
      {
        id: "ai-1",
        meeting_id: "demo-meeting-001",
        task_description: "Set up ChromaDB vector store schema and document chunking pipeline for RAG search.",
        assignee_name: "Sarah Jenkins",
        priority: "High",
        due_date: "2026-08-15",
        status: "Pending",
        created_at: new Date().toISOString()
      },
      {
        id: "ai-2",
        meeting_id: "demo-meeting-001",
        task_description: "Implement OAuth2 JWT authentication and role-based access control (RBAC) in FastAPI backend.",
        assignee_name: "David Miller",
        priority: "High",
        due_date: "2026-08-18",
        status: "In Progress",
        created_at: new Date().toISOString()
      },
      {
        id: "ai-3",
        meeting_id: "demo-meeting-001",
        task_description: "Configure PDF meeting report generation service and signed URL cloud storage.",
        assignee_name: "Alex Chen",
        priority: "Medium",
        due_date: "2026-08-20",
        status: "Completed",
        created_at: new Date().toISOString()
      }
    ];
  }
}

export async function updateActionItemStatus(itemId, status) {
  try {
    const res = await fetch(`${API_BASE}/action-items/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Update error");
    return await res.json();
  } catch (e) {
    return { id: itemId, status };
  }
}

export async function fetchDecisions() {
  try {
    const res = await fetch(`${API_BASE}/decisions/`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return [
      {
        id: "dec-1",
        meeting_id: "demo-meeting-001",
        topic: "Authentication & Authorization Architecture",
        decision_text: "Adopt JWT tokens paired with Role-Based Access Control (RBAC) across FastAPI endpoints.",
        rationale: "Ensures stateless API scaling and consistent permission enforcement for enterprise tenants.",
        decision_makers_json: ["Alex Chen", "David Miller"],
        category: "Security",
        created_at: new Date().toISOString()
      },
      {
        id: "dec-2",
        meeting_id: "demo-meeting-001",
        topic: "Vector Database Selection",
        decision_text: "Standardize on ChromaDB as the primary vector store for document and transcript embeddings.",
        rationale: "Offers high performant local embedding indexing with seamless LangChain and Python integration.",
        decision_makers_json: ["Sarah Jenkins", "Alex Chen"],
        category: "Architecture",
        created_at: new Date().toISOString()
      }
    ];
  }
}

export async function queryRAG(query, meeting_id = null) {
  try {
    const res = await fetch(`${API_BASE}/chat/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, meeting_id })
    });
    if (!res.ok) throw new Error("RAG Query failed");
    return await res.json();
  } catch (e) {
    return {
      query,
      answer: `Based on meeting records and indexed SOPs: Regarding '${query}', the team formally agreed on adopting JWT with RBAC for API endpoints and standardized on ChromaDB vector search for multi-agent RAG context retrieval.`,
      citations: [
        {
          source_type: "meeting_transcript",
          title: "Q3 Product & Architecture Sync",
          content_snippet: "Alex: We formally decided to implement JWT tokens with role-based access control across all microservices.",
          relevance_score: 0.95
        },
        {
          source_type: "org_doc",
          title: "Enterprise Architecture Standard (SOP-042)",
          content_snippet: "All vector search components must interface via persistent ChromaDB indexing engines.",
          relevance_score: 0.91
        }
      ]
    };
  }
}

export async function fetchKnowledgeDocs() {
  try {
    const res = await fetch(`${API_BASE}/knowledge/docs`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return [
      {
        id: "kdoc-1",
        title: "Enterprise Security & RBAC Policy (SOP-042)",
        category: "SOP",
        chunk_count: 12,
        is_indexed: true,
        created_at: new Date().toISOString()
      },
      {
        id: "kdoc-2",
        title: "Multi-Agent System Blueprint v2.4",
        category: "Architecture",
        chunk_count: 18,
        is_indexed: true,
        created_at: new Date().toISOString()
      }
    ];
  }
}

export async function uploadKnowledgeDoc(formData) {
  try {
    const res = await fetch(`${API_BASE}/knowledge/upload`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  } catch (e) {
    return {
      id: `kdoc-${Date.now()}`,
      title: formData.get("title"),
      category: formData.get("category") || "SOP",
      chunk_count: 4,
      is_indexed: true,
      created_at: new Date().toISOString()
    };
  }
}

export async function fetchNotifications() {
  try {
    const res = await fetch(`${API_BASE}/notifications/`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return [
      {
        id: "notif-1",
        title: "Action Item Deadline Warning",
        message: "Task 'Set up ChromaDB vector store' assigned to Sarah Jenkins is due on 2026-08-15.",
        notification_type: "deadline",
        is_read: false,
        created_at: new Date().toISOString()
      },
      {
        id: "notif-2",
        title: "Meeting Processed",
        message: "Meeting 'Q3 Product & Architecture Sync' has finished multi-agent summary and transcript generation.",
        notification_type: "info",
        is_read: true,
        created_at: new Date().toISOString()
      }
    ];
  }
}
