#!/usr/bin/env python3
"""Rebuild erumag-1..5.html as issue pages that list each issue's articles as
blog-style cards, plus refresh sitemap.xml. Reads manifest.json + deks.json."""
import json, os, html, datetime, urllib.parse, re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
manifest = json.load(open(os.path.join(BASE, "data", "erumag", "manifest.json"), encoding="utf-8"))
dpath = os.path.join(BASE, "data", "erumag", "deks.json")
fpath = os.path.join(BASE, "data", "erumag", "deks_fallback.json")
deks = json.load(open(fpath, encoding="utf-8"))
if os.path.exists(dpath):
    deks.update({k: v for k, v in json.load(open(dpath, encoding="utf-8")).items() if v})

ISSUE_META = {
    1: ("Inaugural Issue · 2025", "The inaugural issue that set ERUMAG's editorial voice — student essays on sustainability, uncovered interest parity and the economics Nobel, plus conversations with TEDU faculty."),
    2: ("Issue 2 · 2025", "Falling fertility, the economics of relationships, boycotts, automation risk and the Turkish stock market — with interviews on populism and market design."),
    3: ("Issue 3 · 2025", "Inflation, uncertainty and the AI boom: from the “AI money machine” to creative destruction and the Ottoman debt spiral, plus an interview with Prof. Dr. Erdem Başçı."),
    4: ("Issue 4 · 2026", "Consumerism and modern behaviour: chocolate and deforestation, corruption and growth, gendered spending and monetary unions, plus an interview with Prof. Dr. Nazire Nergiz Dinçer."),
    5: ("Issue 5 · 2026 · Latest", "AI agent economics: the labour market, big tech, human capital and Anthropic's workforce data, with interviews featuring Prof. Dr. Cilasun and Asst. Prof. Arda Gitmez."),
}

NAV = """    <nav class="navbar" id="navbar">
        <div class="nav-inner">
            <a href="index.html" class="nav-brand"><img src="logo.jpg" alt="TEDU ERU"><span class="nav-brand-text">TED
                    University<br>Economics Research Union</span></a>
            <button class="nav-toggle" id="nav-toggle"><i data-lucide="menu"></i></button>
            <ul class="nav-links" id="nav-links">
                <li><a href="about.html">About</a></li>
                <li><a href="events.html">Events</a></li>
                <li><a href="erumag.html">ERUMAG</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="greentalks.html">GreenTalks</a></li>
                <li><a href="fieldtalks.html">FieldTalks</a></li>
                <li><a href="team.html">Our Team</a></li>
                <li><a href="team.html#advisory-board">Advisory Board</a></li>
                <li><a href="contact.html" class="btn btn-outline">Contact</a></li>
            </ul>
        </div>
    </nav>"""

FOOTER = """    <footer class="footer">
        <div class="container">
            <div class="footer-top">
                <div>
                    <span class="footer-brand-text">TED University<br>Economics Research Union</span>
                    <p>Student-led economic research, publishing, and events.</p>
                </div>
                <div class="footer-socials">
                    <a href="https://www.linkedin.com/company/tedueru" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="LinkedIn"><i data-lucide="briefcase-business"></i></a>
                    <a href="https://www.instagram.com/erutedu/" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram"><i data-lucide="camera"></i></a>
                    <a href="https://www.youtube.com/@TEDUERU" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="YouTube"><i data-lucide="play"></i></a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <span id="year"></span> TED University Economics Research Union. All rights reserved.</p>
                <div class="footer-links"><a href="about.html">About</a><a href="contact.html">Contact</a></div>
            </div>
        </div>
    </footer>"""


def esc(s):
    return html.escape(s, quote=True)


def fmt_date(d):
    dt = datetime.date.fromisoformat(d)
    return dt.strftime("%b %d, %Y").replace(" 0", " ")


def minutes(wc):
    return max(1, round(wc / 200))


def card(a):
    slug = a["slug"]
    kind = "Interview" if a["kind"] == "interview" else "Article"
    label = f"{fmt_date(a['issue_date'])} · {kind} · {minutes(a['wordcount'])} min"
    dek = deks.get(slug, "").strip() or a["title"]
    verb = "Read interview" if a["kind"] == "interview" else "Read article"
    return f"""                <a href="article-{slug}.html" class="card initiative-card">
                    <p class="section-label" style="margin-bottom:.25rem;">{esc(label)}</p>
                    <h3 style="font-size:1.15rem;">{esc(a['title'])}</h3>
                    <p>{esc(dek)}</p>
                    <span class="card-link">{verb} <i data-lucide="arrow-right"></i></span>
                </a>"""


def build_issue(n):
    arts = [a for a in manifest if a["issue"] == n]
    info = arts[0]
    kicker, intro = ISSUE_META[n]
    cover = info["issue_cover"]
    pdf = info["issue_pdf"]
    pdf_href = urllib.parse.quote(pdf)
    title = info["issue_title"]
    year = info["issue_year"]
    cards = "\n\n".join(card(a) for a in arts)
    n_art = len(arts)

    prev_btn = f'<a href="erumag-{n-1}.html" class="btn btn-ghost">← Issue {n-1}</a>' if n > 1 else '<a href="erumag.html" class="btn btn-ghost">← Archive</a>'
    next_btn = f'<a href="erumag-{n+1}.html" class="btn btn-ghost">Issue {n+1} →</a>' if n < 5 else '<a href="erumag.html" class="btn btn-ghost">All issues →</a>'

    desc = f"Read every article from ERUMAG Issue {n} — {title} ({year}): {n_art} student-written pieces with AI summaries and charts."
    doc = f"""<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>ERUMAG Issue {n} — {esc(title)} · TEDU ERU</title>
    <meta name="description" content="{esc(desc)}">
    <link rel="canonical" href="erumag-{n}.html">
    <meta name="robots" content="index,follow">
    <meta property="og:title" content="ERUMAG Issue {n} — {esc(title)}">
    <meta property="og:description" content="{esc(desc)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="erumag-{n}.html">
    <meta property="og:image" content="{esc(cover)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="ERUMAG Issue {n} — {esc(title)}">
    <meta name="twitter:description" content="{esc(desc)}">
    <meta name="twitter:image" content="{esc(cover)}">
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "PublicationIssue",
        "issueNumber": {n},
        "name": "ERUMAG Issue {n} — {esc(title)}",
        "description": "{esc(desc)}",
        "url": "erumag-{n}.html",
        "image": "{esc(cover)}",
        "datePublished": "{info['issue_date']}",
        "isPartOf": {{ "@type": "Periodical", "name": "ERUMAG" }},
        "publisher": {{ "@type": "Organization", "name": "TED University Economics Research Union" }}
    }}
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>

<body>

{NAV}

    <header class="page-header page-header-split">
        <div class="container">
            <div class="page-header-grid">
                <div class="page-header-copy">
                    <p class="section-label">{esc(kicker)}</p>
                    <h1>ERUMAG Issue {n}</h1>
                    <p>{esc(intro)}</p>
                    <div class="page-header-actions">
                        <a href="{pdf_href}" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i data-lucide="download" style="width:16px;height:16px;"></i> Open full PDF</a>
                        <a href="erumag.html" class="btn btn-ghost">Back to archive</a>
                    </div>
                </div>
                <div class="page-header-media">
                    <div class="page-header-stack">
                        <div class="page-header-cover">
                            <img src="{esc(cover)}" alt="ERUMAG Issue {n} cover">
                        </div>
                        <div class="page-header-card">
                            <p><strong>{n_art} articles</strong><br>Read each one on its own page, with an AI summary and charts.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <section class="section bg-white">
        <div class="container" style="max-width:900px;">
            <p class="section-label text-center reveal">In This Issue</p>
            <h2 class="section-title text-center reveal">{esc(title)}</h2>
            <div class="separator reveal"></div>

            <div class="grid-2 stagger">

{cards}

            </div>

            <div style="margin-top:3rem;display:flex;justify-content:space-between;border-top:1px solid var(--clr-border);padding-top:1.5rem;">
                {prev_btn}
                {next_btn}
            </div>
        </div>
    </section>

{FOOTER}

    <script src="script.js"></script>
    <script>lucide.createIcons();</script>
</body>

</html>
"""
    with open(os.path.join(BASE, f"erumag-{n}.html"), "w", encoding="utf-8") as fh:
        fh.write(doc)
    return n_art


def build_sitemap():
    pages = ["index.html", "about.html", "events.html", "erumag.html", "blog.html",
             "greentalks.html", "fieldtalks.html", "team.html", "contact.html"]
    pages += [f"erumag-{n}.html" for n in range(1, 6)]
    # existing standalone blog articles + all magazine articles
    extra_articles = ["article-openai.html", "article-serbest.html", "article-syria.html"]
    mag_articles = [f"article-{a['slug']}.html" for a in manifest]
    pages += mag_articles + extra_articles
    today = "2026-06-15"
    items = []
    for p in pages:
        items.append(f"    <url>\n        <loc>https://tedueru.github.io/{urllib.parse.quote(p)}</loc>\n        <lastmod>{today}</lastmod>\n    </url>")
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(items) + "\n</urlset>\n"
    with open(os.path.join(BASE, "sitemap.xml"), "w", encoding="utf-8") as fh:
        fh.write(xml)
    return len(pages)


if __name__ == "__main__":
    for n in range(1, 6):
        c = build_issue(n)
        print(f"erumag-{n}.html  ->  {c} article cards")
    total = build_sitemap()
    print(f"sitemap.xml -> {total} urls")
