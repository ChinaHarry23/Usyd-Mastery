---
name: File Structure Reference
type: reference
description: File Structure Reference
updated: 2026-04-03
---

---
name: File Structure Reference
type: reference
description: Key file paths and their roles after the dedup migration
updated: 2026-04-03
---

## Root shared/ (canonical modules)
- lang-toggle.js — Universal language toggle (NEW, replaces 4 per-site versions)
- home.css — Shared index page styles (all 4 sites use this + :root overrides)
- mission-control.js — Index page i18n + gamification
- progress-tracker.js — Chapter progress tracking
- chat-panel.js — AI chat panel
- flashcards.js, quiz-hub.js — Tool page logic (have own lang toggle)
- knowledge-graph.js, progress-dashboard.js — Tool page logic
- mindmap.js, mindmap.css — Mind map renderer
- storage.js — IndexedDB + localStorage adapter
- study-base.css — Base study page styles
- math.css, flashcards.css, quiz-hub.css, knowledge-graph.css, progress-dashboard.css

## Per-site shared/ (thin wrappers)
- lang-config.js — Sets window.LANG_CONFIG for universal lang-toggle (NEW)
- study.css — @import study-base.css + :root theme variables
- translations.js — Translation data (COMMON, CH, STUDY_T, etc.)
- section-translations.js — (5318 only) section-level HTML replacement data

## Scripts
- scripts/validate.js — Quiz/flashcard data + hub shared/ syntax check
- scripts/validate-manifest.js — Chapter manifest vs HTML consistency
- scripts/sync-shared.sh — Verify no stale canonical copies in hub shared/
- scripts/migrate-shared-paths.js — One-time migration tool

## CI
- .github/workflows/validate.yml — lint + validate + test + sync-check
- package.json scripts: test, lint, validate, validate:sync, ci