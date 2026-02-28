#!/usr/bin/env python3
"""Build the public Capability One-Pager PDF with explicit prior-work attribution."""

from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem

ROOT = Path(__file__).resolve().parents[1]
OUT_PUBLIC = ROOT / "public" / "NFPA_Capability_OnePager.pdf"
OUT_ROOT = ROOT.parent / "NatFord_CapabilityStatement_Designed.pdf"
OUT_LEGACY_1 = ROOT.parent / "capability_statement_final.pdf"
OUT_LEGACY_2 = ROOT.parent / "capability_statement_1page.pdf"


def build_pdf(out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=letter,
        leftMargin=0.62 * inch,
        rightMargin=0.62 * inch,
        topMargin=0.58 * inch,
        bottomMargin=0.58 * inch,
        title="Nat Ford Capability One-Pager",
        author="Nat Ford Planning & Analysis",
    )

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=19,
        leading=22,
        textColor=colors.HexColor("#0F3556"),
        spaceAfter=5,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11.2,
        leading=13.5,
        textColor=colors.HexColor("#0F3556"),
        spaceBefore=6,
        spaceAfter=2,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.6,
        leading=12.6,
        textColor=colors.HexColor("#1A1A1A"),
    )
    body_small = ParagraphStyle(
        "BodySmall",
        parent=body,
        fontSize=9.0,
        leading=11.5,
    )

    story = []

    story.append(Paragraph("Nat Ford Planning & Analysis", h1))
    story.append(
        Paragraph(
            "Transportation planning, GIS intelligence, and implementation support for public agencies and partner teams.",
            body,
        )
    )
    story.append(
        Paragraph(
            "Contact: nathaniel@natfordplanning.com &nbsp;&nbsp;|&nbsp;&nbsp; (530) 264-8801 (Google Voice) &nbsp;&nbsp;|&nbsp;&nbsp; https://www.natfordplanning.com/",
            body_small,
        )
    )
    story.append(Spacer(1, 8))

    story.append(Paragraph("Attribution & Experience Context (Important)", h2))
    story.append(
        Paragraph(
            "The representative project experience listed below was completed while Nathaniel Ford Redmond was employed at <b>Green DOT Transportation Solutions</b> as a <b>Senior Transportation Planner and Project Manager</b> for approximately <b>four years</b> (Aug 2021 – Oct 2025).",
            body,
        )
    )
    story.append(
        Paragraph(
            "These items are presented as prior-role experience and are <b>not</b> represented as projects delivered by Nat Ford Planning & Analysis.",
            body,
        )
    )

    story.append(Paragraph("Current Service Lanes", h2))
    services = [
        "Regional and corridor transportation planning support (RTP/ATP scopes, implementation-oriented diagnostics).",
        "GIS and spatial analytics (PostGIS workflows, map products, safety/accessibility diagnostics, automation).",
        "Grant strategy and narrative packaging (program fit, defensible assumptions, submission readiness).",
        "Technical writing and decision support artifacts for boards, commissions, and project partners.",
    ]
    story.append(
        ListFlowable(
            [ListItem(Paragraph(x, body), leftIndent=8) for x in services],
            bulletType="bullet",
            leftIndent=10,
            bulletFontName="Helvetica",
            bulletFontSize=8,
            bulletOffsetY=1,
        )
    )

    story.append(Paragraph("Representative Prior-Role Experience at Green DOT", h2))
    prior = [
        "Sierra County RTP: performance framing, fiscally constrained investment planning, and cross-agency coordination support.",
        "Del Norte County ATP: corridor gap diagnostics and packaging toward grant-ready project concepts.",
        "Tehama County VMT + climate work: implementation pathways tied to actionable capital program recommendations.",
        "Plumas Transit FTA 5339 program support: facility and fleet-readiness planning components.",
        "Rural and tribal agency support across Northern California with emphasis on fundability and implementation realism.",
    ]
    story.append(
        ListFlowable(
            [ListItem(Paragraph(x, body), leftIndent=8) for x in prior],
            bulletType="bullet",
            leftIndent=10,
            bulletFontName="Helvetica",
            bulletFontSize=8,
            bulletOffsetY=1,
        )
    )

    story.append(Paragraph("Operating Standards", h2))
    story.append(
        Paragraph(
            "Every engagement is scoped with explicit assumptions, transparent constraints, and practical delivery steps to maintain technical defensibility and long-term trust.",
            body,
        )
    )

    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            "Document note: Prior-role experience attribution above is intentionally explicit for transparency and client clarity.",
            body_small,
        )
    )

    doc.build(story)


def main() -> None:
    build_pdf(OUT_PUBLIC)
    # Keep legacy/canonical PDFs in sync with the same attribution language.
    for extra in (OUT_ROOT, OUT_LEGACY_1, OUT_LEGACY_2):
        build_pdf(extra)
    print(f"Built: {OUT_PUBLIC}")
    print(f"Synced: {OUT_ROOT}")
    print(f"Synced: {OUT_LEGACY_1}")
    print(f"Synced: {OUT_LEGACY_2}")


if __name__ == "__main__":
    main()
