import os
import base64
from playwright.sync_api import sync_playwright

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(BASE_DIR)

# Encode logo
with open('logo.jpg', 'rb') as f:
    logo_b64 = base64.b64encode(f.read()).decode('utf-8')

stories = [
    {
        "id": "story-the-new-democracy",
        "group_name": "Artificial Intelligence Economies",
        "title": "The New Democracy",
        "subtitle": "Sample the People and Let Them Choose",
        "excerpt_normal": "Imagine testing major policy proposals on synthetic populations before sending them to parliament. MatrAIx opens unprecedented infrastructure for policy simulation; ",
        "excerpt_italic": "knowing what citizens might choose is never a substitute for their democratic consent.",
        "quote": "Prediction is an input into decision-making; consent is the authority behind a decision. Let the machines test the choices. Let the people make them.",
        "author": "Arda Akgül",
        "group_tag": "Artificial Intelligence Economies"
    },
    {
        "id": "story-three-year-roadmap",
        "group_name": "Economy of Türkiye",
        "title": "Three-Year Economic Roadmap",
        "subtitle": "The 2027–2029 Medium-Term Program",
        "excerpt_normal": "The Medium-Term Program sets macroeconomic targets and policy assumptions for Türkiye's next three years. ",
        "excerpt_italic": "Domestic prices are projected to rise faster than the exchange rate, keeping the lira relatively strong in real terms while extending the disinflation horizon to 2029.",
        "quote": "Over the next three years, the GDP deflator is projected to rise by ~57% while the exchange rate rises by ~47%, implying that the lira remains relatively strong in real terms against domestic prices.",
        "author": "Berra Berin Kökkurtöz",
        "group_tag": "Economy of Türkiye · 2027–2029 MTP"
    }
]

def build_story_html(data):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Merriweather:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap" rel="stylesheet">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    width: 1080px;
    height: 1920px;
    background: #ffffff;
    font-family: 'Merriweather', 'Lora', Georgia, serif;
    color: #132b50;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  /* Top Right Corner Decoration */
  .corner-tr {{
    position: absolute;
    top: 0;
    right: 0;
    width: 380px;
    height: 380px;
    pointer-events: none;
    z-index: 1;
  }}

  /* Bottom Left Corner Decoration */
  .corner-bl {{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 380px;
    height: 380px;
    pointer-events: none;
    z-index: 1;
  }}

  /* Main Container */
  .story-wrap {{
    position: relative;
    z-index: 2;
    height: 100%;
    padding: 130px 105px 95px 105px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  /* Header Branding */
  .header-brand {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 68px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1.1;
    margin-bottom: 22px;
  }}
  .brand-research {{
    color: #132b50;
  }}
  .brand-groups {{
    color: #c83b23;
  }}

  .group-kicker {{
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 25px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: #1d4277;
    background: rgba(21, 50, 91, 0.06);
    padding: 9px 24px;
    border-radius: 999px;
    width: fit-content;
    border: 1.5px solid rgba(21, 50, 91, 0.12);
  }}

  /* Content Block */
  .content-block {{
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 46px;
  }}

  .story-title-wrap {{
    display: flex;
    flex-direction: column;
    gap: 16px;
  }}

  .story-title {{
    font-size: 62px;
    font-weight: 900;
    color: #132b50;
    line-height: 1.18;
    letter-spacing: -0.5px;
  }}

  .story-subtitle {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 31px;
    font-weight: 600;
    color: #556987;
    line-height: 1.35;
  }}

  /* Excerpt */
  .story-excerpt {{
    font-size: 36px;
    line-height: 1.62;
    color: #132b50;
    font-weight: 400;
  }}

  .story-excerpt em {{
    font-style: italic;
    color: #1d4277;
    font-weight: 400;
  }}

  /* Quote Block */
  .quote-box {{
    margin-top: 8px;
    padding-left: 34px;
    border-left: 6px solid #c83b23;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }}

  .quote-text {{
    font-size: 33px;
    line-height: 1.54;
    font-style: italic;
    color: #132b50;
  }}

  .author-row {{
    text-align: right;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }}

  .author-name {{
    font-size: 33px;
    font-weight: 800;
    color: #132b50;
    letter-spacing: 0.5px;
  }}

  .author-tag {{
    font-size: 21px;
    font-weight: 600;
    color: #64748b;
    margin-top: 5px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }}

  /* Dedicated Link Sticker Zone (Clean empty breathing room for Instagram Link Sticker) */
  .link-sticker-space {{
    flex: 1;
    min-height: 280px;
  }}

  /* Footer Section */
  .footer-wrap {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    border-top: 2px solid rgba(19, 43, 80, 0.08);
    padding-top: 36px;
  }}

  .footer-brand {{
    display: flex;
    align-items: center;
    gap: 16px;
  }}

  .footer-logo {{
    width: 62px;
    height: 62px;
    border-radius: 12px;
  }}

  .footer-text {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 25px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }}
  .text-tedu {{
    color: #c83b23;
  }}
  .text-eru {{
    color: #132b50;
    margin-left: 8px;
  }}

  .footer-url {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 21px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 1px;
  }}
  .footer-url span {{
    color: #c83b23;
    font-weight: 700;
  }}
</style>
</head>
<body>

  <!-- Top-Right Geometric Curve with Grid -->
  <svg class="corner-tr" viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="tr-clip">
        <path d="M 80 0 C 130 180, 260 310, 380 340 L 380 0 Z" />
      </clipPath>
    </defs>
    <path d="M 80 0 C 130 180, 260 310, 380 340 L 380 0 Z" fill="#132b50" />
    <g clip-path="url(#tr-clip)">
      <line x1="0" y1="50" x2="400" y2="250" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="0" y1="120" x2="400" y2="320" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="0" y1="190" x2="400" y2="390" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="0" y1="260" x2="400" y2="460" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="80" y1="0" x2="280" y2="400" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="160" y1="0" x2="360" y2="400" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="240" y1="0" x2="440" y2="400" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="320" y1="0" x2="520" y2="400" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    </g>
  </svg>

  <!-- Bottom-Left Geometric Curve with Grid -->
  <svg class="corner-bl" viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="bl-clip">
        <path d="M 0 40 C 120 70, 250 200, 300 380 L 0 380 Z" />
      </clipPath>
    </defs>
    <path d="M 0 40 C 120 70, 250 200, 300 380 L 0 380 Z" fill="#132b50" />
    <g clip-path="url(#bl-clip)">
      <line x1="-50" y1="100" x2="350" y2="300" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="-50" y1="170" x2="350" y2="370" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="-50" y1="240" x2="350" y2="440" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="-50" y1="310" x2="350" y2="510" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="40" y1="0" x2="240" y2="400" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="120" y1="0" x2="320" y2="400" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="200" y1="0" x2="400" y2="400" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    </g>
  </svg>

  <!-- Content Wrapper -->
  <div class="story-wrap">
    <!-- Header -->
    <div>
      <div class="header-brand">
        <span class="brand-research">Research</span><span class="brand-groups">Groups</span>
      </div>
      <div class="group-kicker">
        {data["group_name"]}
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-block">
      <div class="story-title-wrap">
        <h1 class="story-title">{data["title"]}</h1>
        <div class="story-subtitle">{data["subtitle"]}</div>
      </div>

      <p class="story-excerpt">
        {data["excerpt_normal"]}<em>{data["excerpt_italic"]}</em>
      </p>

      <div class="quote-box">
        <div class="quote-text">
          &ldquo;{data["quote"]}&rdquo;
        </div>
        <div class="author-row">
          <div class="author-name">Author: {data["author"]}</div>
          <div class="author-tag">{data["group_tag"]}</div>
        </div>
      </div>
    </div>

    <!-- Dedicated Empty Space for Instagram Link Sticker -->
    <div class="link-sticker-space"></div>

    <!-- Footer -->
    <div class="footer-wrap">
      <div class="footer-brand">
        <img src="data:image/jpeg;base64,{logo_b64}" class="footer-logo" alt="TEDU ERU">
        <div class="footer-text">
          <span class="text-tedu">TEDU</span><span class="text-eru">ECONOMICS RESEARCH UNION</span>
        </div>
      </div>
      <div class="footer-url">
        Read full article on <span>tedueru.github.io/blog</span>
      </div>
    </div>
  </div>

</body>
</html>
"""

os.makedirs('stories', exist_ok=True)
os.makedirs('assets/stories', exist_ok=True)

brain_dir = r'C:\Users\akgul\.gemini\antigravity\brain\538bbc41-cbe5-4030-9a98-a786f14a6efa'

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)

    for s in stories:
        html = build_story_html(s)
        html_file = f"stories/{s['id']}.html"
        with open(html_file, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Written {html_file}")

        page.set_content(html, wait_until="networkidle")
        page.wait_for_timeout(600)

        png_file = f"assets/stories/{s['id']}.png"
        page.screenshot(path=png_file, type="png")
        print(f"Generated {png_file}")

        # Also copy png to brain directory
        brain_png = os.path.join(brain_dir, f"{s['id']}.png")
        with open(png_file, 'rb') as src, open(brain_png, 'wb') as dst:
            dst.write(src.read())

    browser.close()

print("All story assets successfully generated!")
