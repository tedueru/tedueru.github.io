export const meta = {
  name: 'erumag-articles',
  description: 'Convert 47 extracted ERUMAG magazine articles into polished standalone HTML reading pages (magazine layout + AI summary + figures), then verify each.',
  phases: [
    { title: 'Generate', detail: 'one agent per article writes article-<slug>.html' },
    { title: 'Verify', detail: 'check faithfulness, structure, figure paths; fix in place' },
  ],
};

const slugs = Array.isArray(args) ? args : JSON.parse(args); // array of slugs passed via Workflow args

const GEN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['ok', 'slug', 'filename', 'dek', 'minutes', 'kind', 'figures_used'],
  properties: {
    ok: { type: 'boolean' },
    slug: { type: 'string' },
    filename: { type: 'string' },
    kind: { type: 'string' },
    dek: { type: 'string', description: 'one-sentence teaser, <=22 words' },
    minutes: { type: 'number' },
    figures_used: { type: 'number' },
    note: { type: 'string' },
  },
};

const VERIFY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['slug', 'filename', 'dek', 'minutes', 'kind', 'verified', 'fixed'],
  properties: {
    slug: { type: 'string' },
    filename: { type: 'string' },
    kind: { type: 'string' },
    dek: { type: 'string' },
    minutes: { type: 'number' },
    verified: { type: 'boolean' },
    fixed: { type: 'boolean' },
    issues: { type: 'string' },
  },
};

const GEN_PROMPT = (slug) => `You convert ONE ERUMAG magazine article (extracted from a PDF) into a polished, standalone HTML reading page for the TEDU ERU website. Work only with the provided source — do NOT invent facts, data, names, quotes, or citations.

SLUG = "${slug}"

STEP 1 — Read these files with the Read tool:
  - "article-money-inflation.html"  -> the CANONICAL TEMPLATE. Match its <head>, nav, footer, <script> tags, the <div class="reading-progress">, the <header class="article-hero">, the <div class="ai-summary">, <article class="article-body">, <div class="article-source"> and <div class="article-foot-nav"> structure EXACTLY. Only the textual content and figures change.
  - "data/erumag/jobs/${slug}.json" -> metadata: issue, issue_title, issue_year, issue_date (YYYY-MM-DD), issue_pdf, title, kind ("article"|"interview"), filename, wordcount, figures: [{file, caption, w, h, page}].
  - "data/erumag/${slug}.txt"       -> the extracted body text (reading order is correct; page-number noise already stripped).

STEP 2 — Build the page content:
  • Byline: detect the author/byline from the first ~6 lines of the text (e.g. a person name, "Economics 3rd Year", "By ..."). If none is present, use "ERUMAG Editorial Team". Put it in <p class="article-byline">By <strong>NAME</strong>, ROLE</p> (drop ROLE if unknown).
  • Clean & lightly edit the body into magazine prose: fix PDF artifacts (broken/hyphenated words, doubled spaces), keep the author's meaning and wording, fix only grammar/flow. Remove stray lines that are really figure captions or data sources (e.g. "Data Source: World Bank", "Source: https://..."). Do not shorten substantially — cover the whole article faithfully.
  • Add 2–5 faithful <h2> section subheadings where the topic shifts. The FIRST body paragraph gets class="lead" (drop cap).
  • If the text ends with "Reference(s):" entries, move them to a final <h3>Selected references</h3> + <ul> (keep up to ~6; trim the rest).
  • INTERVIEWS (kind=="interview"): format each question as <h3> and each answer as <p>(s); keep intro/outro paragraphs.
  • Choose exactly ONE standout sentence as <blockquote class="pullquote">TEXT<cite>— Source</cite></blockquote> (omit <cite> if no clear speaker). Place it after the first 2–3 paragraphs and do NOT repeat that sentence in the body.

STEP 3 — Figures (use the "figures" array; reference each by its EXACT "file" path):
  • Spread them through the body near relevant text. Use <div class="figure-grid"> with two <figure class="article-figure"> for two related/adjacent figures; otherwise a single <figure class="article-figure">.
  • For interviews, if figure 1 is clearly a portrait/photo, use it as a lead figure right after the intro.
  • <figcaption>: use the figure's "caption" only if it reads as a real short caption; otherwise omit the figcaption.
  • EVERY <img> needs descriptive alt text and loading="lazy". Never invent an image path; only use paths from the JSON. Include the chart-like figures; you may include all figures.

STEP 4 — AI summary: write 3–4 "Key Takeaways" <li> bullets (each ≤ ~30 words, faithful). Keep the template's <p class="ai-summary-note"> disclaimer text.

STEP 5 — Head & hero specifics:
  • <title> = "ARTICLE TITLE — ERUMAG · TEDU ERU". meta description / og / twitter / canonical(="${slug ? 'article-' + slug + '.html' : ''}") / JSON-LD all set from the article (description ≤155 chars, faithful). og:image/twitter:image = first figure file if any, else "covers/erumag-<issue>-cover.jpg". JSON-LD @type "Article" with datePublished=issue_date, author, isPartOf PublicationIssue (issueNumber=issue), publisher TEDU ERU.
  • Hero kicker badge: <span class="article-badge">Article</span> OR <span class="article-badge article-badge--interview">Interview</span>. Kicker link: <a href="erumag-<issue>.html">ERUMAG · Issue <issue> — <issue_title></a>.
  • Hero <h1> = article title. Byline line. <div class="article-meta"> with: calendar + date (format issue_date as "Month D, YYYY"), clock + "<minutes> min read", book-open + "ERUMAG Issue <issue>".
  • minutes = max(1, Math.round(wordcount/200)).
  • article-source: "<strong>From ERUMAG Issue <issue> — <issue_title> (<year>).</strong> ... Read it in context in the <a href="ENCODED_PDF" target="_blank" rel="noopener noreferrer">full issue PDF</a>." where ENCODED_PDF is issue_pdf with spaces as %20.
  • article-foot-nav: "← Back to Issue <issue>" -> erumag-<issue>.html ; "All ERUMAG issues" -> erumag.html.

STEP 6 — Write the COMPLETE valid HTML5 document to "${'article-' + slug + '.html'}" with the Write tool. No markdown, no TODO/Lorem, no leftover raw "Source:" lines. Do not change nav links, footer, font links, or script tags.

Then return the StructuredOutput: ok (did you write the file), slug, filename, kind, dek (one-sentence teaser ≤22 words for the issue-page card), minutes, figures_used, note (any caveat).`;

const VERIFY_PROMPT = (gen, slug) => `Quality-check the generated ERUMAG article page and FIX problems in place.

SLUG = "${slug}", file = "article-${slug}.html".

Read "article-${slug}.html", "data/erumag/${slug}.txt" (the source), and "data/erumag/jobs/${slug}.json".

Check, and if any fail, FIX by re-Writing the file (keep everything else intact):
  1. Faithfulness: no invented facts/data/names/quotes beyond the source text. If you find fabrication, correct it to match the source.
  2. Structure present & correct: <div class="reading-progress">; <header class="article-hero"> with kicker badge + issue link, <h1>, byline, article-meta; one <div class="ai-summary"> with 3–4 <li> and the disclaimer note; <article class="article-body"> with a <p class="lead"> (drop cap) and 2+ <h2>; exactly one <blockquote class="pullquote">; <div class="article-source"> with the issue PDF link; <div class="article-foot-nav">.
  3. Figures: every <img src> exists in the job JSON "figures" list (no invented paths); every <img> has alt text + loading="lazy".
  4. Head: title, meta description, canonical=article-${slug}.html, JSON-LD valid, og/twitter image set.
  5. No raw artifacts: no stray "Data Source:"/"Source: http" lines in the body, no "TODO"/"Lorem", no markdown, valid closing tags.
  6. Nav/footer/script tags unchanged from the template.

Return StructuredOutput: slug, filename="article-${slug}.html", kind="${gen?.kind || ''}", dek="${(gen?.dek || '').replace(/"/g, "'")}", minutes=${gen?.minutes || 0}, verified (true if page is now correct), fixed (true if you re-wrote it), issues (short list of what you found/fixed, or "none").`;

log(`Generating ${slugs.length} ERUMAG article pages (generate -> verify)...`);

const results = await pipeline(
  slugs,
  (slug) => agent(GEN_PROMPT(slug), {
    label: `gen:${slug}`, phase: 'Generate', schema: GEN_SCHEMA, agentType: 'general-purpose', model: 'haiku',
  }),
  (gen, slug) => agent(VERIFY_PROMPT(gen, slug), {
    label: `verify:${slug}`, phase: 'Verify', schema: VERIFY_SCHEMA, agentType: 'general-purpose', model: 'haiku',
  }),
);

const done = results.filter(Boolean);
log(`Done: ${done.length}/${slugs.length} verified.`);
return done.map((r) => ({
  slug: r.slug, filename: r.filename, kind: r.kind,
  dek: r.dek, minutes: r.minutes, verified: r.verified, fixed: r.fixed, issues: r.issues,
}));
