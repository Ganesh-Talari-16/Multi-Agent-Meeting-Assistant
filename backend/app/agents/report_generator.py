import os
import io
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)


def generate_meeting_pdf_report(meeting_data: Dict[str, Any]) -> bytes:
    """Report Generator Agent: Renders clean PDF meeting minutes using ReportLab."""
    logger.info(f"Report Generator Agent building PDF for meeting '{meeting_data.get('title')}'...")
    
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#1E293B"),
            spaceAfter=8
        )
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor("#64748B"),
            spaceAfter=14
        )
        h2_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Heading2'],
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#2563EB"),
            spaceBefore=12,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'ReportBody',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#334155")
        )
        
        elements = []
        
        # Document Header
        title = meeting_data.get("title", "Meeting Minutes")
        date_str = meeting_data.get("created_at", "August 2026")
        elements.append(Paragraph(f"<b>{title}</b>", title_style))
        elements.append(Paragraph(f"Official Meeting Minutes | Date: {date_str} | Status: Processed", subtitle_style))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#CBD5E1"), spaceAfter=12))
        
        # Executive Summary Section
        elements.append(Paragraph("Executive Summary", h2_style))
        summary = meeting_data.get("summary", {}).get("executive_summary", "No executive summary available.")
        elements.append(Paragraph(summary, body_style))
        elements.append(Spacer(1, 10))
        
        # Key Points Section
        key_points = meeting_data.get("summary", {}).get("key_points_json", [])
        if key_points:
            elements.append(Paragraph("Key Takeaways & Discussion Highlights", h2_style))
            for pt in key_points:
                elements.append(Paragraph(f"• {pt}", body_style))
            elements.append(Spacer(1, 10))
            
        # Action Items Table
        action_items = meeting_data.get("action_items", [])
        if action_items:
            elements.append(Paragraph("Action Items & Ownership", h2_style))
            table_data = [["Task Description", "Assignee", "Priority", "Due Date", "Status"]]
            for item in action_items:
                table_data.append([
                    Paragraph(item.get("task_description", ""), body_style),
                    item.get("assignee_name", "Unassigned"),
                    item.get("priority", "Medium"),
                    item.get("due_date", "-"),
                    item.get("status", "Pending")
                ])
                
            t = Table(table_data, colWidths=[200, 90, 60, 70, 65])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 10))

        # Decisions Section
        decisions = meeting_data.get("decisions", [])
        if decisions:
            elements.append(Paragraph("Decisions Logged", h2_style))
            for d in decisions:
                elements.append(Paragraph(f"<b>[{d.get('category', 'General')}] {d.get('topic', '')}:</b> {d.get('decision_text', '')}", body_style))
                if d.get("rationale"):
                    elements.append(Paragraph(f"<i>Rationale:</i> {d.get('rationale')}", body_style))
                elements.append(Spacer(1, 4))
                
        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()
        
    except Exception as e:
        logger.error(f"Failed to generate PDF via ReportLab ({e}). Returning text bytes fallback.")
        text_content = f"MEETING MINUTES\nTitle: {meeting_data.get('title')}\n\nSummary:\n{meeting_data.get('summary', {}).get('executive_summary', '')}"
        return text_content.encode("utf-8")
