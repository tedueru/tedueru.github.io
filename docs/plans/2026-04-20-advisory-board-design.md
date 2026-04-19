# Advisory Board Design

## Goal
Add an `Advisory Board` section to the existing team page and expose it in the site-wide navigation without creating a separate page.

## Approved Direction
- Keep the existing [team.html](C:\Users\akgul\Downloads\tedueru\tedueru.github.io-main\tedueru.github.io-main\team.html) structure.
- Add a new `Advisory Board` section after the current `Our Team` section.
- Add a new nav item immediately to the right of `Our Team`, linking to `team.html#advisory-board`.
- Keep `Nejat Yılmaz` in both `Academic Advisor & Founder` and `Advisory Board`.

## Section Content
The new section will include a short explanatory sentence:

`The Advisory Board supports the executive team on strategy, continuity, and execution across ERU's projects and operations.`

Members:
- Kerem Yürekli
- Nejat Yılmaz
- Gökçe Başaran
- Mustafa Boydaş
- Orkun Apaydın

Each card will reuse the current team-card presentation:
- initials avatar
- name
- role: `Advisory Board Member`
- LinkedIn button

## Navigation
- Add `Advisory Board` after `Our Team` and before `Contact` in the nav across the site’s top-level HTML pages.
- The link target will be `team.html#advisory-board`.

## Constraints
- Preserve Turkish characters in names and labels.
- Do not create a new page.
- Keep scope tight to navigation plus team-page content.

## Verification
- New nav item is present and links to `team.html#advisory-board`.
- `team.html` contains an `Advisory Board` section with all five people.
- `Nejat Yılmaz` appears in both the founder block and the advisory section.
- Existing smoke tests still pass.
