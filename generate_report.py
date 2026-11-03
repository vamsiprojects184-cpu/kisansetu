#!/usr/bin/env python3
"""
KisanSetu Project Report Generator
Generates a professional college project report (.docx) for Malla Reddy University
"""

from docx import Document
from docx.shared import Pt, Inches, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy

# ─── Helpers ────────────────────────────────────────────────────────────────

def set_font(run, name="Times New Roman", size=12, bold=False, color=None):
    run.font.name = name
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = RGBColor(0, 0, 0) if color is None else color
    # Ensure font applies to East-Asian / complex-script too
    r = run._r
    rPr = r.get_or_add_rPr()
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:ascii'), name)
    rFonts.set(qn('w:hAnsi'), name)
    rFonts.set(qn('w:cs'), name)
    rFonts.set(qn('w:eastAsia'), name)
    existing = rPr.find(qn('w:rFonts'))
    if existing is not None:
        rPr.remove(existing)
    rPr.insert(0, rFonts)

def set_para_spacing(para, space_after=6, line_spacing=1.5):
    pPr = para._p.get_or_add_pPr()
    spacing = OxmlElement('w:spacing')
    spacing.set(qn('w:after'), str(int(space_after * 20)))   # twips
    spacing.set(qn('w:line'), str(int(line_spacing * 240)))  # 240 = single
    spacing.set(qn('w:lineRule'), 'auto')
    existing = pPr.find(qn('w:spacing'))
    if existing is not None:
        pPr.remove(existing)
    pPr.append(spacing)

def add_body_para(doc, text, align=WD_ALIGN_PARAGRAPH.JUSTIFY,
                  size=12, bold=False, font="Times New Roman",
                  space_after=6, line_spacing=1.5):
    para = doc.add_paragraph()
    para.alignment = align
    set_para_spacing(para, space_after, line_spacing)
    run = para.add_run(text)
    set_font(run, font, size, bold)
    return para

def add_heading(doc, text, level_size=14, centered=True, caps=False):
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER if centered else WD_ALIGN_PARAGRAPH.LEFT
    set_para_spacing(para, 6, 1.5)
    label = text.upper() if caps else text
    run = para.add_run(label)
    set_font(run, "Times New Roman", level_size, bold=True)
    return para

def add_section_heading(doc, text):
    """12pt Bold left-aligned section heading (e.g. 1.1 Introduction)"""
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.LEFT
    set_para_spacing(para, 6, 1.5)
    run = para.add_run(text)
    set_font(run, "Times New Roman", 12, bold=True)
    return para

def add_code_block(doc, code_text, label=None):
    if label:
        lp = doc.add_paragraph()
        lp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        set_para_spacing(lp, 3, 1.0)
        lr = lp.add_run(label)
        set_font(lr, "Times New Roman", 11, bold=True)
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.LEFT
    set_para_spacing(para, 6, 1.0)
    # shade background lightly
    pPr = para._p.get_or_add_pPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), 'F2F2F2')
    pPr.append(shd)
    run = para.add_run(code_text)
    set_font(run, "Courier New", 10, bold=False)
    return para

def page_break(doc):
    para = doc.add_paragraph()
    run = para.add_run()
    run.add_break(break_type=None)
    para.runs[0]._r.append(OxmlElement('w:br'))
    para.runs[0]._r.find(qn('w:br')).set(qn('w:type'), 'page')

# ─── Header / Footer helpers ─────────────────────────────────────────────────

def add_header_footer(section, header_text="KisanSetu"):
    """Add centered header and centered page number footer."""
    # Header
    section.header_distance = Cm(1.27)
    section.footer_distance = Cm(1.27)
    header = section.header
    header.is_linked_to_previous = False
    # Clear existing paragraphs
    for p in header.paragraphs:
        p.clear()
    hp = header.paragraphs[0] if header.paragraphs else header.add_paragraph()
    hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    hr = hp.add_run(header_text)
    set_font(hr, "Times New Roman", 12, bold=False)

    # Footer with page number field
    footer = section.footer
    footer.is_linked_to_previous = False
    for p in footer.paragraphs:
        p.clear()
    fp = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_page_number(fp)

def add_page_number(paragraph):
    """Insert PAGE field into paragraph."""
    fldChar1 = OxmlElement('w:fldChar')
    fldChar1.set(qn('w:fldCharType'), 'begin')
    instrText = OxmlElement('w:instrText')
    instrText.text = ' PAGE '
    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'end')
    run = paragraph.add_run()
    set_font(run, "Times New Roman", 12)
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)

def blank_header_footer(section):
    """Make header/footer empty (for cover page)."""
    section.header.is_linked_to_previous = False
    section.footer.is_linked_to_previous = False
    for part in [section.header, section.footer]:
        for p in part.paragraphs:
            p.clear()

def new_section_with_header(doc):
    """Add a page break that also starts a new section, then set header/footer."""
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
    # Add paragraph with section break
    p = doc.add_paragraph()
    pPr = p._p.get_or_add_pPr()
    sectPr = OxmlElement('w:sectPr')
    pgMar = OxmlElement('w:pgMar')
    pgMar.set(qn('w:top'), str(int(1 * 1440)))
    pgMar.set(qn('w:right'), str(int(1 * 1440)))
    pgMar.set(qn('w:bottom'), str(int(1 * 1440)))
    pgMar.set(qn('w:left'), str(int(1.25 * 1440)))
    pgMar.set(qn('w:header'), '720')
    pgMar.set(qn('w:footer'), '720')
    sectPr.append(pgMar)
    pgSz = OxmlElement('w:pgSz')
    pgSz.set(qn('w:w'), '12240')
    pgSz.set(qn('w:h'), '15840')
    sectPr.append(pgSz)
    pPr.append(sectPr)
    return p

# ─── Table helper ────────────────────────────────────────────────────────────

def set_table_borders(table, show=True):
    tbl = table._tbl
    tblPr = tbl.tblPr
    if tblPr is None:
        tblPr = OxmlElement('w:tblPr')
        tbl.insert(0, tblPr)
    tblBorders = OxmlElement('w:tblBorders')
    val = 'single' if show else 'none'
    sz = '4' if show else '0'
    for border_name in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        border = OxmlElement(f'w:{border_name}')
        border.set(qn('w:val'), val)
        border.set(qn('w:sz'), sz)
        border.set(qn('w:space'), '0')
        border.set(qn('w:color'), 'auto')
        tblBorders.append(border)
    existing = tblPr.find(qn('w:tblBorders'))
    if existing is not None:
        tblPr.remove(existing)
    tblPr.append(tblBorders)

def add_toc_row(table, col1, col2, col3, bold=False):
    row = table.add_row()
    cells = row.cells
    for i, txt in enumerate([col1, col2, col3]):
        p = cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT if i < 2 else WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(txt)
        set_font(run, "Times New Roman", 12, bold=bold)

# ─── Main document generation ─────────────────────────────────────────────────

def generate_report():
    doc = Document()

    # Page size and margins for the whole doc
    for section in doc.sections:
        section.page_width = Inches(8.5)
        section.page_height = Inches(11)
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1.25)
        section.right_margin = Inches(1)

    # Default style: Times New Roman 12pt
    style = doc.styles['Normal']
    style.font.name = "Times New Roman"
    style.font.size = Pt(12)
    style.font.color.rgb = RGBColor(0, 0, 0)

    # ── COVER PAGE ─────────────────────────────────────────────────────────
    section0 = doc.sections[0]
    blank_header_footer(section0)

    # 3 blank lines
    for _ in range(3):
        p = doc.add_paragraph()
        set_para_spacing(p, 6, 1.5)
        p.add_run(" ")

    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_para_spacing(p_title, 12, 1.5)
    r = p_title.add_run("TITLE OF THE APPLICATION: KISANSETU")
    set_font(r, "Times New Roman", 16, bold=True)

    # Blank line
    add_body_para(doc, " ", align=WD_ALIGN_PARAGRAPH.CENTER)

    # Submission text
    lines_intro = [
        "A project report submitted in partial fulfillment of the requirements for the completion of",
        "application development in Bachelor of Technology",
        "In",
        "Computer Science and Engineering",
    ]
    for line in lines_intro:
        add_body_para(doc, line, align=WD_ALIGN_PARAGRAPH.CENTER)

    # 2 blank lines
    for _ in range(2):
        add_body_para(doc, " ", align=WD_ALIGN_PARAGRAPH.CENTER)

    # By
    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_para_spacing(p_by, 6, 1.5)
    r_by = p_by.add_run("By")
    set_font(r_by, "Times New Roman", 14, bold=True)

    # blank line
    add_body_para(doc, " ", align=WD_ALIGN_PARAGRAPH.CENTER)

    # Names
    names = [
        "G. Vishal Reddy        (2511CS010128)",
        "K. Dhana Lakshmi    (2511CS010101)",
        "N. Bhumika              (2511CS010178)",
        "A. Manohitha           (2511CS010159)",
    ]
    for name in names:
        add_body_para(doc, name, align=WD_ALIGN_PARAGRAPH.CENTER)

    # 2 blank lines
    for _ in range(2):
        add_body_para(doc, " ", align=WD_ALIGN_PARAGRAPH.CENTER)

    # Guidance lines
    guide_lines = [
        "Under the Guidance of Mrs. D. Suneetha",
        "Assistant Professor",
        "",
        "Department of Computer Science & Engineering",
        "MALLA REDDY UNIVERSITY, HYDERABAD",
        "2026-2027",
    ]
    for line in guide_lines:
        add_body_para(doc, line, align=WD_ALIGN_PARAGRAPH.CENTER)

    # ── CERTIFICATE PAGE ───────────────────────────────────────────────────
    doc.add_page_break()
    # New section for header/footer
    # We'll manage sections via doc.sections after building content
    add_heading(doc, "CERTIFICATE")

    cert_text = (
        "This is to certify that this is the Application development lab record entitled "
        "'KISANSETU', submitted by G. VISHAL REDDY (2511CS010128), K. DHANA LAKSHMI "
        "(2511CS010101), N. BHUMIKA (2511CS010178), A. MANOHITHA (2511CS010159), B.Tech "
        "II year I semester, Department of CSE during the year 2026-27. The results embodied "
        "in this report have not been submitted to any other university or institute for the "
        "award of any degree or diploma."
    )
    add_body_para(doc, cert_text)

    # 2-col table (no borders)
    cert_table = doc.add_table(rows=1, cols=2)
    cert_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(cert_table, show=False)
    cert_table.columns[0].width = Inches(3.5)
    cert_table.columns[1].width = Inches(3.0)
    row = cert_table.rows[0]
    left_lines = ["Internal Guide", "Mrs. D. Suneetha", "Assistant Professor, CSE"]
    right_lines = ["DEAN CSE", "Dr. A.V.L.N. Sujith"]

    left_cell = row.cells[0]
    left_cell.paragraphs[0].clear()
    for i, line in enumerate(left_lines):
        if i == 0:
            p = left_cell.paragraphs[0]
        else:
            p = left_cell.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        set_para_spacing(p, 3, 1.5)
        r = p.add_run(line)
        set_font(r, "Times New Roman", 12, bold=(i == 0))

    right_cell = row.cells[1]
    right_cell.paragraphs[0].clear()
    for i, line in enumerate(right_lines):
        if i == 0:
            p = right_cell.paragraphs[0]
        else:
            p = right_cell.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        set_para_spacing(p, 3, 1.5)
        r = p.add_run(line)
        set_font(r, "Times New Roman", 12, bold=(i == 0))

    add_body_para(doc, " ")
    ext_p = doc.add_paragraph()
    ext_p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    set_para_spacing(ext_p, 6, 1.5)
    r_ext = ext_p.add_run("External Examiner: _______________")
    set_font(r_ext, "Times New Roman", 12)

    # ── DECLARATION PAGE ────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "DECLARATION")

    decl_text = (
        "We declare that this project report titled KISANSETU submitted in partial fulfillment "
        "of the degree of B.Tech in CSE is a record of original work carried out by us under "
        "the supervision of MRS. D. SUNEETHA, and has not formed the basis for the award of "
        "any other degree or diploma, in this or any other Institution or University. In keeping "
        "with the ethical practice in reporting scientific information, due acknowledgements have "
        "been made wherever the findings of others have been cited."
    )
    add_body_para(doc, decl_text)
    add_body_para(doc, " ")

    # Right-aligned names
    decl_names = [
        "G. Vishal Reddy     2511CS010128",
        "K. Dhana Lakshmi  2511CS010101",
        "N. Bhumika           2511CS010178",
        "A. Manohitha        2511CS010159",
    ]
    for name in decl_names:
        add_body_para(doc, name, align=WD_ALIGN_PARAGRAPH.RIGHT)

    # ── ACKNOWLEDGEMENT PAGE ─────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "ACKNOWLEDGEMENT")

    ack_paras = [
        ("It gives us immense pleasure to express our profound gratitude to all those who "
         "extended their valuable support, encouragement, and guidance in the successful "
         "completion of this project."),
        ("We would like to express our heartfelt thanks to Dr. V.S.K. Reddy, Hon'ble "
         "Vice-Chancellor of Malla Reddy University, for providing an excellent academic "
         "environment and necessary facilities. We are deeply indebted to Dr. A.V.L.N. Sujith, "
         "Dean, Department of Computer Science and Engineering, for his valuable support and "
         "continuous encouragement throughout this project."),
        ("We express our sincere gratitude to our project guide, Mrs. D. Suneetha, Assistant "
         "Professor, CSE, for her invaluable guidance, constructive suggestions, and constant "
         "supervision during every phase of this project. We also extend our thanks to all "
         "faculty members of the Department of CSE for their cooperation. Finally, we express "
         "our deep gratitude to our parents and friends for their unwavering support and "
         "motivation."),
    ]
    for para_text in ack_paras:
        add_body_para(doc, para_text)

    add_body_para(doc, " ")
    for name in decl_names:
        add_body_para(doc, name, align=WD_ALIGN_PARAGRAPH.RIGHT)

    # ── ABSTRACT PAGE ────────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "ABSTRACT")

    abstract_paras = [
        ("KISANSETU is an AI-based smart agriculture platform designed to help farmers improve "
         "farming practices and increase agricultural productivity using modern technology. "
         "Agriculture is one of the most important sectors in India, as many people depend on "
         "farming for their livelihood. Farmers face many challenges such as poor soil health, "
         "crop diseases, changing weather conditions, high fertilizer costs, and unpredictable "
         "market prices."),
        ("The main aim of KISANSETU is to solve these problems by providing useful farming "
         "information and digital services through a single platform. The system uses Artificial "
         "Intelligence (AI) and machine learning to provide soil health analysis, crop "
         "recommendations, fertilizer recommendations, crop disease detection, and market price "
         "prediction. These features help farmers make better decisions, reduce unnecessary "
         "expenses, and improve crop management."),
        ("KISANSETU also provides an online seed marketplace and a consumer marketplace to "
         "connect farmers directly with buyers. It includes farm-to-home delivery, product "
         "quality verification, secure payments, and order tracking. The platform also offers "
         "weather updates, farming alerts, and smart irrigation recommendations. A farmer "
         "dashboard, voice assistant, and multiple Indian language support make the system easy "
         "to use. Overall, KISANSETU aims to make agriculture smarter, more accessible, and "
         "more efficient."),
    ]
    for para_text in abstract_paras:
        add_body_para(doc, para_text)

    # ── TABLE OF CONTENTS ─────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "TABLE OF CONTENTS")

    toc_table = doc.add_table(rows=1, cols=3)
    set_table_borders(toc_table, show=True)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header row
    hrow = toc_table.rows[0]
    for i, h in enumerate(["CHAPTER NO.", "TITLE", "PAGE NO."]):
        p = hrow.cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        set_font(r, "Times New Roman", 12, bold=True)

    toc_entries = [
        ("1", "Introduction", ""),
        ("", "1.1 Introduction", ""),
        ("", "1.2 Problem Statement", ""),
        ("", "1.3 Objectives of Project", ""),
        ("2", "Problem Identification", ""),
        ("", "2.1 Existing System", ""),
        ("", "2.2 Proposed System", ""),
        ("3", "Requirements", ""),
        ("", "3.1 Software Requirements", ""),
        ("", "3.2 Hardware Requirements", ""),
        ("4", "Design and Implementation", ""),
        ("", "4.1 Design", ""),
        ("", "4.2 Implementation", ""),
        ("", "4.3 Testing", ""),
        ("5", "Source Code & Screenshots", ""),
        ("", "5.1 Source Code", ""),
        ("", "5.2 Screenshots of Application", ""),
        ("6", "Results & Conclusion", ""),
        ("", "6.1 Results", ""),
        ("", "6.2 Conclusion", ""),
        ("", "References", ""),
    ]
    for c1, c2, c3 in toc_entries:
        add_toc_row(toc_table, c1, c2, c3, bold=(c1.isdigit() and c1 != ""))

    # ── LIST OF FIGURES ───────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "LIST OF FIGURES")

    fig_table = doc.add_table(rows=1, cols=3)
    set_table_borders(fig_table, show=True)
    fig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hrow2 = fig_table.rows[0]
    for i, h in enumerate(["FIGURE NO.", "NAME OF THE FIGURE", "PAGE NO."]):
        p = hrow2.cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        set_font(r, "Times New Roman", 12, bold=True)

    figures = [
        ("Fig. 1", "Login Page", ""),
        ("Fig. 2", "Farmer Dashboard", ""),
        ("Fig. 3", "Soil Health Analysis", ""),
        ("Fig. 4", "Crop Disease Detection", ""),
        ("Fig. 5", "Marketplace", ""),
        ("Fig. 6", "AI Chat Assistant", ""),
        ("Fig. 7", "Weather & Irrigation", ""),
        ("Fig. 8", "Admin Dashboard", ""),
    ]
    for c1, c2, c3 in figures:
        add_toc_row(fig_table, c1, c2, c3, bold=False)

    # ── CHAPTER 1 ─────────────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "CHAPTER \u2013 1", caps=False)
    add_heading(doc, "INTRODUCTION", caps=False)

    add_section_heading(doc, "1.1 Introduction")
    ch1_intro_paras = [
        ("KISANSETU is an AI-based smart agriculture platform developed to support farmers by "
         "using modern technology and Artificial Intelligence (AI). Agriculture is one of the "
         "most important sectors in India, as many people depend on farming for their livelihood. "
         "Farmers face many problems such as poor soil quality, crop diseases, lack of proper "
         "farming information, high fertilizer costs, changing weather conditions, and low market "
         "prices. KISANSETU is designed to solve these problems by providing a single digital "
         "platform that helps farmers manage their farming activities easily and effectively."),
        ("The platform provides AI-based soil testing and soil health analysis to help farmers "
         "understand soil conditions. Based on this information, it recommends suitable crops "
         "and fertilizers, reducing unnecessary expenses and supporting better crop growth. "
         "KISANSETU also includes an AI-based crop disease detection system that helps farmers "
         "identify possible crop diseases by analyzing images of affected plants. Early "
         "identification helps farmers take suitable action and protect their crops from further "
         "damage."),
        ("Another important feature is the AI-based market price prediction system. Agricultural "
         "product prices change depending on demand, supply, season, and market conditions. This "
         "feature provides useful market price information so that farmers can make better selling "
         "decisions. KISANSETU also provides a seed marketplace and a consumer marketplace that "
         "connects farmers directly with customers, reducing dependence on intermediaries. Through "
         "farm-to-home delivery, agricultural products can be delivered directly from farmers to "
         "consumers."),
    ]
    for pt in ch1_intro_paras:
        add_body_para(doc, pt)

    add_section_heading(doc, "1.2 Problem Statement")
    ps_paras = [
        ("Agriculture is one of the major sources of income for many people in India. Farmers "
         "face several challenges in their daily farming activities such as poor soil health, "
         "crop diseases, unsuitable crop selection, high fertilizer costs, unpredictable weather "
         "conditions, water wastage, and changes in market prices. Many farmers do not have easy "
         "access to accurate agricultural information and modern technologies that can help them "
         "make better farming decisions. As a result, they experience low crop production, "
         "financial losses, and difficulties in selling their products at fair prices."),
        ("Another major problem is the involvement of multiple intermediaries between farmers and "
         "consumers, which reduces the profit received by farmers. Farmers also struggle to find "
         "quality seeds, suitable fertilizers, reliable buyers, and updated market information. "
         "Language barriers and a lack of digital knowledge can make it difficult for some farmers "
         "to use existing online agricultural services."),
        ("KISANSETU aims to address these problems by developing an AI-based smart agriculture "
         "platform that provides soil health analysis, crop and fertilizer recommendations, crop "
         "disease detection, market price prediction, weather updates, and smart irrigation "
         "recommendations. It also connects farmers directly with consumers through a digital "
         "marketplace."),
    ]
    for pt in ps_paras:
        add_body_para(doc, pt)

    add_section_heading(doc, "1.3 Objectives of the Project")
    obj_intro = ("The main objective of the KISANSETU project is to develop an AI-based smart "
                 "agriculture platform that helps farmers improve their farming practices, increase "
                 "crop productivity, reduce farming costs, and earn better profits. The specific "
                 "objectives are:")
    add_body_para(doc, obj_intro)

    objectives = [
        "1.  To develop an AI-based soil health analysis and crop recommendation system.",
        "2.  To implement a crop disease detection system using image analysis.",
        "3.  To provide fertilizer recommendations based on soil and crop conditions.",
        "4.  To develop a market price prediction feature to help farmers make better selling decisions.",
        "5.  To create a digital marketplace connecting farmers directly with consumers.",
        "6.  To provide weather updates, farming alerts, and smart irrigation recommendations.",
        "7.  To support multiple Indian languages and include a voice assistant for accessibility.",
        "8.  To integrate a farmer dashboard providing all important information in one place.",
        "9.  To implement a seed marketplace and farm-to-home delivery service.",
        "10. To promote smart, efficient, and sustainable agriculture using digital technology.",
    ]
    for obj in objectives:
        add_body_para(doc, obj)

    # ── CHAPTER 2 ─────────────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "CHAPTER \u2013 2", caps=False)
    add_heading(doc, "PROBLEM IDENTIFICATION", caps=False)

    add_section_heading(doc, "2.1 Existing System")
    existing_paras = [
        ("The existing system of agriculture mainly depends on traditional farming methods, "
         "farmers' personal experience, and basic agricultural services. Farmers usually select "
         "crops based on their knowledge and previous experience. Soil testing is carried out "
         "through laboratories or agricultural centers that require farmers to visit in person. "
         "Getting suitable crop and fertilizer recommendations is difficult when farmers do not "
         "have easy access to accurate agricultural information."),
        ("In the existing system, farmers face difficulties in obtaining updated weather "
         "information, managing irrigation, and predicting market prices. Without proper guidance, "
         "farmers may use more water or fertilizers than necessary, increasing farming costs. "
         "Market prices change frequently and farmers may not always have access to reliable "
         "market information."),
        ("Another major limitation is agricultural marketing. Farmers depend on intermediaries, "
         "local traders, or wholesale markets to sell their produce. This reduces the profit "
         "received by farmers. Although some online agricultural platforms exist, their services "
         "focus on specific activities rather than combining all services in one place."),
    ]
    for pt in existing_paras:
        add_body_para(doc, pt)

    add_section_heading(doc, "Limitations of Existing System:")
    limitations = [
        "1.  Lack of easy access to soil testing facilities and soil health information.",
        "2.  Difficulty in selecting suitable crops based on soil conditions and weather.",
        "3.  Manual crop disease identification is difficult and time-consuming.",
        "4.  Lack of proper fertilizer guidance leads to unnecessary expenses.",
        "5.  Farmers do not know the right time to sell their products at better prices.",
        "6.  Intermediaries reduce the profits farmers receive from selling products.",
        "7.  Inadequate weather information makes farming decisions difficult.",
        "8.  Traditional irrigation methods result in unnecessary water usage.",
        "9.  Farmers face difficulties selling products directly to consumers.",
        "10. Language barriers make it difficult to understand agricultural information.",
        "11. Farmers may need different applications for different services \u2014 no single platform.",
    ]
    for lim in limitations:
        add_body_para(doc, lim)

    add_section_heading(doc, "2.2 Proposed System")
    proposed_paras = [
        ("The proposed system, KISANSETU, is an AI-based smart agriculture platform designed to "
         "help farmers overcome the problems of traditional farming. It combines Artificial "
         "Intelligence and digital technology to provide farming guidance and marketplace services "
         "through a single platform."),
        ("The system includes AI-based soil testing and soil health analysis to help farmers "
         "understand soil conditions. Based on this, it provides crop and fertilizer "
         "recommendations. The AI-based crop disease detection feature helps identify possible "
         "plant diseases using images. The market price prediction feature provides estimated "
         "prices and market trends."),
        ("KISANSETU also provides an online seed marketplace and a consumer marketplace where "
         "farmers can connect directly with buyers. Farm-to-home delivery, secure payments, order "
         "tracking, and product quality verification improve the agricultural marketing process. "
         "Weather updates, farming alerts, and smart irrigation recommendations support better "
         "farming decisions. A farmer dashboard, voice assistant, and multiple Indian language "
         "options make the platform easy to use."),
    ]
    for pt in proposed_paras:
        add_body_para(doc, pt)

    add_section_heading(doc, "Advantages of Proposed System:")
    advantages = [
        "1.  Recommends suitable crops based on soil conditions using AI.",
        "2.  Detects crop diseases using AI-based image analysis.",
        "3.  Suggests suitable fertilizers for better crop production.",
        "4.  Predicts market prices to support better selling decisions.",
        "5.  Reduces dependence on middlemen by connecting farmers directly with buyers.",
        "6.  Provides an online seed marketplace for easy seed access.",
        "7.  Gives weather updates and farming alerts for better planning.",
        "8.  Recommends efficient irrigation methods to save water.",
        "9.  Reduces unnecessary farming expenses.",
        "10. Supports farm-to-home delivery for fresh produce.",
        "11. Provides secure payments and order tracking.",
        "12. Supports multiple Indian languages and a voice assistant.",
        "13. Saves farmers' time by combining all services on one platform.",
    ]
    for adv in advantages:
        add_body_para(doc, adv)

    # ── CHAPTER 3 ─────────────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "CHAPTER \u2013 3", caps=False)
    add_heading(doc, "REQUIREMENTS", caps=False)

    add_section_heading(doc, "3.1 Software Requirements")
    sw_text = (
        "The KISANSETU project uses the following software technologies:"
    )
    add_body_para(doc, sw_text)

    sw_items = [
        ("Frontend:", "Next.js 16 (React 19), TypeScript, Tailwind CSS v4, Shadcn/UI component library, Framer Motion for animations, Lucide React for icons."),
        ("State Management:", "Zustand for global state management, TanStack React Query for server state."),
        ("Backend & Database:", "Prisma ORM v6 with PostgreSQL (Supabase), Next.js API Routes for server-side logic."),
        ("AI & Data:", "Mock AI response engine (expandable to Gemini/OpenAI API), real-time weather simulation, market price prediction module."),
        ("Authentication:", "NextAuth.js v4 for secure session management."),
        ("Deployment:", "Vercel (production), Supabase PostgreSQL (database), Bun as package manager and runtime."),
        ("Development Tools:", "Visual Studio Code, Git for version control, Bun v1.3 runtime."),
        ("Browser Support:", "Google Chrome, Microsoft Edge, Mozilla Firefox, Safari."),
        ("Internet:", "Required for marketplace, weather updates, and real-time features."),
    ]
    for label, detail in sw_items:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        set_para_spacing(p, 6, 1.5)
        r_label = p.add_run(label + " ")
        set_font(r_label, "Times New Roman", 12, bold=True)
        r_detail = p.add_run(detail)
        set_font(r_detail, "Times New Roman", 12, bold=False)

    add_section_heading(doc, "3.2 Hardware Requirements")

    hw_dev = [
        ("Development Machine:", ""),
        ("Processor:", "Intel Core i3 or equivalent (i5/i7 recommended)"),
        ("RAM:", "Minimum 4 GB (8 GB recommended for AI tasks)"),
        ("Storage:", "Minimum 256 GB SSD"),
        ("Display:", "1366 \u00d7 768 resolution or higher"),
        ("Internet:", "Broadband connection required"),
    ]
    for label, detail in hw_dev:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        set_para_spacing(p, 6, 1.5)
        r_label = p.add_run(label + (" " if detail else ""))
        set_font(r_label, "Times New Roman", 12, bold=True)
        if detail:
            r_detail = p.add_run(detail)
            set_font(r_detail, "Times New Roman", 12, bold=False)

    hw_user = [
        ("End User (Farmer):", ""),
        ("Device:", "Smartphone, tablet, or computer with modern web browser"),
        ("Internet:", "Mobile data (3G/4G/5G) or Wi-Fi"),
        ("Camera:", "Required for crop disease detection (image upload feature)"),
        ("Operating System:", "Any modern OS: Windows 10/11, Android, iOS, macOS"),
    ]
    for label, detail in hw_user:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        set_para_spacing(p, 6, 1.5)
        r_label = p.add_run(label + (" " if detail else ""))
        set_font(r_label, "Times New Roman", 12, bold=True)
        if detail:
            r_detail = p.add_run(detail)
            set_font(r_detail, "Times New Roman", 12, bold=False)

    # ── CHAPTER 4 ─────────────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "CHAPTER \u2013 4", caps=False)
    add_heading(doc, "DESIGN AND IMPLEMENTATION", caps=False)

    add_section_heading(doc, "4.1 Design")
    design_paras = [
        ("The design of KISANSETU is developed to provide a simple and user-friendly platform "
         "for farmers. The system follows a multi-role architecture with dedicated dashboards for "
         "Farmers, Consumers, Collection Centers, Agricultural Experts, and Administrators."),
    ]
    for pt in design_paras:
        add_body_para(doc, pt)

    design_sections = [
        ("System Architecture:", "The KISANSETU system is built on a client-server architecture "
         "using Next.js, which provides both frontend rendering and backend API handling. The "
         "frontend communicates with the backend via API routes, which in turn interact with the "
         "Supabase PostgreSQL database through Prisma ORM."),
        ("Frontend Design:", "The frontend uses Next.js 16 with React 19 and Tailwind CSS v4 "
         "for responsive design. The interface includes a collapsible sidebar for desktop "
         "navigation and a bottom navigation bar for mobile users. The design supports both "
         "light and dark themes with smooth animations using Framer Motion."),
        ("Farmer Dashboard Design:", "The Farmer Dashboard provides access to soil health "
         "analysis, crop recommendations, disease detection, irrigation management, weather "
         "updates, market prices, and marketplace features. A floating AI assistant button on "
         "desktop and an AI tab in the mobile bottom navigation allow farmers to get instant "
         "AI-powered farming advice."),
        ("Admin Dashboard Design:", "The Admin Dashboard provides an interface to manage users, "
         "farmers, products, orders, collection centers, and analytics. Administrators can "
         "monitor the entire platform and manage all user roles from a single interface."),
        ("Database Design:", "The database uses PostgreSQL hosted on Supabase. Prisma ORM "
         "manages schema definitions and database migrations. Key entities include User, Farm, "
         "SoilReport, CropPlan, Order, Product, and Payment."),
        ("AI Module Design:", "The AI module handles soil analysis, crop disease detection, "
         "fertilizer recommendations, and market price prediction. The system is designed to "
         "integrate with external AI APIs (Google Gemini / OpenAI) for advanced predictions."),
    ]
    for label, detail in design_sections:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        set_para_spacing(p, 6, 1.5)
        r_label = p.add_run(label + " ")
        set_font(r_label, "Times New Roman", 12, bold=True)
        r_detail = p.add_run(detail)
        set_font(r_detail, "Times New Roman", 12, bold=False)

    add_section_heading(doc, "4.2 Implementation")
    impl_sections = [
        ("Frontend Implementation:", "The frontend is implemented using Next.js 16 with the App "
         "Router pattern. React 19 with TypeScript ensures type safety across all components. "
         "Zustand manages global application state including authentication, navigation, cart, "
         "and chat state. The UI is built with Shadcn/UI components styled with Tailwind CSS v4. "
         "The layout system uses role-based layouts \u2014 FarmerLayout for farmers and "
         "DashboardLayout for other roles. Each layout provides a sidebar, header with "
         "notifications and search, and a floating AI assistant button that opens the AIChatPanel."),
        ("Backend Implementation:", "API routes in Next.js handle authentication, data fetching, "
         "and business logic. Prisma ORM connects to the Supabase PostgreSQL database for data "
         "persistence. NextAuth.js manages secure session handling and role-based access control."),
        ("AI Chat Implementation:", "The AI Chat Assistant (AIChatPanel) is implemented as a "
         "floating panel that can be toggled from any page. It supports voice input, quick "
         "suggestion prompts, and multi-turn conversations. The chat panel is accessible on "
         "desktop via a floating 'Ask AI' button and on mobile via the bottom navigation."),
        ("Marketplace Implementation:", "The marketplace module allows farmers to list products, "
         "consumers to browse and purchase, and collection centers to manage inventory. The cart "
         "system, order tracking, and payment processing are fully integrated."),
        ("Testing:", "Unit testing was performed on individual components and modules. Integration "
         "testing verified that the frontend, API routes, and database interact correctly. System "
         "testing confirmed that all user roles can access their respective features without "
         "errors."),
    ]
    for label, detail in impl_sections:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        set_para_spacing(p, 6, 1.5)
        r_label = p.add_run(label + " ")
        set_font(r_label, "Times New Roman", 12, bold=True)
        r_detail = p.add_run(detail)
        set_font(r_detail, "Times New Roman", 12, bold=False)

    add_section_heading(doc, "4.3 Testing")
    testing_intro = ("Testing was performed at multiple levels to ensure the reliability and "
                     "correctness of the KISANSETU platform:")
    add_body_para(doc, testing_intro)

    testing_items = [
        ("Unit Testing:", "Individual modules such as login, registration, soil health form, "
         "crop recommendation, and disease detection were tested independently."),
        ("Integration Testing:", "The frontend, API routes, Prisma ORM, and Supabase database "
         "were tested together to ensure correct data flow."),
        ("System Testing:", "The complete application was tested end-to-end across all user roles "
         "\u2014 Farmer, Consumer, Collection Center, Expert, and Admin."),
        ("UI/UX Testing:", "All pages, forms, buttons, dropdowns, and navigation elements were "
         "tested on both desktop and mobile screen sizes."),
        ("Authentication Testing:", "Login, logout, session persistence, and role-based access "
         "control were tested with valid and invalid credentials."),
        ("Responsive Testing:", "The application was tested on multiple screen sizes \u2014 "
         "mobile (375px), tablet (768px), and desktop (1280px+)."),
        ("Performance Testing:", "Page load times, component rendering, and API response times "
         "were measured to ensure acceptable performance."),
    ]
    for label, detail in testing_items:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        set_para_spacing(p, 6, 1.5)
        r_label = p.add_run(label + " ")
        set_font(r_label, "Times New Roman", 12, bold=True)
        r_detail = p.add_run(detail)
        set_font(r_detail, "Times New Roman", 12, bold=False)

    # ── CHAPTER 5 ─────────────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "CHAPTER \u2013 5", caps=False)
    add_heading(doc, "SOURCE CODE & SCREENSHOTS", caps=False)

    add_section_heading(doc, "5.1 Source Code")
    add_body_para(doc, "Key source code excerpts from the KISANSETU project are presented below.")

    # Code Block 1
    code1 = """'use client';
import React, { useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useAppStore } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import AIChatPanel from '@/components/shared/AIChatPanel';

const farmerNavItems = [
  { label: 'Dashboard', route: 'farmer/dashboard' },
  { label: 'My Farm', route: 'farmer/my-farm' },
  { label: 'Soil Health', route: 'farmer/soil-health' },
  { label: 'Crop Plans', route: 'farmer/crop-recommendations' },
  { label: 'Disease Scan', route: 'farmer/disease-detection' },
  { label: 'Fertilizer', route: 'farmer/fertilizer' },
  { label: 'Irrigation', route: 'farmer/irrigation' },
  { label: 'Weather', route: 'farmer/weather' },
  { label: 'Market Prices', route: 'farmer/market-prices' },
  { label: 'Sell Products', route: 'farmer/sell' },
  { label: 'Marketplace', route: 'marketplace/home' },
  { label: 'Orders', route: 'farmer/orders' },
  { label: 'Payments', route: 'farmer/payments' },
];

export default function FarmerLayout({ children }) {
  const { toggleChat, isChatOpen } = useAppStore();
  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex flex-col border-r'>
        <nav>
          {farmerNavItems.map(item => (
            <button key={item.route}>{item.label}</button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <main>{children}</main>
      </div>
      {/* Floating AI Button - Desktop Only */}
      <button
        onClick={toggleChat}
        className='hidden lg:flex fixed bottom-6 right-6 z-50
                   items-center gap-2 px-4 py-3 rounded-2xl
                   gradient-green text-white shadow-lg'
      >
        <Sparkles size={18} />
        <span>Ask AI</span>
      </button>
      <AIChatPanel />
    </div>
  );
}"""

    add_code_block(doc, code1, label="FarmerLayout.tsx \u2013 Navigation & AI Button")

    # Code Block 2
    code2 = """'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, Sparkles } from 'lucide-react';

const suggestions = [
  'What should I grow?',
  'Is irrigation needed today?',
  'Why are my leaves yellow?',
  "Show today's market prices",
];

export default function AIChatPanel() {
  const { isChatOpen, setChatOpen } = useAppStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: `m${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1500));
    const aiMsg = {
      id: `m${Date.now() + 1}`,
      role: 'assistant',
      content: 'Based on your soil analysis and current weather...',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className='fixed bottom-20 right-4 lg:bottom-6 lg:right-6
                     w-96 h-[500px] bg-card border rounded-2xl
                     shadow-2xl z-50 flex flex-col overflow-hidden'
        >
          {/* Header */}
          <div className='gradient-green p-4 flex items-center'>
            <Sparkles className='text-white' />
            <h3 className='text-white font-semibold ml-2'>
              Farm AI Assistant
            </h3>
            <button onClick={() => setChatOpen(false)}>
              <X className='text-white' />
            </button>
          </div>
          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4'>
            {messages.map(msg => (
              <div key={msg.id}
                className={msg.role === 'user'
                  ? 'flex justify-end'
                  : 'flex justify-start'}>
                <div className='rounded-2xl px-4 py-2 text-sm'>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          {/* Input */}
          <form className='p-3 border-t flex gap-2'>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Type your question...'
            />
            <button type='submit'>
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}"""

    add_code_block(doc, code2, label="AIChatPanel.tsx \u2013 AI Chat Assistant")

    # Code Block 3
    code3 = """generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("farmer")
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Farm {
  id          String   @id @default(cuid())
  name        String
  location    String
  area        Float
  cropType    String?
  soilType    String?
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Order {
  id          String   @id @default(cuid())
  userId      String
  productId   String
  quantity    Int
  totalAmount Float
  status      String   @default("pending")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}"""

    add_code_block(doc, code3, label="prisma/schema.prisma \u2013 Database Schema")

    add_section_heading(doc, "5.2 Screenshots of Application")
    add_body_para(doc, "The following figures show the key screens of the KISANSETU application "
                  "as deployed at https://vishuu-six.vercel.app")

    screenshots = [
        ("Fig. 1: Login Page", "[Screenshot: Login page with email/password form and role selection]"),
        ("Fig. 2: Farmer Dashboard", "[Screenshot: Dashboard showing soil health, weather, and market price widgets]"),
        ("Fig. 3: Soil Health Analysis", "[Screenshot: Soil health report with NPK levels and recommendations]"),
        ("Fig. 4: Crop Disease Detection", "[Screenshot: Disease detection page with image upload interface]"),
        ("Fig. 5: Marketplace", "[Screenshot: Product listing with filters and cart functionality]"),
        ("Fig. 6: AI Chat Assistant", "[Screenshot: Floating AI chat panel with conversation interface]"),
        ("Fig. 7: Weather & Irrigation", "[Screenshot: Weather dashboard with irrigation recommendations]"),
        ("Fig. 8: Admin Dashboard", "[Screenshot: Admin panel showing user management and analytics]"),
    ]
    for fig_label, fig_desc in screenshots:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        set_para_spacing(p, 6, 1.5)
        r_label = p.add_run(fig_label + " \u2013 ")
        set_font(r_label, "Times New Roman", 12, bold=True)
        r_desc = p.add_run(fig_desc)
        set_font(r_desc, "Times New Roman", 12, bold=False)

    # ── CHAPTER 6 ─────────────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "CHAPTER \u2013 6", caps=False)
    add_heading(doc, "RESULTS & CONCLUSION", caps=False)

    add_section_heading(doc, "6.1 Results")
    results_intro = ("The KISANSETU platform was successfully developed and deployed as a web "
                     "application accessible at https://vishuu-six.vercel.app. The following "
                     "results were achieved:")
    add_body_para(doc, results_intro)

    results_list = [
        "1.  A fully functional multi-role web application was developed supporting Farmer, Consumer, Collection Center, Agricultural Expert, and Admin roles.",
        "2.  The Farmer Dashboard provides access to 14 key farming modules including soil health, crop recommendations, disease detection, fertilizer management, irrigation, weather, and market prices.",
        "3.  The AI Chat Assistant was successfully integrated and is accessible from all pages via a floating button on desktop and a dedicated tab on mobile.",
        "4.  The marketplace module supports product listing, browsing, cart management, and order tracking.",
        "5.  The application was successfully deployed on Vercel with Supabase PostgreSQL as the production database.",
        "6.  The responsive design ensures the platform works correctly on all device sizes \u2014 mobile, tablet, and desktop.",
        "7.  Dark and light theme support was implemented for better user experience.",
        "8.  The application achieved successful compilation with Next.js 16 and generated all required static and dynamic routes.",
    ]
    for item in results_list:
        add_body_para(doc, item)

    add_section_heading(doc, "6.2 Conclusion")
    conc_paras = [
        ("KISANSETU is an AI-based smart agriculture platform that successfully addresses the "
         "major challenges faced by Indian farmers. By combining AI-powered farming guidance "
         "with digital marketplace services, the platform provides a comprehensive solution for "
         "modern agriculture."),
        ("The system helps farmers make better decisions through soil health analysis, crop "
         "recommendations, fertilizer guidance, crop disease detection, and market price "
         "prediction. The integrated marketplace connects farmers directly with consumers, "
         "reducing dependence on intermediaries and ensuring fair prices for agricultural "
         "products."),
        ("The use of modern technologies \u2014 Next.js 16, React 19, TypeScript, Tailwind CSS, "
         "Prisma ORM, and Supabase PostgreSQL \u2014 ensures that the platform is scalable, "
         "maintainable, and production-ready. The successful deployment on Vercel demonstrates "
         "the platform's readiness for real-world use."),
        ("Future enhancements include integration with actual AI/ML models for crop disease "
         "detection and market price prediction, incorporation of real-time weather APIs, "
         "expansion of multi-language support, and development of a dedicated mobile application "
         "for Android and iOS. Overall, KISANSETU demonstrates how modern web technology and "
         "artificial intelligence can be effectively combined to promote smart and sustainable "
         "agriculture in India."),
    ]
    for pt in conc_paras:
        add_body_para(doc, pt)

    # ── REFERENCES ────────────────────────────────────────────────────────────
    doc.add_page_break()
    add_heading(doc, "REFERENCES")

    references = [
        "1.  Next.js Documentation. (2024). Next.js 16 App Router. Retrieved from https://nextjs.org/docs",
        "2.  Prisma Documentation. (2024). Prisma ORM with PostgreSQL. Retrieved from https://www.prisma.io/docs",
        "3.  Supabase Documentation. (2024). Supabase PostgreSQL Database. Retrieved from https://supabase.com/docs",
        "4.  Vercel Documentation. (2024). Deploying Next.js Applications. Retrieved from https://vercel.com/docs",
        "5.  Tailwind CSS. (2024). Tailwind CSS v4 Documentation. Retrieved from https://tailwindcss.com/docs",
        "6.  Shadcn/UI. (2024). Component Library Documentation. Retrieved from https://ui.shadcn.com",
        "7.  Zustand. (2024). State Management for React. Retrieved from https://zustand-demo.pmnd.rs",
        "8.  TanStack Query. (2024). Data Fetching and Caching. Retrieved from https://tanstack.com/query",
        "9.  Government of India, Ministry of Agriculture. (2023). Digital Agriculture Mission 2021-2025.",
        "10. Framer Motion. (2024). Animation Library for React. Retrieved from https://www.framer.com/motion",
    ]
    for ref in references:
        add_body_para(doc, ref)

    # ── Apply headers/footers to non-cover sections ───────────────────────────
    # The first section is the cover (no header/footer already set)
    # We need to start a new section after the cover page.
    # The approach: the cover already has blank header/footer.
    # python-docx: after add_page_break, everything is still in section[0].
    # We need to insert sectPr breaks. Let's do it via section manipulation.
    # 
    # Since we used doc.add_page_break() (not new sections), all content
    # is in one section. We'll use the following approach:
    # 1. The document currently has 1 section.
    # 2. We add a new section break after the cover page content.
    # 
    # Better approach: find the first page break paragraph (after cover) and
    # convert it to a section break, then set header/footer for section 1.
    # 
    # The simplest fix: add a continuous section after cover page.
    # We'll insert a sectPr before the first page break after cover.

    # Find paragraph index of first page break (Certificate page start)
    # The cover ends with "2026-2027" paragraph and then a page break paragraph.
    # We inserted doc.add_page_break() which creates a paragraph with a break run.
    # 
    # Strategy: Insert a section break (next page) after the cover.
    # We'll walk paragraphs to find the first w:br[@w:type='page'] and
    # convert it to a section break.

    # Find and replace first page break with section break
    all_paras = doc.paragraphs
    first_page_break_idx = None
    for i, p in enumerate(all_paras):
        for r in p.runs:
            for br in r._r.findall(qn('w:br')):
                if br.get(qn('w:type')) == 'page':
                    first_page_break_idx = i
                    break
        if first_page_break_idx is not None:
            break

    if first_page_break_idx is not None:
        # Convert this page-break paragraph into a section-break paragraph
        pb_para = all_paras[first_page_break_idx]
        # Remove the w:br element
        for r in pb_para.runs:
            for br in r._r.findall(qn('w:br')):
                r._r.remove(br)
        # Add sectPr with type=nextPage to the paragraph
        pPr = pb_para._p.get_or_add_pPr()
        sectPr = OxmlElement('w:sectPr')
        sectPrType = OxmlElement('w:type')
        sectPrType.set(qn('w:val'), 'nextPage')
        sectPr.append(sectPrType)
        # Add page margins
        pgMar = OxmlElement('w:pgMar')
        pgMar.set(qn('w:top'), str(int(1 * 1440)))
        pgMar.set(qn('w:right'), str(int(1 * 1440)))
        pgMar.set(qn('w:bottom'), str(int(1 * 1440)))
        pgMar.set(qn('w:left'), str(int(1.25 * 1440)))
        pgMar.set(qn('w:header'), '720')
        pgMar.set(qn('w:footer'), '720')
        sectPr.append(pgMar)
        pgSz = OxmlElement('w:pgSz')
        pgSz.set(qn('w:w'), '12240')
        pgSz.set(qn('w:h'), '15840')
        sectPr.append(pgSz)
        pPr.append(sectPr)

    # Now doc has 2 sections: section[0]=cover, section[1]=rest of doc
    # Set header/footer for section[1]
    if len(doc.sections) > 1:
        add_header_footer(doc.sections[1], "KisanSetu")
    else:
        # Fallback: set on section[0] (all pages)
        add_header_footer(doc.sections[0], "KisanSetu")

    # Save DOCX
    output_path = r"C:/Users/user/Downloads/vishuu/KisanSetu_Project_Report.docx"
    doc.save(output_path)
    print(f"[OK] DOCX saved: {output_path}")
    return output_path


def convert_to_pdf(docx_path):
    pdf_path = docx_path.replace(".docx", ".pdf")
    try:
        from docx2pdf import convert
        convert(docx_path, pdf_path)
        print(f"[OK] PDF saved: {pdf_path}")
        return pdf_path
    except Exception as e:
        print(f"[WARN] docx2pdf failed: {e}")
        # Try Word COM automation
        try:
            import comtypes.client
            import os
            word = comtypes.client.CreateObject('Word.Application')
            word.Visible = False
            abs_docx = os.path.abspath(docx_path)
            abs_pdf = os.path.abspath(pdf_path)
            doc = word.Documents.Open(abs_docx)
            doc.SaveAs(abs_pdf, FileFormat=17)  # 17 = wdFormatPDF
            doc.Close()
            word.Quit()
            print(f"[OK] PDF saved via Word COM: {abs_pdf}")
            return abs_pdf
        except Exception as e2:
            print(f"[ERROR] Word COM also failed: {e2}")
            return None


if __name__ == "__main__":
    docx_path = generate_report()
    pdf_path = convert_to_pdf(docx_path)
    print("\n=== DONE ===")
    print(f"DOCX: {docx_path}")
    if pdf_path:
        print(f"PDF:  {pdf_path}")
