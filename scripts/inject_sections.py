#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Inject a 'Latest from ERUMAG' section into index.html and a 'From ERUMAG'
section into blog.html. Idempotent: skips if the marker already exists."""
import json, html, datetime, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(BASE)
M = {a["slug"]: a for a in json.load(open("data/erumag/manifest.json", encoding="utf-8"))}
DEKS = json.load(open("data/erumag/deks.json", encoding="utf-8"))


def esc(s):
    return html.escape(s, quote=True)


def fmtd(d):
    return datetime.date.fromisoformat(d).strftime("%b %d, %Y").replace(" 0", " ")


def mins(wc):
    return max(1, round(wc / 200))


def card(slug):
    a = M[slug]
    kind = "Interview" if a["kind"] == "interview" else "Article"
    label = f"{fmtd(a['issue_date'])} · {kind} · {mins(a['wordcount'])} min"
    dek = (DEKS.get(slug) or a["title"]).strip()
    verb = "Read interview" if a["kind"] == "interview" else "Read article"
    return (
        f'                <a href="article-{slug}.html" class="card initiative-card">\n'
        f'                    <p class="section-label" style="margin-bottom:.25rem;">{esc(label)}</p>\n'
        f'                    <h3 style="font-size:1.15rem;">{esc(a["title"])}</h3>\n'
        f'                    <p>{esc(dek)}</p>\n'
        f'                    <span class="card-link">{verb} <i data-lucide="arrow-right"></i></span>\n'
        f'                </a>'
    )


HOME = ["ai-labor-market", "big-tech-economy", "cilasun", "gitmez"]
BLOG = ["ai-money-machine", "cilasun", "acemoglu-nobel", "three-kids", "consumerism", "eu-common-currency"]

home_section = f"""    <section class="section" id="latest-erumag">
        <div class="container" style="max-width:980px;">
            <p class="section-label text-center reveal">Our Publication</p>
            <h2 class="section-title text-center reveal">Latest from ERUMAG</h2>
            <div class="separator reveal"></div>
            <p class="section-desc reveal" style="text-align:center;">Every article from our newest issue, now readable on its own page with a quick AI summary and charts.</p>

            <div class="grid-2 stagger">

{chr(10).join(card(s) for s in HOME)}

            </div>

            <div style="margin-top:2.5rem;text-align:center;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
                <a href="erumag-5.html" class="btn btn-primary">Read Issue 5</a>
                <a href="erumag.html" class="btn btn-ghost">Browse all issues</a>
            </div>
        </div>
    </section>

"""

blog_section = f"""    <section class="section bg-alt" id="from-erumag">
        <div class="container" style="max-width:900px;">
            <p class="section-label text-center reveal">Straight From the Magazine</p>
            <h2 class="section-title text-center reveal">From ERUMAG</h2>
            <div class="separator reveal"></div>
            <p class="section-desc reveal" style="text-align:center;">Highlights from the ERUMAG archive &mdash; each magazine article is published as its own page with an AI summary and charts.</p>

            <div class="grid-2 stagger">

{chr(10).join(card(s) for s in BLOG)}

            </div>

            <div style="margin-top:2.5rem;text-align:center;">
                <a href="erumag.html" class="btn btn-primary">Browse all 5 issues</a>
            </div>
        </div>
    </section>

"""

# --- index.html ---
idx = open("index.html", encoding="utf-8").read()
if 'id="latest-erumag"' in idx:
    print("index.html: section already present, skipping")
else:
    anchor = '    <section class="section">\n        <div class="container">\n            <div class="grid-2" style="align-items:center;gap:2rem;">'
    assert anchor in idx, "index.html anchor (Mission section) not found"
    idx = idx.replace(anchor, home_section + anchor, 1)
    open("index.html", "w", encoding="utf-8").write(idx)
    print("index.html: inserted 'Latest from ERUMAG' section")

# --- blog.html ---
blog = open("blog.html", encoding="utf-8").read()
if 'id="from-erumag"' in blog:
    print("blog.html: section already present, skipping")
else:
    anchor = "    <footer class=\"footer\">"
    assert anchor in blog, "blog.html footer anchor not found"
    blog = blog.replace(anchor, blog_section + anchor, 1)
    open("blog.html", "w", encoding="utf-8").write(blog)
    print("blog.html: inserted 'From ERUMAG' section")
