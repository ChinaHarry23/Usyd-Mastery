---
name: Session Patterns and Feedback
type: feedback
description: Session Patterns and Feedback
updated: 2026-04-03
---

---
name: Session Patterns and Feedback
type: feedback
description: Validated approaches and patterns from the 2026-04-03 dedup session
updated: 2026-04-03
---

## Validated Approach: CSS Externalization
- Pattern: Extract inline <style> to shared CSS file + thin :root variable overrides
- Comp5046 was the template (already used ../shared/home.css)
- Each sub-site overrides ~75 CSS custom properties for its color theme
- 5318 needed extra .home-header::after structural override (SVG background with specific positioning)
- Using subagents to handle one sub-site each in parallel worked well

## Validated Approach: Universal Module + Per-Site Config
- Pattern: shared/module.js reads window.CONFIG set by per-site config.js
- Config files are thin adapters (~15-30 lines) that bridge existing data formats
- Avoids changing translation data format — only the toggle module changes
- Script load order matters: data files → config.js → universal module.js

## Decision: Skip Low-ROI Dedup
- Tool pages (flashcards/quiz-hub) differ by only 3 lines — not worth templatizing
- renderMathInElement (4 calls) and getProgress/saveProgress (3 copies) duplication exists but centralizing requires adding new script deps to 100+ HTML files
- Better to accept small duplication than create fragile cross-file dependencies in a no-build-system project

## Testing Pattern
- Always run full `npm run ci` after changes (lint + validate + test + sync-check)
- sync-shared.sh --check catches stale hub copies of canonical files
- validate.js auto-syntax-checks all .js in hub shared/ directories
- 62 tests cover: SM-2 scheduling, progress tracking, SRS, DOM integration, HTML structure