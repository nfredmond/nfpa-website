#!/usr/bin/env python3
"""Build the Funding Readiness Scorecard worksheet PDF.

This keeps the public worksheet reproducible instead of relying on one-off manual exports.
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUT_PUBLIC = ROOT / "public" / "Funding_Readiness_Scorecard_Worksheet.pdf"

QUESTIONS = [
    (
        "Plan freshness",
        "Do you have a current adopted plan, corridor study, capital program, or board-recognized planning document that clearly supports this project?",
    ),
    (
        "Project definition clarity",
        "Is the project scope clear enough to explain location, purpose, limits, and the phase you are asking funding to support?",
    ),
    (
        "Cost estimate basis",
        "Do you have a documented cost estimate basis that is appropriate for this phase and recent enough to defend?",
    ),
    (
        "Match readiness",
        "Have you identified likely match requirements, constraints, and the realistic source of any local share?",
    ),
    (
        "Outreach evidence",
        "Do you have recent outreach, stakeholder input, or community need evidence that supports the project narrative?",
    ),
    (
        "Data and mapping readiness",
        "Are the core maps, location data, crash/safety data, demand context, or other supporting evidence organized and usable?",
    ),
    (
        "Board or leadership readiness",
        "Do you know what board action, tribal approval, executive signoff, or internal authorization will be needed to submit on time?",
    ),
    (
        "Narrative support materials",
        "Can you already point to the core benefits, target users, implementation story, and why-now case in plain language?",
    ),
    (
        "Delivery capacity",
        "If funding lands, do you have a realistic path for consultant support, internal staffing, procurement, or delivery sequencing?",
    ),
    (
        "Package discipline",
        "Are supporting attachments, schedules, GIS figures, partner letters, and submission responsibilities organized for clean package assembly?",
    ),
]

RESULT_ROWS = [
    (
        "0–9",
        "Needs Foundation Work",
        "Focus on definition, evidence, approvals, and the basic narrative package before chasing a live application window.",
    ),
    (
        "10–15",
        "Almost Ready",
        "Close the highest-leverage gaps so the application story, technical support, and internal approvals are aligned before submission.",
    ),
    (
        "16–20",
        "Ready to Pursue",
        "Use the remaining time to tighten program fit, submission discipline, and final evidence for a clean, defensible package.",
    ),
]


def build_pdf(out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=letter,
        leftMargin=0.68 * inch,
        rightMargin=0.68 * inch,
        topMargin=0.72 * inch,
        bottomMargin=0.72 * inch,
        title="Funding Readiness Scorecard Worksheet",
        author="Nat Ford Planning & Analysis",
    )

    styles = getSampleStyleSheet()
    brand = colors.HexColor("#0F3556")
    ink = colors.HexColor("#1F2937")
    muted = colors.HexColor("#5B6674")
    line = colors.HexColor("#D9E0E7")
    sand = colors.HexColor("#F3F1EC")

    title = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=21,
        textColor=brand,
        spaceAfter=2,
    )
    subtitle = ParagraphStyle(
        "Subtitle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=12.2,
        textColor=ink,
        spaceAfter=8,
    )
    small = ParagraphStyle(
        "Small",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.6,
        leading=10.8,
        textColor=muted,
    )
    heading = ParagraphStyle(
        "Heading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=13,
        textColor=brand,
        spaceBefore=3,
        spaceAfter=5,
    )
    th = ParagraphStyle(
        "TableHeader",
        parent=small,
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=9.5,
        textColor=brand,
    )
    cell = ParagraphStyle(
        "TableCell",
        parent=small,
        fontSize=8.3,
        leading=10.3,
        textColor=ink,
    )
    cell_bold = ParagraphStyle(
        "TableCellBold",
        parent=cell,
        fontName="Helvetica-Bold",
    )

    story = []
    story.append(Paragraph("Nat Ford Planning & Analysis", small))
    story.append(Paragraph("Funding Readiness Scorecard Worksheet", title))
    story.append(
        Paragraph(
            "Use this worksheet to check whether a transportation project package is ready for a focused funding push. "
            "Score each item as 0 = Not in place, 1 = Partial, or 2 = Ready. This is a self-assessment tool, not a guarantee of award.",
            subtitle,
        )
    )

    score_key = Table(
        [[Paragraph("Score key", th), Paragraph("0 = Not in place", cell), Paragraph("1 = Partial", cell), Paragraph("2 = Ready", cell)]],
        colWidths=[1.1 * inch, 1.35 * inch, 1.05 * inch, 1.0 * inch],
    )
    score_key.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), sand),
                ("BOX", (0, 0), (-1, -1), 0.75, line),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, line),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    story.append(score_key)
    story.append(Spacer(1, 10))

    question_rows = [[
        Paragraph("#", th),
        Paragraph("Domain", th),
        Paragraph("Question", th),
        Paragraph("Score", th),
        Paragraph("Notes / missing evidence", th),
    ]]

    for index, (domain, question) in enumerate(QUESTIONS, start=1):
        question_rows.append(
            [
                Paragraph(str(index), cell_bold),
                Paragraph(domain, cell),
                Paragraph(question, cell),
                Paragraph("0  1  2", cell_bold),
                Paragraph("__________________________", cell),
            ]
        )

    questions_table = Table(
        question_rows,
        colWidths=[0.35 * inch, 1.15 * inch, 3.0 * inch, 0.6 * inch, 1.15 * inch],
        repeatRows=1,
    )
    questions_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), sand),
                ("TEXTCOLOR", (0, 0), (-1, 0), brand),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, line),
                ("BOX", (0, 0), (-1, -1), 0.75, line),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(questions_table)
    story.append(PageBreak())

    story.append(Paragraph("Result bands", heading))

    result_rows = [[
        Paragraph("Total score", th),
        Paragraph("Result band", th),
        Paragraph("Recommended next step", th),
    ]]
    for total, band, next_step in RESULT_ROWS:
        result_rows.append([
            Paragraph(total, cell_bold),
            Paragraph(band, cell_bold),
            Paragraph(next_step, cell),
        ])

    result_table = Table(result_rows, colWidths=[1.0 * inch, 1.55 * inch, 4.05 * inch], repeatRows=1)
    result_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), sand),
                ("TEXTCOLOR", (0, 0), (-1, 0), brand),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, line),
                ("BOX", (0, 0), (-1, -1), 0.75, line),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(result_table)
    story.append(Spacer(1, 12))

    story.append(Paragraph("Notes for internal review", heading))
    review_lines = [
        "Highest-priority gaps to close: ________________________________________________",
        "Owner(s): ____________________________________________________________________",
        "Target funding window / program: ______________________________________________",
        "First three next actions: ______________________________________________________",
        "If you want a scoped review of the biggest readiness gaps, use the website intake at natfordplanning.com/contact/funding-readiness.",
    ]
    for line in review_lines:
        story.append(Paragraph(line, cell))
        story.append(Spacer(1, 4))

    doc.build(story)


def main() -> None:
    build_pdf(OUT_PUBLIC)
    print(f"Built: {OUT_PUBLIC}")


if __name__ == "__main__":
    main()
