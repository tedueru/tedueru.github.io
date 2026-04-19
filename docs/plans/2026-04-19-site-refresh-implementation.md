# Site Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the approved TEDU ERU content and presentation refresh across the homepage, ERUMAG, events, blog, contact, team, and FieldTalks pages.

**Architecture:** Keep the existing static HTML structure and centralize most presentation changes in `style.css`. Update only the affected page sections and reuse local assets, generated ERUMAG covers, and verified social/video metadata.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, local PDF/image assets, Playwright for manual verification, Node for the existing smoke test.

---

### Task 1: Document Inputs And Asset Prep

**Files:**
- Create: `covers/erumag-1-cover.jpg`
- Create: `covers/erumag-2-cover.jpg`
- Create: `covers/erumag-3-cover.jpg`
- Create: `covers/erumag-4-cover.jpg`
- Create: `ig_events_full/event_33.jpg`
- Create: `ig_events_full/event_34.webp`
- Create: `ig_events_full/event_35.jpg`
- Create: `ig_events_full/event_36.jpg`

**Step 1: Generate ERUMAG cover images from the first PDF page**

Run:

```powershell
New-Item -ItemType Directory -Force covers | Out-Null
pdftoppm.exe -jpeg -f 1 -singlefile "ERUMAG_Issue1_2025.pdf" "covers/erumag-1-cover"
pdftoppm.exe -jpeg -f 1 -singlefile "ERUMAG, Issue 2, 2025.pdf" "covers/erumag-2-cover"
pdftoppm.exe -jpeg -f 1 -singlefile "ERUMAG, Issue 3, 2025.pdf" "covers/erumag-3-cover"
pdftoppm.exe -jpeg -f 1 -singlefile "ERUMAG, Issue 4, 2026.pdf" "covers/erumag-4-cover"
```

**Step 2: Save the four requested Instagram visuals into `ig_events_full`**

Use the already verified post image URLs and save them as `event_33` through `event_36`.

**Step 3: Visually inspect the generated covers and downloaded event images**

Check that each file opens and looks usable for the corresponding card.

### Task 2: Shared Visual System Refresh

**Files:**
- Modify: `style.css`

**Step 1: Add the new shared classes**

Add classes for:

- stronger nav brand styling
- clearer interactive card states
- richer footer layout
- homepage hero visual panel
- issue card cover images and tinted backgrounds
- issue hero split layout
- contact visual panel
- event card metadata chips
- Medium CTA link styling

**Step 2: Update the existing shared selectors minimally**

Adjust:

- `:root` color variables
- `.navbar`, `.nav-brand`, `.nav-brand-text`, `.nav-links a`
- `.card`, `.card-link`
- `.hero`, `.hero-bg`, `.hero-title span`
- `.footer`, `.footer-top`, `.footer-bottom`

**Step 3: Manually verify that shared styles still work responsively**

Check desktop and mobile widths after the page patches are in place.

### Task 3: Homepage Refresh

**Files:**
- Modify: `index.html`
- Modify: `style.css`

**Step 1: Replace the text-only hero body with a split hero**

Keep the existing headline and actions, but add a real ERU visual block on the right.

**Step 2: Make initiative cards obviously clickable**

Add a visible `Explore` / `View` cue or stronger hover-ready affordance in each card.

**Step 3: Replace the mission-side placeholder panel with a real ERU visual**

Use a local image rather than the generic icon block.

**Step 4: Expand the footer content**

Add address/email text to the homepage footer layout while keeping existing social links.

### Task 4: ERUMAG Listing And Issue Page Refresh

**Files:**
- Modify: `erumag.html`
- Modify: `erumag-1.html`
- Modify: `erumag-2.html`
- Modify: `erumag-3.html`
- Modify: `erumag-4.html`
- Modify: `style.css`

**Step 1: Rebuild the ERUMAG landing hero**

Use a split layout with text on the left and a magazine visual on the right.

**Step 2: Replace issue numbers with PDF cover images**

Each issue card should show the generated cover image, title, summary, and actions.

**Step 3: Rename the issues section heading**

Change `Print Editions` to an issues-focused label.

**Step 4: Add subtle issue-specific surface tinting**

Keep the cards readable, but stop them from looking identical.

**Step 5: Rework each issue detail header**

Add the cover image, summary text, and immediate access to the PDF near the top of the page.

### Task 5: Events Timeline Update

**Files:**
- Modify: `events.html`
- Modify: `style.css`

**Step 1: Simplify event metadata presentation**

Convert verbose inline details into a lighter visual stack with date, title, and compact secondary details.

**Step 2: Add the requested 2026 events**

Include:

- `Political Economy, Institutions, and Technology` - April 15, 2026 - `ig_events_full/event_36.jpg`
- `Akilli Uretim Sistemleri ve Kuresel Donusumler` - March 31, 2026 - online - `ig_events_full/event_35.jpg`
- `IBKI Conference at METU` - March 16, 2026 - attended by ERU - `ig_events_full/event_34.webp`
- `Toward COP31: Youth for Energy Transition and Climate Change` - March 4, 2026 - `ig_events_full/event_33.jpg`

**Step 3: Keep the attendance-only item in the normal list**

Do not create a separate attendance block.

**Step 4: Preserve all existing legacy events below the new items**

### Task 6: Blog, Contact, Team, And FieldTalks Content Updates

**Files:**
- Modify: `blog.html`
- Modify: `contact.html`
- Modify: `team.html`
- Modify: `fieldtalks.html`
- Modify: `style.css`

**Step 1: Blog**

Turn the Medium reference into a clear CTA link with stronger visual emphasis.

**Step 2: Contact**

Replace the left contact column content with a branded ERU visual block while preserving address, email, and the mailto form.

**Step 3: Team**

Change Ezgi Eylem Erdogan's role label to `President`.
Merge the audit board members into the main team section and remove the standalone `Audit Board` heading block.

**Step 4: FieldTalks**

Insert the four new video entries at the top in verified publish order.
Keep `Dijital Donusum Caginda Buyuk Guc Rekabeti` in FieldTalks.

### Task 7: Verification

**Files:**
- Test: `tests/seo-smoke.js`

**Step 1: Run the existing HTML smoke test**

Run:

```powershell
node tests/seo-smoke.js
```

Expected: `SEO smoke test passed ...`

**Step 2: Open the affected pages in Playwright**

Check:

- `index.html`
- `erumag.html`
- `erumag-1.html`
- `events.html`
- `blog.html`
- `contact.html`
- `team.html`
- `fieldtalks.html`

**Step 3: Confirm the specific screenshot requests**

Verify:

- clearer footer/info treatment
- stronger homepage visual balance
- ERUMAG cover usage
- clearer Medium CTA
- contact visual panel
- team role/section changes
- new FieldTalks ordering
- new events and normal treatment of the attendance item

**Step 4: Report any remaining gaps instead of claiming completion without evidence**

Plan complete and saved to `docs/plans/2026-04-19-site-refresh-implementation.md`.
