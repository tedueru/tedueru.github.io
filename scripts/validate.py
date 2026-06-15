#!/usr/bin/env python3
"""Validate all generated ERUMAG article + issue pages."""
import json, os, re, glob, urllib.parse

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(BASE)
manifest = json.load(open("data/erumag/manifest.json", encoding="utf-8"))
slugs = [a["slug"] for a in manifest]
fig_by_slug = {a["slug"]: {f["file"] for f in a["figures"]} for a in manifest}

REQUIRED = [
    'class="reading-progress"', 'class="article-hero"', 'class="ai-summary',
    'class="article-body"', 'class="lead"', 'class="pullquote"',
    'class="article-source"', 'class="article-foot-nav"',
    '<script src="script.js">', 'lucide.createIcons',
]
BAD = ["TODO", "Lorem ipsum", "PLACEHOLDER", "data-lucide=\"\"", "<<", "undefined"]

problems = []
stats = []
for slug in slugs:
    fn = f"article-{slug}.html"
    if not os.path.exists(fn):
        problems.append(f"{fn}: MISSING"); continue
    h = open(fn, encoding="utf-8").read()
    p = []
    for r in REQUIRED:
        if r not in h:
            p.append(f"missing block {r!r}")
    for b in BAD:
        if b in h:
            p.append(f"contains {b!r}")
    # canonical
    if f'<link rel="canonical" href="{fn}">' not in h:
        p.append("bad/missing canonical")
    # exactly one pullquote
    if h.count('class="pullquote"') != 1:
        p.append(f"pullquote count = {h.count(chr(34)+'pullquote'+chr(34))}")
    # ai-summary bullets
    aiblock = re.search(r'<div class="ai-summary[\s\S]*?</ul>', h)
    nbul = aiblock.group(0).count("<li") if aiblock else 0
    if not (3 <= nbul <= 5):
        p.append(f"ai-summary bullets = {nbul}")
    # images: every src under assets/erumag must exist & be in this article's fig set
    imgs = re.findall(r'<img[^>]+src="([^"]+)"', h)
    for src in imgs:
        if src.startswith("assets/erumag/"):
            if not os.path.exists(src):
                p.append(f"img file missing: {src}")
            elif src not in fig_by_slug[slug]:
                p.append(f"img not in manifest figset: {src}")
        # alt text present
    for tag in re.findall(r'<img[^>]*>', h):
        if 'alt=' not in tag:
            p.append(f"img without alt: {tag[:60]}")
        # lazy-loading only required for content figures, not the nav logo
        if 'assets/erumag/' in tag and 'loading=' not in tag:
            p.append(f"figure img without loading: {tag[:60]}")
    # internal html links exist
    for href in re.findall(r'href="((?:article-|erumag)[^"]+\.html)"', h):
        if not os.path.exists(href):
            p.append(f"broken link: {href}")
    # PDF link present & file exists (decode %20)
    for href in re.findall(r'href="([^"]+\.pdf)"', h):
        decoded = urllib.parse.unquote(href)
        if not os.path.exists(decoded):
            p.append(f"broken pdf link: {href}")
    stats.append((slug, len(h), len(imgs), nbul))
    if p:
        problems.append(f"{fn}:\n    " + "\n    ".join(p))

# issue pages
for n in range(1, 6):
    fn = f"erumag-{n}.html"
    if not os.path.exists(fn):
        problems.append(f"{fn}: MISSING"); continue
    h = open(fn, encoding="utf-8").read()
    for href in re.findall(r'href="(article-[^"]+\.html)"', h):
        if not os.path.exists(href):
            problems.append(f"{fn}: broken card link {href}")

print(f"Checked {len(slugs)} article pages + 5 issue pages")
print(f"Total figures referenced: {sum(s[2] for s in stats)}")
sizes = [s[1] for s in stats]
print(f"HTML size: min {min(sizes)} / max {max(sizes)} bytes")
small = [s for s in stats if s[1] < 4000]
if small:
    print("WARN tiny pages:", [s[0] for s in small])
print()
if problems:
    print(f"!!! {len(problems)} PAGES WITH PROBLEMS:")
    for pr in problems:
        print(" -", pr)
else:
    print("ALL CHECKS PASSED [OK]")
