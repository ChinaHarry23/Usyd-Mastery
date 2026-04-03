---
name: Codebase Audit April 2026
type: project
description: Codebase Audit April 2026
updated: 2026-04-03
---

## Architecture
- 4 course sub-sites: 5270 (12ch), 5318 (6ch), Comp5046 (6ch), COMP9001 (5ch)
- Root shared/ has canonical modules; sub-site shared/ has thin wrappers
- No build system — vanilla HTML/JS/CSS, static hosting
- Service worker sw.js with stale-while-revalidate

## Critical Issues
1. XSS in chat-panel.js: sanitize() fallthrough + md() unescaped code blocks
2. innerHTML without sanitization in quiz-hub.js, flashcards.js, progress-dashboard.js
3. Data mismatch: index.html mission totals vs chapter-manifest.js
4. Tests copy logic instead of importing real modules — drift risk

## High Priority
- No SEO meta/OG tags
- 600+ lines inline CSS in index pages
- ESLint missing recommended rules
- CI path filters incomplete
- 4 different lang-toggle implementations
- Knowledge graph lacks keyboard accessibility

## Stack: vanilla JS, KaTeX, Google Fonts, eslint/jsdom/prettier, GitHub Actions CI