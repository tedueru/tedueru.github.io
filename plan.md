# TEDU ERU Website SEO And Improvement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the TEDU ERU static website for search visibility, credibility, and usability, while using `AgriciDaniel/claude-seo` as an SEO workflow and content-planning reference rather than as a runtime dependency.

**Architecture:** This site is a plain static HTML/CSS/JS website with 20 standalone HTML files and no build pipeline. The right approach is to keep the static architecture, add repeatable SEO/page templates, add missing technical SEO files, and fix weak UX/content trust signals across the existing pages.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Google Fonts, Lucide icons

---

## Recommendation

Yes, `https://github.com/AgriciDaniel/claude-seo` can be used for this website, but it should be used as a **playbook** for SEO tasks, not as a frontend package.

Use `claude-seo` for:
- page-type SEO checklists
- metadata and schema drafting prompts
- content-gap and internal-linking guidance
- GEO / AI-search readiness ideas

Do **not** use it as:
- a client-side script
- a direct dependency injected into these HTML pages
- a substitute for missing site infrastructure like `robots.txt`, `sitemap.xml`, and canonical URLs

## Current Assessment

What the local site already has:
- clear page titles on all pages
- `meta description` on 9 of 20 pages
- clean static URLs by filename
- a consistent visual system and mobile nav

High-impact gaps found locally:
- 0 pages have canonical URLs
- 0 pages have Open Graph tags
- 0 pages have Twitter card tags
- 0 pages have JSON-LD structured data
- no `robots.txt`
- no sitemap file
- many `href="#"` placeholder links still ship in production pages
- `target="_blank"` links are missing `rel="noopener noreferrer"`
- the contact form is a fake success alert, which hurts credibility
- article pages are thin in SEO framing compared with the listing pages

## Approach Options

### Option 1: Static-site SEO hardening on the current codebase

Use `claude-seo` prompts/checklists to improve the current HTML files in place.

Pros:
- fastest path
- low risk
- no migration cost
- fits the current site structure

Cons:
- repeated head/footer markup stays duplicated unless partially refactored

### Option 2: Static-site hardening plus light templating

Add a tiny build step or snippet-generation script so shared `<head>`, nav, footer, and schema blocks are generated instead of duplicated.

Pros:
- better long-term maintainability
- reduces copy/paste errors across 20 pages

Cons:
- introduces a build process into a site that currently has none

### Option 3: Full migration to a static-site framework

Move the site into Astro, Eleventy, or another SSG before SEO work.

Pros:
- best long-term maintainability
- easiest to scale content types later

Cons:
- overkill for the current site
- delays quick wins

**Recommended:** Option 1 now, with Option 2 only if the team expects frequent content updates.

## Dependencies And Assumptions

- A production domain is required before canonicals, sitemap entries, and `robots.txt` can be finalized.
- The repo currently has no Git metadata in this workspace, so version-control steps depend on where the real deploy source lives.
- There is no backend form handler yet.

## Implementation Tasks

### Task 1: Establish URL and page inventory

**Files:**
- Review: `index.html`
- Review: `about.html`
- Review: `events.html`
- Review: `erumag.html`
- Review: `blog.html`
- Review: `greentalks.html`
- Review: `fieldtalks.html`
- Review: `team.html`
- Review: `contact.html`
- Review: `article-*.html`
- Review: `erumag-*.html`

**Step 1: Confirm the public domain and preferred URL format**

Define:
- `https://<domain>/`
- whether `index.html` resolves publicly as `/`
- whether PDFs should be indexed or noindexed

**Step 2: Create a page inventory**

For each HTML file, record:
- public URL
- page type
- target keyword/topic
- title
- meta description
- schema type

**Step 3: Create the implementation source of truth**

Create a simple planning table in `plan.md` or a separate working doc so later edits are consistent across all pages.

### Task 2: Build a reusable SEO blueprint per page type

**Files:**
- Modify: `plan.md`
- Review: `index.html`
- Review: `blog.html`
- Review: `erumag.html`
- Review: `article-*.html`
- Review: `erumag-*.html`

**Step 1: Map page types**

Use these page types:
- Home
- About
- Team
- Contact
- Collection pages: `blog.html`, `erumag.html`, `greentalks.html`, `fieldtalks.html`
- Article/interview pages: `article-*.html`
- Issue detail pages: `erumag-*.html`
- Events page

**Step 2: Use `claude-seo` as the drafting workflow**

For each page type, use the repo's SEO playbooks/prompts to draft:
- title pattern
- description pattern
- canonical pattern
- Open Graph fields
- Twitter card fields
- structured data type

**Step 3: Freeze templates before page edits**

Create one approved metadata pattern per page type so the implementation is not improvised page by page.

### Task 3: Add baseline technical SEO to every HTML page

**Files:**
- Modify: `index.html`
- Modify: `about.html`
- Modify: `events.html`
- Modify: `erumag.html`
- Modify: `blog.html`
- Modify: `greentalks.html`
- Modify: `fieldtalks.html`
- Modify: `team.html`
- Modify: `contact.html`
- Modify: `article-basci.html`
- Modify: `article-bceao.html`
- Modify: `article-dincer.html`
- Modify: `article-openai.html`
- Modify: `article-podcasts.html`
- Modify: `article-serbest.html`
- Modify: `article-syria.html`
- Modify: `erumag-1.html`
- Modify: `erumag-2.html`
- Modify: `erumag-3.html`
- Modify: `erumag-4.html`

**Step 1: Fill missing descriptions**

Add `meta description` to the 11 pages that currently have none.

**Step 2: Add canonical URLs**

Add one canonical tag to every page using the confirmed production domain.

**Step 3: Add social metadata**

Add:
- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:image`
- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`

**Step 4: Normalize external links**

Add `rel="noopener noreferrer"` to every `target="_blank"` link.

### Task 4: Add structured data by page type

**Files:**
- Modify: `index.html`
- Modify: `about.html`
- Modify: `team.html`
- Modify: `contact.html`
- Modify: `blog.html`
- Modify: `erumag.html`
- Modify: `greentalks.html`
- Modify: `fieldtalks.html`
- Modify: `article-*.html`
- Modify: `erumag-*.html`

**Step 1: Add organization-level schema**

Add `Organization` to the homepage and, if appropriate, `AboutPage` / `ContactPage` metadata to the matching pages.

**Step 2: Add collection schema**

Add `CollectionPage` or `Blog` schema to:
- `blog.html`
- `erumag.html`
- `greentalks.html`
- `fieldtalks.html`

**Step 3: Add article schema**

Add `Article` or `NewsArticle` schema to each `article-*.html` page with:
- headline
- author
- date published
- description
- image
- publisher

**Step 4: Add publication/creative work schema**

Add `CreativeWork` or `PublicationIssue` style schema to `erumag-*.html` pages if the content structure supports it.

### Task 5: Ship crawl and discovery files

**Files:**
- Create: `robots.txt`
- Create: `sitemap.xml`
- Create: `llms.txt`

**Step 1: Add `robots.txt`**

Include:
- sitemap location
- crawl allow rules
- any intentional exclusions

**Step 2: Add `sitemap.xml`**

Include:
- all HTML pages
- PDFs only if they should be indexed
- lastmod values if available

**Step 3: Add `llms.txt`**

Summarize the site sections and key resources for AI crawlers. This is a low-cost addition that aligns with the GEO direction emphasized by `claude-seo`.

### Task 6: Improve weak trust and UX signals

**Files:**
- Modify: `index.html`
- Modify: `events.html`
- Modify: `contact.html`
- Modify: `about.html`
- Modify: `team.html`
- Modify: `blog.html`
- Modify: `erumag.html`
- Modify: `greentalks.html`
- Modify: `fieldtalks.html`

**Step 1: Replace or remove placeholder links**

Remove every production `href="#"` unless the real destination exists.

**Step 2: Fix the contact form**

Pick one honest behavior:
- real form backend
- `mailto:` fallback
- disabled form with explanatory copy

Do not keep the fake success alert.

**Step 3: Strengthen the events page**

Replace "coming soon" with:
- latest event recap
- upcoming event placeholder with date TBD
- newsletter or social CTA with real destinations

**Step 4: Make the footer legitimate**

Either create real privacy/terms pages or remove those links until they exist.

### Task 7: Improve article and content-page quality

**Files:**
- Modify: `article-basci.html`
- Modify: `article-bceao.html`
- Modify: `article-dincer.html`
- Modify: `article-openai.html`
- Modify: `article-podcasts.html`
- Modify: `article-serbest.html`
- Modify: `article-syria.html`
- Modify: `erumag-1.html`
- Modify: `erumag-2.html`
- Modify: `erumag-3.html`
- Modify: `erumag-4.html`
- Modify: `blog.html`
- Modify: `erumag.html`

**Step 1: Improve article framing**

Ensure each article page has:
- one clear topic statement near the top
- visible author and date
- relevant internal links
- a stronger call back to the parent section

**Step 2: Improve topical clustering**

Create stronger internal links between:
- `blog.html` and each article
- `erumag.html` and each issue
- issue pages and related interviews/articles
- `greentalks.html` / `fieldtalks.html` and the related podcast/article pages

**Step 3: Add richer page summaries**

Some pages currently describe content at a high level only. Expand them with 1 to 2 sections that explain value, recent highlights, and why a visitor should continue.

### Task 8: Improve performance and accessibility without changing the stack

**Files:**
- Modify: `style.css`
- Modify: `script.js`
- Modify: `index.html`
- Modify: content pages with images or embedded media links

**Step 1: Optimize media loading**

Add `loading="lazy"` where appropriate for non-critical images and thumbnails.

**Step 2: Review icon-script dependency**

Confirm `lucide.createIcons()` is only run where needed and does not cause unnecessary re-rendering.

**Step 3: Check visual accessibility**

Review:
- heading order
- button/link clarity
- color contrast
- mobile spacing on dense content pages

### Task 9: Verification checklist

**Files:**
- Verify: all `*.html`
- Verify: `robots.txt`
- Verify: `sitemap.xml`
- Verify: `llms.txt`

**Step 1: Verify metadata coverage**

Run:

```powershell
Select-String -Path *.html -Pattern '<meta name="description"|rel="canonical"|property="og:|name="twitter:|application/ld\+json'
```

Expected:
- every page has description and canonical
- every page has OG and Twitter tags
- structured data exists for the intended page types

**Step 2: Verify placeholder links are gone**

Run:

```powershell
Select-String -Path *.html -Pattern 'href="#"|onsubmit="event.preventDefault'
```

Expected:
- no placeholder links
- no fake contact submit handler

**Step 3: Verify discovery files exist**

Run:

```powershell
Get-ChildItem robots.txt,sitemap.xml,llms.txt
```

Expected:
- all three files exist in the site root

**Step 4: Manual QA**

Check locally in browser:
- desktop nav
- mobile nav
- homepage hero and section spacing
- article pages
- contact flow
- external social links

**Step 5: Post-deploy verification**

After deployment:
- inspect page source on production
- submit sitemap to Google Search Console and Bing Webmaster Tools
- test shared URLs in Open Graph debuggers

## Priority Order

1. Technical SEO baseline: canonicals, descriptions, OG, Twitter, JSON-LD
2. Crawl infrastructure: `robots.txt`, `sitemap.xml`, `llms.txt`
3. Trust fixes: real links, real contact behavior, footer cleanup
4. Content architecture: stronger internal links, richer article/page summaries
5. Performance and accessibility cleanup

## Expected Outcome

If executed well, this plan should produce:
- a fully indexable static site with modern metadata coverage
- better share previews and stronger article discoverability
- more trustworthy user experience on contact, events, and footer areas
- a reusable SEO process guided by `claude-seo` for future TEDU ERU content
