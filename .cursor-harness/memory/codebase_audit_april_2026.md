---
name: Codebase Audit April 2026
type: project
description: Codebase Audit April 2026
updated: 2026-04-03
---

---
name: Codebase Audit April 2026
type: project
description: Full codebase audit findings, completed work, and remaining improvement areas
updated: 2026-04-03
---

## Architecture
- 4 course sub-sites: 5270 (12ch), 5318 (6ch), Comp5046 (6ch), COMP9001 (5ch)
- Root shared/ has canonical modules; sub-site shared/ has thin wrappers
- No build system — vanilla HTML/JS/CSS, static hosting
- Service worker sw.js with stale-while-revalidate
- CI: GitHub Actions validate.yml
- 62 tests passing (custom test runner, jsdom)

## Completed Work (2026-04-03 Session)

### Phase 5A: Index Page CSS Externalization
- Migrated 5270, 5318, COMP9001 index.html from ~600-line inline <style> to shared/home.css + thin :root overrides
- Each saved ~550-640 lines; Comp5046 was already using this pattern
- shared/home.css updated with .home-footer a styles

### Phase 5B: Universal Lang-Toggle Module
- Replaced 4 divergent per-site lang-toggle.js with single shared/lang-toggle.js
- Created per-site lang-config.js adapters (5270, 5318, Comp5046, COMP9001)
- Updated 54 chapter HTML files (36 in 5270, 18 in 5318) to use new script paths
- Deleted 4 old per-site lang-toggle.js files (~15KB total)
- Updated sync-shared.sh to include lang-toggle.js in canonical list
- Updated tests to verify new file structure
- API: window.getLang(), window.LangToggle.{get,set,toggle,apply}, langchange event
- Supports 4 strategies: data-i18n, CSS selector arrays, section HTML replacement, mindmap UI
- Comp5046 and COMP9001 chapter pages don't load lang-toggle (no translations wired yet)

## Critical Issues Still Open
1. XSS in chat-panel.js: sanitize() fallthrough + md() unescaped code blocks
2. innerHTML without sanitization in quiz-hub.js, flashcards.js, progress-dashboard.js
3. Data mismatch: index.html mission totals vs chapter-manifest.js
4. Tests copy logic instead of importing real modules — drift risk

## High Priority Still Open
- No SEO meta/OG tags across all pages
- ESLint missing recommended rules (@eslint/js)
- CI path filters incomplete (misses sw.js, root index.html, workflows)
- Knowledge graph lacks keyboard accessibility
- chat-panel.js: no focus trap, no Esc close, no aria-expanded

## Phase Roadmap (from audit)
- Phase 1 (Security): Fix XSS in chat-panel.js, unify innerHTML→textContent
- Phase 2 (Data consistency): Manifest-driven totals
- Phase 3 (Test reliability): Import real modules instead of copying logic
- Phase 4 (DX toolchain): ESLint recommended, CI paths, Prettier for HTML
- Phase 5 (Dedup): DONE — CSS externalized + universal lang-toggle
- Phase 6 (Accessibility): KG keyboard nav, ARIA, focus management
- Phase 7 (SEO/Performance): Meta tags, defer scripts, SRI for CDN

## Stack
Vanilla JS, KaTeX 0.16.9 (jsDelivr), Google Fonts, eslint/jsdom/prettier, GitHub Actions CI