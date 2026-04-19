# TEDU ERU Site Refresh Design

**Date:** 2026-04-19

**Scope:** Shared branding polish plus targeted content and layout updates across `index.html`, `erumag.html`, `erumag-1.html` to `erumag-4.html`, `events.html`, `blog.html`, `contact.html`, `team.html`, `fieldtalks.html`, and `style.css`.

## Approved Direction

- Keep the current static-site architecture.
- Apply the clearly requested screenshot fixes first.
- Add only a light redesign where the screenshots explicitly ask for stronger visuals, clearer links, or improved hierarchy.
- Reuse real local assets already in the repository wherever possible.

## Shared UI

- Strengthen the logo lockup and navigation typography through CSS rather than rewriting the entire header component.
- Keep the current navigation structure and active-page behavior.
- Move the color emphasis away from the current blue-purple gradient toward a more consistent blue-led palette.
- Make footer content more informative and easier to scan.

## Homepage

- Refresh the hero background with a soft blue atmosphere.
- Add a stronger visual brand panel so the top section is not text-only.
- Make initiative cards feel obviously clickable before hover.
- Replace the simple "Analyze. Debate. Impact." block with a real ERU visual.
- Expand the footer area to include address and contact context.

## ERUMAG

- Replace the text-heavy hero with a left-text/right-visual layout.
- Rename the issue list heading from `Print Editions` to a more natural issues-oriented title.
- Replace oversized outlined issue numbers with real cover images generated from the issue PDFs.
- Tint each issue card background subtly to feel less generic.
- Add cover-led hero sections to each issue detail page and give users an immediate path to open the issue PDF.

## Events

- Keep the current timeline concept but reduce metadata density inside event cards.
- Treat event cards like richer destination modules with posters or photos as primary visuals.
- Add the requested new 2026 items from Instagram.
- Show the METU attendance item in the same normal event list, per user instruction.

## Blog

- Keep the current article grid.
- Make the Medium link more visually obvious and unmistakably clickable.

## Contact

- Keep the existing form behavior.
- Replace the plain dark left column with a more visual ERU contact panel using the local logo and branded messaging.

## Team

- Change `Chairperson of the Board` to `President`.
- Fold the audit board members into the main team presentation instead of a separate `Audit Board` section.
- Keep the card layout, with minor hierarchy cleanup.

## FieldTalks

- Add these four videos to the top of the list in newest-to-oldest publish order, verified from the TED University Economics Research Union YouTube channel feed:
  - `SK42iFAkiTc` - `Political Economy, Institutions and Technology - Asst. Prof. Arda Gitmez` - 2026-04-19
  - `aRMS2e9ayp8` - `Politik Iktisat, Kurumlar ve Teknoloji - Dr. Ogr. Uyesi Arda Gitmez` - 2026-04-19
  - `fZozYKE4zSo` - `Akilli Uretim Sistemleri ve Kuresel Donusumler - Prof. Dr. Erkan Erdil` - 2026-04-02
  - `1wu4VIDwBP0` - `Dijital Donusum Caginda Buyuk Guc Rekabeti - Doc. Dr. Emre Demir ve Dr. Berkay Orhaner` - 2025-12-27
- Keep `Dijital Donusum Caginda Buyuk Guc Rekabeti` in FieldTalks, not GreenTalks.

## Constraints

- No large architecture rewrite.
- No separate event detail pages in this pass.
- No placeholder imagery when a real local or linked event visual exists.
- This workspace is not a git repository, so the design document cannot be committed here.
