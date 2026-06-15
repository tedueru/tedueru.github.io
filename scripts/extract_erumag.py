#!/usr/bin/env python3
"""Extract per-article clean text + figures from the 5 ERUMAG PDFs.

Outputs:
  data/erumag/manifest.json          -> machine-readable index of all articles
  data/erumag/<slug>.txt             -> cleaned article body text (paragraphs)
  assets/erumag/<slug>-fN.<ext>      -> extracted figures/charts for each article
"""
import fitz, os, json, hashlib, re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, "data", "erumag")
ASSETS = os.path.join(BASE, "assets", "erumag")
os.makedirs(DATA, exist_ok=True)
os.makedirs(ASSETS, exist_ok=True)

ISSUES = {
    1: {"file": "ERUMAG_Issue1_2025.pdf", "title": "The Foundation",
        "subtitle": "Inaugural Issue", "year": "2025", "date": "2025-01-15",
        "cover": "covers/erumag-1-cover.jpg", "pdf": "ERUMAG_Issue1_2025.pdf"},
    2: {"file": "ERUMAG, Issue 2, 2025.pdf", "title": "Fertility Rates & Demographic Economics",
        "subtitle": "Issue 2", "year": "2025", "date": "2025-04-15",
        "cover": "covers/erumag-2-cover.jpg", "pdf": "ERUMAG, Issue 2, 2025.pdf"},
    3: {"file": "ERUMAG, Issue 3, 2025.pdf", "title": "AI & Economic Uncertainty",
        "subtitle": "Issue 3", "year": "2025", "date": "2025-11-28",
        "cover": "covers/erumag-3-cover.jpg", "pdf": "ERUMAG, Issue 3, 2025.pdf"},
    4: {"file": "ERUMAG, Issue 4, 2026.pdf", "title": "Consumerism & Modern Behaviors",
        "subtitle": "Issue 4", "year": "2026", "date": "2026-01-14",
        "cover": "covers/erumag-4-cover.jpg", "pdf": "ERUMAG, Issue 4, 2026.pdf"},
    5: {"file": "ERUMAG, Issue 5, 2026.pdf", "title": "AI Agent Economics",
        "subtitle": "Issue 5 - Latest", "year": "2026", "date": "2026-06-15",
        "cover": "covers/erumag-5-cover.jpg", "pdf": "ERUMAG, Issue 5, 2026.pdf"},
}

# (issue, slug, title, kind, start_page, end_page)  pages are 1-based inclusive
ARTICLES = [
    # ---- Issue 1 ----
    (1, "sustainability", "Sustainability and Its Importance", "article", 7, 10),
    (1, "uncovered-interest-parity", "What Happened to Uncovered Interest Parity?", "article", 13, 13),
    (1, "acemoglu-nobel", "Daron Acemoglu: The Story Behind the Nobel", "article", 14, 20),
    (1, "behavioral-econ-destan", "Behavioral Economics with Dr. Cavit Gorkem Destan", "interview", 21, 23),
    (1, "climate-sultan-tepe", "Climate Change and Sustainability with Sultan Tepe", "interview", 24, 26),
    # ---- Issue 2 ----
    (2, "three-kids", "“At Least 3 Kids!”", "article", 7, 9),
    (2, "breakups-economy", "How Breakups Affect the Economy: Marriages, Breakups and Divorces", "article", 10, 13),
    (2, "what-will-i-be", "What Will I Be When I Grow Up?", "article", 16, 17),
    (2, "economic-boycotting", "Economic Boycotting: A Historical and Academic Perspective", "article", 18, 21),
    (2, "will-ai-take-my-job", "Will AI Take My Job? A Literature Review on Employment and Automation Risks", "article", 22, 24),
    (2, "bist", "Understanding the Turkish Stock Market (BIST)", "article", 25, 26),
    (2, "trade-war", "Trade War: Is It a Winnable or Losing War for the United States?", "article", 27, 28),
    (2, "populism-sahinkaya", "Gazi Mustafa Kemal's Program of Populism with Dr. Serdar Sahinkaya", "interview", 29, 32),
    (2, "matching-theory-bilgin", "Matching Theory and Market Design with Dr. Gunnur Ege Bilgin", "interview", 33, 34),
    (2, "evolution-economics", "Evolution of Economics Advice", "article", 35, 35),
    # ---- Issue 3 ----
    (3, "winter-is-coming", "Winter Is Coming, or Not?", "article", 7, 10),
    (3, "diminishing-returns", "Learning: The Power Beyond Diminishing Returns", "article", 11, 12),
    (3, "ai-money-machine", "The AI Money Machine: How to Justify These Cashflows?", "article", 13, 19),
    (3, "basci", "Inflation, Uncertainty and AI: Interview with Prof. Dr. Erdem Basci", "interview", 20, 23),
    (3, "money-inflation", "Money Growth and Inflation in the 21st Century", "article", 26, 29),
    (3, "creative-destruction", "Technological Creativity and Creative Destruction: The Ideas Behind the Nobel Prize", "article", 30, 36),
    (3, "tfp-exports", "The Dynamic Interaction Between Total Factor Productivity, Exports, and Economic Growth", "article", 37, 39),
    (3, "ai-productivity", "Does AI Boost Labor Productivity?", "article", 40, 42),
    (3, "ottoman-debt", "The Debt Spiral of the Ottoman Empire: Foreign Capital and Loss of Economic Independence", "article", 43, 45),
    (3, "yalcintas", "Economics of AI with Prof. Dr. Altug Yalcintas", "interview", 46, 50),
    # ---- Issue 4 ----
    (4, "consumerism", "Who Is Afraid of Consumerism?", "article", 7, 10),
    (4, "chocolate", "Chocolate: A Sweet Treat or Deforestation Driver?", "article", 11, 13),
    (4, "bceao", "An Early Trial of Euro: Central Bank of West African States", "article", 14, 17),
    (4, "dincer", "An Interview with Prof. Dr. Nazire Nergiz Dincer", "interview", 18, 23),
    (4, "corruption", "Corruption and Economic Growth", "article", 26, 28),
    (4, "everything-is-a-lie", "Everything Is a Lie: The World Just Turns Around Itself 365 Times", "article", 29, 32),
    (4, "gender-spending", "Gender-Based Consumer Behavior: Women's and Men's Spending Habits", "article", 33, 34),
    (4, "seasonal-peaks", "Global Seasonal Consumption Peaks", "article", 35, 36),
    (4, "reading-economy-numbers", "Reading the Economy Through Numbers: What Do Mathematical Models Tell Us?", "article", 37, 38),
    (4, "game-theory-bilgin", "Game Theory with Dr. Gunnur Ege Bilgin", "interview", 39, 42),
    # ---- Issue 5 ----
    (5, "ai-labor-market", "Artificial Intelligence and the Labor Market", "article", 7, 8),
    (5, "big-tech-economy", "Big Tech Wants to Orchestrate the Economy", "article", 9, 10),
    (5, "human-capital-ai", "The Future of Human Capital: Navigating the Duality of AI in Professional Practice", "article", 11, 13),
    (5, "steam-engine", "Who's Afraid of the Steam Engine?", "article", 14, 17),
    (5, "ai-agents-anthropic", "Impact of AI Agents on the Workforce According to Anthropic Reports", "article", 18, 21),
    (5, "rise-ai-agents", "The Rise of AI Agents: How the Most-Used Agentic LLM Is Reshaping Finance and Beyond", "article", 24, 26),
    (5, "economists-use-ai", "How Economists Use Artificial Intelligence in Their Research", "article", 27, 29),
    (5, "eu-common-currency", "Is Having a Common Currency Beneficial for EU Countries?", "article", 30, 32),
    (5, "commuting-paradox", "How Is Commuting Affecting Our Mood? The Commuting Paradox", "article", 33, 35),
    (5, "transportation-rd", "Transportation and Infrastructure From an R&D and Innovation Perspective", "article", 36, 37),
    (5, "cilasun", "AI-Employment Puzzle: An Exclusive Interview with Prof. Dr. Cilasun", "interview", 38, 42),
    (5, "schacht-miracle", "The Greatest Macroeconomic Illusion in History: Hjalmar Schacht's “Miracle”", "article", 43, 45),
    (5, "gitmez", "Political Economy, Institutions and Technology: FieldTalks with Asst. Prof. Arda Gitmez", "interview", 46, 50),
]

NOISE = re.compile(r"^(E\s?R\s?U\s?M\s?A\s?G|ERUMAG|ERUMag|\d{1,3})$", re.I)

def clean_blocks(page):
    """Return list of paragraph strings in reading order, noise removed."""
    blocks = page.get_text("blocks")  # (x0,y0,x1,y1,text,bno,btype)
    text_blocks = [b for b in blocks if b[6] == 0 and b[4].strip()]
    pw = page.rect.width
    # sort: column (left/right of midpoint) then vertical
    def key(b):
        col = 0 if b[0] < pw * 0.52 else 1
        return (col, round(b[1] / 4))
    text_blocks.sort(key=key)
    out = []
    for b in text_blocks:
        t = b[4].strip()
        # join intra-block soft line breaks, fix hyphenation
        t = re.sub(r"-\n(?=[a-z])", "", t)
        t = re.sub(r"\s*\n\s*", " ", t).strip()
        if not t:
            continue
        if NOISE.match(t):
            continue
        out.append(t)
    return out

def figure_caption(page, rect):
    """Find a caption-like text block just below the image rect."""
    blocks = page.get_text("blocks")
    cands = []
    for b in blocks:
        if b[6] != 0:
            continue
        bx0, by0, bx1, by1, txt = b[0], b[1], b[2], b[3], b[4].strip()
        if not txt or NOISE.match(txt):
            continue
        # horizontal overlap with image, vertically just under it
        overlap = min(bx1, rect.x1) - max(bx0, rect.x0)
        if overlap > 10 and (rect.y1 - 8) <= by0 <= (rect.y1 + 80):
            txt = re.sub(r"\s*\n\s*", " ", txt).strip()
            cands.append((by0, txt))
    if cands:
        cands.sort()
        cap = cands[0][1]
        return cap[:200]
    return ""

manifest = []
for issue, slug, title, kind, p0, p1 in ARTICLES:
    info = ISSUES[issue]
    doc = fitz.open(os.path.join(BASE, info["file"]))

    # ---- decoration detection: image md5 -> set of pages (whole issue) ----
    md5_pages = {}
    for pno in range(len(doc)):
        for img in doc[pno].get_images(full=True):
            xref = img[0]
            try:
                raw = doc.extract_image(xref)["image"]
            except Exception:
                continue
            h = hashlib.md5(raw).hexdigest()
            md5_pages.setdefault(h, set()).add(pno)
    decoration = {h for h, pgs in md5_pages.items() if len(pgs) >= 4}

    # ---- text ----
    paras = []
    for pno in range(p0 - 1, p1):
        paras.extend(clean_blocks(doc[pno]))
    body = "\n\n".join(paras)
    wc = len(body.split())

    # ---- figures ----
    figs = []
    seen_md5 = set()
    fidx = 0
    for pno in range(p0 - 1, p1):
        page = doc[pno]
        page_area = page.rect.width * page.rect.height
        for img in page.get_images(full=True):
            xref = img[0]
            try:
                ext = doc.extract_image(xref)
            except Exception:
                continue
            raw = ext["image"]
            h = hashlib.md5(raw).hexdigest()
            if h in decoration or h in seen_md5:
                continue
            rects = page.get_image_rects(xref)
            if not rects:
                continue
            rect = max(rects, key=lambda r: r.width * r.height)
            coverage = (rect.width * rect.height) / page_area
            if coverage < 0.02 or coverage > 0.80:
                continue  # icon or full-page background/cover
            seen_md5.add(h)
            fidx += 1
            fext = ext.get("ext", "png")
            fname = f"{slug}-f{fidx}.{fext}"
            with open(os.path.join(ASSETS, fname), "wb") as fh:
                fh.write(raw)
            figs.append({
                "file": f"assets/erumag/{fname}",
                "caption": figure_caption(page, rect),
                "w": ext.get("width"), "h": ext.get("height"),
                "page": pno + 1,
            })

    with open(os.path.join(DATA, f"{slug}.txt"), "w", encoding="utf-8") as fh:
        fh.write(body)

    manifest.append({
        "issue": issue,
        "issue_title": info["title"],
        "issue_subtitle": info["subtitle"],
        "issue_year": info["year"],
        "issue_date": info["date"],
        "issue_cover": info["cover"],
        "issue_pdf": info["pdf"],
        "slug": slug,
        "filename": f"article-{slug}.html",
        "title": title,
        "kind": kind,
        "pages": [p0, p1],
        "wordcount": wc,
        "textfile": f"data/erumag/{slug}.txt",
        "figures": figs,
    })
    print(f"I{issue} {slug:28s} pages {p0:>2}-{p1:<2} words={wc:>4} figs={len(figs)}")
    doc.close()

with open(os.path.join(DATA, "manifest.json"), "w", encoding="utf-8") as fh:
    json.dump(manifest, fh, indent=2, ensure_ascii=False)

print(f"\nTOTAL: {len(manifest)} articles, "
      f"{sum(len(a['figures']) for a in manifest)} figures extracted")
