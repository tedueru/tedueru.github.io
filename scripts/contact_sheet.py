#!/usr/bin/env python3
"""Build per-issue contact sheets of all extracted figures for visual QA."""
import json, os, math
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
manifest = json.load(open(os.path.join(BASE, "data", "erumag", "manifest.json"), encoding="utf-8"))
OUT = os.path.join(BASE, "data", "erumag")

THUMB = 220
PAD = 26
COLS = 6

try:
    font = ImageFont.truetype("arial.ttf", 12)
except Exception:
    font = ImageFont.load_default()

by_issue = {}
for a in manifest:
    for i, f in enumerate(a["figures"]):
        by_issue.setdefault(a["issue"], []).append((f"{a['slug']}-f{i+1}", f["file"], f.get("caption", "")))

for issue, items in sorted(by_issue.items()):
    rows = math.ceil(len(items) / COLS)
    W = COLS * (THUMB + PAD) + PAD
    H = rows * (THUMB + PAD + 18) + PAD + 30
    sheet = Image.new("RGB", (W, H), (245, 245, 247))
    d = ImageDraw.Draw(sheet)
    d.text((PAD, 8), f"ERUMAG Issue {issue} - {len(items)} figures", fill=(0, 0, 0), font=font)
    for idx, (label, rel, cap) in enumerate(items):
        r, c = divmod(idx, COLS)
        x = PAD + c * (THUMB + PAD)
        y = 30 + PAD + r * (THUMB + PAD + 18)
        try:
            im = Image.open(os.path.join(BASE, rel)).convert("RGB")
            im.thumbnail((THUMB, THUMB))
            sheet.paste(im, (x, y))
            d.rectangle([x, y, x + im.width, y + im.height], outline=(180, 180, 180))
        except Exception as e:
            d.text((x, y + 40), f"ERR {e}", fill=(200, 0, 0), font=font)
        tag = label + ("  [cap]" if cap.strip() else "")
        d.text((x, y + THUMB + 2), tag[:34], fill=(20, 20, 20), font=font)
    path = os.path.join(OUT, f"contact-issue-{issue}.png")
    sheet.save(path)
    print(path, sheet.size)
