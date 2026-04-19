# Advisory Board Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an Advisory Board section to the team page and expose it through a new site-wide nav item linking to the anchored section.

**Architecture:** Reuse the existing static multi-page HTML structure. Add one new anchored section in `team.html`, then update the shared nav markup across top-level HTML pages so the new section is reachable from anywhere on the site.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node smoke tests

---

### Task 1: Add a failing regression test for the new nav item and advisory section

**Files:**
- Modify: `tests/content-refresh-smoke.js`

**Step 1: Write the failing test**

Add assertions that:
- `team.html` contains `id="advisory-board"`
- `team.html` contains `Advisory Board`
- `team.html` contains all five advisory names with Turkish characters
- at least key pages contain `href="team.html#advisory-board"`

**Step 2: Run test to verify it fails**

Run: `node tests/content-refresh-smoke.js`
Expected: FAIL because the new section and nav item do not exist yet.

**Step 3: Write minimal implementation in the test**

Use the existing pattern in `tests/content-refresh-smoke.js`:
- `expectIncludes(...)`
- direct `read(...)` checks for duplicate/required content

**Step 4: Run test to verify it still fails for the missing feature**

Run: `node tests/content-refresh-smoke.js`
Expected: FAIL with missing advisory board content.

**Step 5: Commit**

Repository is not initialized as git in this workspace, so no commit step can be executed.

### Task 2: Update site-wide navigation

**Files:**
- Modify: top-level `*.html` pages that currently contain the shared nav block

**Step 1: Write the failing test**

Use the checks from Task 1 to verify the nav item is missing from at least:
- `index.html`
- `team.html`
- `events.html`

**Step 2: Run test to verify it fails**

Run: `node tests/content-refresh-smoke.js`
Expected: FAIL with missing `team.html#advisory-board`.

**Step 3: Write minimal implementation**

Insert:

```html
<li><a href="team.html">Our Team</a></li>
<li><a href="team.html#advisory-board">Advisory Board</a></li>
<li><a href="contact.html" class="btn btn-outline">Contact</a></li>
```

Update all top-level pages that share this nav structure.

**Step 4: Run test to verify nav assertions pass**

Run: `node tests/content-refresh-smoke.js`
Expected: advisory-nav assertions pass, but section assertions may still fail until Task 3 is done.

**Step 5: Commit**

Repository is not initialized as git in this workspace, so no commit step can be executed.

### Task 3: Add the Advisory Board section to the team page

**Files:**
- Modify: `team.html`

**Step 1: Write the failing test**

Use Task 1 assertions to require:
- `id="advisory-board"`
- advisory intro copy
- five advisory names
- `Nejat Yılmaz` appears in both founder/advisory areas

**Step 2: Run test to verify it fails**

Run: `node tests/content-refresh-smoke.js`
Expected: FAIL because the new section is not yet present.

**Step 3: Write minimal implementation**

Add a new section after the existing team grid:

```html
<section class="section bg-white" id="advisory-board">
  <div class="container">
    <h2 class="group-title reveal">Advisory Board</h2>
    <p class="section-desc text-center reveal">The Advisory Board supports the executive team on strategy, continuity, and execution across ERU's projects and operations.</p>
    <div class="team-grid stagger">
      ...
    </div>
  </div>
</section>
```

Cards:
- Kerem Yürekli
- Nejat Yılmaz
- Gökçe Başaran
- Mustafa Boydaş
- Orkun Apaydın

Each card uses role text:

```html
<p class="role">Advisory Board Member</p>
```

**Step 4: Run test to verify it passes**

Run: `node tests/content-refresh-smoke.js`
Expected: PASS

**Step 5: Commit**

Repository is not initialized as git in this workspace, so no commit step can be executed.

### Task 4: Run full verification

**Files:**
- Verify only

**Step 1: Run advisory smoke test**

Run: `node tests/content-refresh-smoke.js`
Expected: PASS

**Step 2: Run existing HTML smoke test**

Run: `node tests/seo-smoke.js`
Expected: PASS

**Step 3: Browser-check the team page anchor**

Run a local static server and open:
- `http://127.0.0.1:8123/team.html`
- `http://127.0.0.1:8123/team.html#advisory-board`

Expected:
- nav contains `Advisory Board`
- advisory section appears below the main team section
- advisory names render correctly with Turkish characters

**Step 4: Clean up temporary server**

Stop the local `python -m http.server 8123` process.

**Step 5: Commit**

Repository is not initialized as git in this workspace, so no commit step can be executed.
