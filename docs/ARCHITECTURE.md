# Architecture

The project is a **static study-hub engine**. Three things are kept deliberately separate:

1. **the engine** — `shared/`, hand-written vanilla JS and CSS, identical for every course;
2. **a content pack** — `content/<pack>/`, the only thing an author writes;
3. **generated output** — a hub directory (`demo/`, or any sibling of `shared/`), written
   only by `scripts/build-hub.js`.

Everything else in the repository (the ten course hubs at the root, the root portal, the
brand assets) predates the generator and is hand-maintained. Only `content/demo` is
generated end to end today.

---

## 1. The engine / content / output split

| Location | Kind | Who writes it | Notes |
|---|---|---|---|
| `shared/**` | **Engine** | hand-written | Modules and stylesheets loaded by every hub through relative paths. Changing a file here changes every hub that loads it. |
| `scripts/**` | **Engine tooling** | hand-written | `build-hub.js` (renderer), `verify-pack.js` (gate), `extract-templates.js` (template extraction), plus the older hub-maintenance scripts. |
| `templates/*.html` | **Engine** | `extract-templates.js`, except `hub-home.html` | Page shells with `{{TOKEN}}` placeholders. |
| `tests/**` | **Engine tests** | hand-written | Node scripts, no framework. |
| `content/<pack>/**` | **Content** | the author (human or agent) | `course.json`, `chapters/NN/{study.html,math.html,mindmap.json,study.js}`, `data/{quiz,flashcards,kg,mkg}.json`. The pack format is documented in [`AUTHORING.md`](AUTHORING.md). |
| `<hub>/**` | **Generated output** | `build-hub.js` only | `index.html`, `chapters/…`, `tools/…`, `data/…`, `shared/…`, and a `.gitignore`. |

**Rule: generated files are never hand-edited.** The hub's `shared/study.css`,
`shared/lang-config.js`, `shared/translations.js`, `data/*.js`, every page and the
`.gitignore` all carry a "generated" comment where it matters, and the next
`build-hub.js` run overwrites them without warning. Anything you want to persist belongs in
the pack, in `templates/`, or in `shared/` — and if it belongs to a specific course, it
currently has to be re-applied after each build (see §8, item 5).

Two path conventions make the split work, and they are why a hub must live **directly**
under the repository root:

| Consumer | Reference written by the template | Resolves to |
|---|---|---|
| `index.html` (hub home) | `../shared/mission-control.js` | `<repo>/shared/mission-control.js` |
| `tools/*.html` | `../../shared/quiz-hub.js` | `<repo>/shared/quiz-hub.js` |
| `chapters/chapterN/web/*.html` | `../../../../shared/interactive.js` | `<repo>/shared/interactive.js` |
| `chapters/chapterN/web/*.html` (hub-local) | `../../../shared/study.css` | `<hub>/shared/study.css` |
| `<hub>/shared/study.css` | `@import url("../../shared/study-base.css")` | `<repo>/shared/study-base.css` |

---

## 2. The generation pipeline

```
content/<pack>/                         the only authored input
      │
      │  1. GATE
      ▼
scripts/verify-pack.js   ────── fail ──▶  prints "<n> problem(s) — the pack will not build",
      │                                   exits 1, nothing is rendered
      │  pass ("Pack is valid. ✓", exit 0)
      ▼
scripts/build-hub.js                    ── verify-pack is spawned as a child process
      │                                    unless --skip-verify is passed
      │  2. RENDER
      │     ├─ fill(templates/chapter-study.html)     per chapter
      │     ├─ fill(templates/chapter-math.html)      per chapter
      │     ├─ fill(templates/chapter-mindmap.html)   per chapter (+ mindmap.json inlined)
      │     ├─ fill(templates/hub-home.html)          once
      │     ├─ fill(templates/tool-*.html)            five tool pages
      │     ├─ themeCSS(course.json.theme)         → shared/study.css
      │     ├─ langConfig(course.json)             → shared/lang-config.js
      │     ├─ kgHeader() + data/{kg,mkg}.json     → tools/{kg,mkg}-data.js
      │     ├─ data/{quiz,flashcards}.json         → data/quiz-data-extract.js, data/flashcard-data.js
      │     ├─ countManifest(rendered pages)       → data/chapter-manifest.js
      │     └─ course.json chapters                → data/site-data.js
      ▼
<hub>/                                  self-contained static site, 32 files for the demo
```

The generated file set, in full:

```
<hub>/index.html                              hub home (Mission Control)
<hub>/chapters/chapterN/web/chapterN-study.html      study page + sidebar derived from the fragment
<hub>/chapters/chapterN/web/chapterN-math.html       foundations page + TOC derived from the fragment
<hub>/chapters/chapterN/web/chapterN-mindmap.html    full-screen mind map with the tree inlined
<hub>/chapters/chapterN/web/chapterN-study.js        copied verbatim, only when the pack has one
<hub>/chapters/chapterN/materials/.gitkeep           empty drop box for the learner's own files
<hub>/tools/{quiz-hub,flashcards,knowledge-graph,math-knowledge-graph,progress-dashboard}.html
<hub>/tools/{kg-data,mkg-data}.js
<hub>/data/{quiz-data-extract,flashcard-data,chapter-manifest,site-data}.js
<hub>/shared/{study.css,lang-config.js,translations.js,section-translations.js}
<hub>/.gitignore                              ignores chapters/*/materials/* except .gitkeep
```

### Why rendering is code and not an agent

The engine's promise is that the same pack produces the same bytes:

* **Byte-identical rebuilds.** `tests/test-generator.js` builds the demo pack twice into two
  directories and compares a SHA-256 over the sorted `(relative path, contents)` list. There
  is no timestamp, no random seed and no environment-dependent value in any emitted file:
  `sequence`'s shuffle seed lives in the widget config (default `7`) and is applied at
  runtime, not at build time.
* **Reviewable diffs.** Because output is a pure function of input, a content change shows
  up as a diff in `content/`, and a rebuild shows up as the corresponding diff in the hub.
  Nothing else moves.
* **No per-page cost.** A build is string filling, `JSON.stringify` and a page scan —
  `wrote 32 files` for the demo, in well under a second, on a laptop, with no network. An
  agent-driven render would add latency, cost and non-determinism to an operation that is
  already fully specified by the pack.
* **A single writer.** `build-hub.js` is the only thing that writes pages, so every page
  shape is one template edit away from being fixed everywhere at once.

The gate is a separate process on purpose: `build-hub.js` spawns
`node scripts/verify-pack.js <pack>` and aborts on a non-zero exit, printing
`build-hub: the content pack failed verification. Fix the problems above,` — so the failure
mode for a malformed pack is a list of named problems rather than a half-written hub.

---

## 3. The template system

`templates/*.html` are page shells with every course-specific value replaced by a
`{{TOKEN}}`. `fill()` (`scripts/build-hub.js:43`) substitutes only tokens that exist in the
token object and leaves unknown `{{…}}` text in place, which is why
`tests/test-generator.js` has a "no template token survives into the output" check.

### How the templates are produced

`scripts/extract-templates.js` is a developer tool, run only when a page shell changes:

```bash
npm run templates                 # or: node scripts/extract-templates.js [referenceHub]
```

* It picks a **reference hub** — the first root directory that is not one of
  `node_modules`, `shared`, `scripts`, `templates`, `content`, `docs` and that contains
  `chapters/chapter1/web/chapter1-{study,math,mindmap}.html`, sorted alphabetically.
* It slices that hub's real pages apart: the study shell between `<nav id="sidebar">` and
  `</main>`, the math shell around `<nav class="toc-sidebar">`, the mind map shell around
  its inline data block, and each `tools/*.html` page.
* It tokenises paths (`../../../../shared/` → `{{ENGINE}}/`, `../../../shared/` →
  `{{HUB_SHARED}}/`, `../../../index.html` → `{{HUB_ROOT}}/index.html`), the chapter base
  name (`chapter1` → `{{CHAPTER_BASE}}`), titles and descriptions, the storage-key prefix,
  the course code, `numChapters`, and the tool pages' `chapterNames` / `chapterNamesZh`
  literals.
* It writes `templates/chapter-study.html`, `chapter-math.html`, `chapter-mindmap.html` and
  one `tool-*.html` per tool page. It prints, correctly,
  `Still authored by hand: templates/hub-home.html`.

`templates/hub-home.html` is the one template that is hand-written and maintained directly.

### Tokens accepted

| Template | Tokens |
|---|---|
| `chapter-study.html` | `TITLE`, `DESC`, `CHAPTER_BASE`, `CHAPTER_ICON`, `CHAPTER_LABEL`, `NAV_LINKS`, `PAGE_SCRIPT`, `PROGRESS_LABEL`, `CONTENT`, `HUB_CSS`, `HUB_SHARED`, `HUB_ROOT`, `ENGINE` |
| `chapter-math.html` | `TITLE`, `DESC`, `CHAPTER_BASE`, `CHAPTER_ICON`, `CHAPTER_LABEL`, `NAV_LINKS`, `CONTENT`, `HUB_CSS`, `HUB_SHARED`, `HUB_ROOT`, `ENGINE` |
| `chapter-mindmap.html` | `TITLE`, `DESC`, `CHAPTER_LABEL`, `LEGEND`, `MINDMAP_DATA`, `HUB_CSS`, `HUB_SHARED`, `HUB_ROOT`, `ENGINE` |
| `hub-home.html` | `TITLE`, `DESC`, `CODE`, `TERM`, `TITLE_TEXT`, `SUBTITLE`, `HERO_IMAGE`, `HERO_METRICS`, `PIPELINE_STEPS`, `CHAPTER_CARDS`, `FOOTER`, `FOOTER_NOTE`, `FOOTER_ZH`, `FOOTER_NOTE_ZH`, `STORAGE_KEY` |
| `tool-quiz-hub.html` | `TITLE`, `DESC`, `STORAGE_KEY`, `NUM_CHAPTERS` |
| `tool-flashcards.html` | `TITLE`, `DESC`, `STORAGE_KEY`, `NUM_CHAPTERS` |
| `tool-progress-dashboard.html` | `TITLE`, `DESC`, `CODE`, `STORAGE_KEY`, `NUM_CHAPTERS`, `CHAPTER_NAMES` |
| `tool-knowledge-graph.html`, `tool-math-knowledge-graph.html` | `TITLE`, `DESC` (their data comes from `tools/kg-data.js` / `mkg-data.js`, not from tokens) |

`fill()` only understands `{{UPPER_SNAKE}}`. A token left in a template that the generator
never supplies is emitted verbatim, and the generator's test suite fails on it.

### Rule for shell changes

Editing a chapter or tool template by hand is a dead end: the next
`extract-templates.js` run overwrites it from the reference hub. The intended loop is:

1. change the reference hub's page (or hand-edit the template and accept that re-extraction
   will revert it);
2. `npm run templates`;
3. re-run the structural tests that assert what a generated page must contain —
   `node tests/test-generator.js` (tokens, references, banner/sidebar match) and
   `node tests/test-hub-structure.js` (the per-hub contract, which also covers the
   hand-built hubs).

### What the current templates get wrong

Re-extraction is not a formality — the current templates carry reference-hub content. All
of the following were verified against the generated demo hub:

| Template | Defect | Evidence |
|---|---|---|
| `chapter-mindmap.html` | Emits **two complete documents** per page. The first copy contains a stale literal `var data = { … }` from the reference hub (COMP5047: "The ubicomp vision", `label_zh` twins, `chapter1-study.html#sec-ubicomp`) followed by `renderMindmap('mindmapCanvas', data)`; then a literal `</html><body>`, then the real shell with `{{MINDMAP_DATA}}`. | `grep -c '<html' demo/chapters/chapter1/web/chapter1-mindmap.html` → `2`; the generated page has two `#mindmapCanvas` elements and the second is never drawn into; `document.body.textContent` still contains "ubicomp vision". |
| `hub-home.html` | `initMissionControl({ … totalChapters: 8 … })` is hardcoded, not a token. Every generated hub home claims 8 chapters regardless of the pack. | `templates/hub-home.html:191`; `demo/index.html:262` has `totalChapters: 8` for a 3-chapter pack. |
| `hub-home.html` | A large literal `translations` block (24 `chN-*` entries plus pipeline/metric labels) holds COMP5047's Chinese course text (普适计算, Weiser, Arduino …). It is emitted into every hub home. | `templates/hub-home.html:196–245`; `demo/index.html:267+`. |
| `tool-quiz-hub.html` | `chapterNames` is a hardcoded literal (`"1":"W1 Pervasive Intro", … "8":"W8 Intelligent Systems"`) — the extractor's `chapterNames:\s*\{[\s\S]*?\n {2}\}` regex did not match a single-line literal, so `{{CHAPTER_NAMES}}` was never inserted. | `demo/tools/quiz-hub.html` sets COMP5047 week names while `demo/tools/progress-dashboard.html` gets the generated ones. |
| `tool-knowledge-graph.html`, `tool-math-knowledge-graph.html` | Exactly eight chapter checkboxes (`chkCh1`…`chkCh8`) are hardcoded. A pack with more than eight chapters has no checkbox for the extra weeks (they stay visible but unfilterable, because the code null-checks the missing box). | `grep -c 'id="chkCh' templates/tool-*.html` → `8`, `8`. |

The first two rows mean a generated mind map page and hub home ship **someone else's course
material and week names** — see the ownership section of the top-level `README.md`. None of
these defects is caught by the current test suite (`npm test` passes; see §7).

---

## 4. Module map — `shared/`

### JavaScript

| File | Owns |
|---|---|
| `interactive.js` | The widget library: eight declarative renderers (`stepper`, `sequence`, `matcher`, `timeline`, `hotspot`, `deck`, `race`, `pipeline`), the `[data-ix]` mount scanner, the canvas `ctxKit` helpers, and the `window.Interactive` API (`mount`, `destroy`, `refresh`, `labels`). |
| `chapter-ui.js` | Chapter page chrome: sidebar toggle, scroll-spy active-nav, proof toggles, solution toggles, quick-check grading. `window.ChapterUI.init()`. |
| `chapter-common.js` | Legacy all-in-one chapter script (KaTeX render, `#progressFill` bar, toggles, tabs, flip cards, hover spotlight). **Not loaded by any generated page** — only the hand-built `5046NLP` hub references it. |
| `progress-tracker.js` | Records chapter progress into `localStorage`: tracked sections, quick checks, quiz scores, tutorial self-checks. Picks its storage key from the URL path (see §5). |
| `progress-dashboard.js` | The Progress Dashboard engine: weighted mastery per chapter, quiz trend chart, activity heatmap, quiz history, flashcard schedule, reset button. Reads `window.DASHBOARD_CONFIG`. |
| `mission-control.js` | The hub-home progress panel: mastery tier, streaks, per-chapter rings, next mission. `window.initMissionControl(config)`. |
| `knowledge-graph.js` | Canvas 2-D force-directed graph: node/edge tuples (object form normalised to the 6-tuple), week filters, difficulty sort, search, threshold slider, click-through to the source anchor. Reads `window.KG_CONFIG`. |
| `mindmap.js` | DOM mind map renderer: recursive expand/collapse tree from `var data = …`, `$…$` inline maths, `label_zh` bilingual labels, node click → `href`. `window.renderMindmap(id, data)`. |
| `flashcards.js` | Flashcards tool engine: chapter filters, card flip UI, SM-2 glue, deck-version invalidation, progress writes. Reads `window.FLASHCARD_CONFIG`. |
| `flashcard-srs.js` | The SM-2 scheduler itself (intervals in ms, quality 0=Again…3=Easy mapped to an internal 0–5 scale). `window.FlashcardSRS`. |
| `quiz-hub.js` | Quiz engine: week/type filters, practice and exam modes, per-question review, missed-question stack, per-week scoring, `quizHistory` writes. Reads `window.QUIZ_CONFIG`. |
| `lang-toggle.js` | The bilingual engine: the four translation strategies, the `lang` attribute and `langchange` event, `window.getLang()` / `window.LangToggle`. Reads `window.LANG_CONFIG`. |
| `root-lang-toggle.js` | The root portal's own EN/中文 switch, self-contained because the portal CSP forbids inline scripts. Storage key `root_lang`. |
| `chat-panel.js` | The bring-your-own-key AI tutor: provider list, key/endpoint/model settings, streaming chat, page-context extraction, image and file attachments, per-page history. |
| `chat-markdown.js` | Markdown → HTML for chat messages plus the DOMPurify sanitisation pass. `window.ChatMarkdown`. |
| `site-reset.js` | Purges all four client-state stores, registers the service worker from a path that survives sub-path hosting, and implements the `?fresh=1` zero-click reset. `window.SiteReset`. |
| `storage.js` | An async `localStorage`-shaped adapter backing onto IndexedDB (`usyd_mastery` v1, object store `kv`) with a `localStorage` mirror. `window.MasteryStorage`. **No page loads this file** — see §5. |
| `katex-loader.js` | Bootstraps KaTeX auto-render once the library has loaded, replacing the inline block that used to be pasted into every chapter page. Used by hand-built hubs, not by the generated templates (which load KaTeX themselves). |
| `scroll-anim.js` | Scroll-triggered reveal animations (`window.__usydScrollAnimInit` guards double-init). Used by hand-built hubs only. |
| `root-portal.js` | Root portal behaviour: the pointer-following spotlight on `.course-card`. Service-worker registration deliberately lives in `site-reset.js` instead. |

### Stylesheets

| File | Owns | Linked by |
|---|---|---|
| `study-base.css` | The whole study-page design system (layout, sections, boxes, tables, quick checks, dark theme). Imports `interactive.css`. | Generated `<hub>/shared/study.css` via `@import` |
| `interactive.css` | Widget chrome: `.ix-*`, pool/slot chips, match columns, race bars, pipeline nodes, hotspot markers. | `study-base.css` |
| `math.css` | Foundations page layout on top of `study.css`. | `chapter-math.html` |
| `mindmap.css` | Full-screen mind map canvas, nodes, connectors, legend. | `chapter-mindmap.html` |
| `home.css` | Hub home: hero, chapter cards, metric strip, pipeline, footer. | `hub-home.html` |
| `quiz-hub.css` | Quiz configuration panel, question cards, results, missed stack. | `tool-quiz-hub.html` |
| `flashcards.css` | Deck configuration, flip card, rating buttons, schedule. | `tool-flashcards.html` |
| `knowledge-graph.css` | Graph toolbar, sliders, tooltip, legend. | both graph tool pages |
| `progress-dashboard.css` | Dashboard stat cards, chapter cards, charts, history table. | `tool-progress-dashboard.html` |
| `chat-panel.css` | The floating chat button, panel, message bubbles, settings drawer. | every generated page |
| `root-portal.css` | The root portal only (`index.html`). | root `index.html` |

---

## 5. Storage model

All learner state is client-side and per-origin. Four layers are involved; three of them are
actually written today.

### Layer 1 — `localStorage`

| Key | Written by | Contents |
|---|---|---|
| `<storageKey>_lang` | `lang-toggle.js` (`LANG_CONFIG.storageKey`), `quiz-hub.js`, `flashcards.js`, `progress-dashboard.js`, `mission-control.js` | `"en"` or `"zh"` |
| `<storageKey>_progress` | `progress-tracker.js` / `quiz-hub.js` / `flashcards.js` / `progress-dashboard.js` | The progress record — see §6 |
| `<storageKey>_flashcards` | `flashcards.js` | `{ v: 1, deckVersion: "<storageKey>-1", cards: { … } }`; discarded when `deckVersion` differs |
| `<storageKey>_quiz_missed_stack` | `quiz-hub.js` | Map of question id → wrong-answer count; a question leaves the stack after two consecutive correct answers |
| `<storageKey>_chat_config` | `chat-panel.js` | `{ endpoint, apiKey, provider, model, visionModel, allowRemote, … }`. The key is derived from the path (`/comp1234/…` → `comp1234_chat_config`) and falls back to plain `chat_config` — a generated hub does **not** get `<storageKey>_chat_config` |
| `chat_history_<base64(pathname)[0:20]>` | `chat-panel.js` | Last 100 messages for that page |
| `root_lang` | `root-lang-toggle.js` | Portal language |
| `studyhub_progress` | `progress-tracker.js` fallback | Progress for any hub whose path is not one of the ten recognised names |

The `<storageKey>_progress` key is not as uniform as it looks: `progress-tracker.js`
**detects** its key from `location.pathname` (`detectProgressTrackerConfig`), and the
detection table knows only the repository's own hubs. `window.PROGRESS_TRACKER_CONFIG` can
override it, but no generated template sets it. For a generated hub whose folder is not a
recognised hub name (the demo included), chapter pages therefore write
`studyhub_progress` while the dashboard and tools read `<storageKey>_progress`. See §8.

### Layer 2 — IndexedDB (present but unused)

`shared/storage.js` opens `usyd_mastery` (version 1, object store `kv`) and mirrors every
`setItem` to both `localStorage` and IndexedDB, preferring IndexedDB on read and migrating
existing `localStorage` values on first miss (`window.MasteryStorage`). It is precached by
the service worker and covered by `tests/test-dom-integration.js`, but **no HTML page in the
repository loads it**, so in practice nothing writes to IndexedDB. `site-reset.js` still
deletes the database if it exists.

### Layer 3 — Cache Storage (service worker)

`sw.js` registers with the cache name `usyd-mastery-v7` and precaches 24 URLs (the portal,
`manifest.webmanifest`, the brand mark, and the CSS/JS in `shared/`). Its fetch handler:

* ignores non-GET requests and requests to `localhost:1234` (the local model server);
* serves `fonts.googleapis.com`, `fonts.gstatic.com` and `cdn.jsdelivr.net` **cache-first**;
* serves same-origin requests **stale-while-revalidate**, falling back to the cached copy
  and then to a plain-text `Offline` 503 response;
* on `activate`, deletes **every** cache on the origin (not just older versions) and
  re-precaches, then claims clients — the comment in `sw.js` says a half-stale cache is
  worse than an empty one.

Registration lives in `shared/site-reset.js`, which every page loads, and resolves `sw.js`
relative to its own script URL so the scope stays correct under a sub-path.

### Layer 4 — the service worker registration

`site-reset.js` also unregisters every registration as part of a purge.

### `?fresh=1` and the reset button

Appending `?fresh=1` to **any** page URL runs a purge before first paint and reloads the
page without the parameter (`handleFreshParam` → `reloadFresh`). This is the fastest way to
reproduce a first-visit experience, and it is how `tests/test-site-reset.js` exercises the
module. `window.SiteReset` exposes `inspect()`, `purgeAll()`, `reloadFresh()`, `register()`,
`keyPatterns` and `dbPatterns`. The dashboard's reset button prefers
`SiteReset.purgeAll()` and falls back to removing just its own two keys when the module is
absent; the confirmation text names all four layers.

What `purgeAll()` removes:

* **localStorage** — every key matching `KEY_PATTERNS`:
  `/^comp\d+_/`, `/^elec\d+_/`, `/^info\d+_/`, `/^root_lang$/`, `/^studyhub_progress$/`,
  `/^custom_progress$/`, `/^srs_/`, `/^chat_config$/`. Foreign keys on the same origin are
  left alone.
* **IndexedDB** — every database matching `/^usyd_mastery$/`.
* **Cache Storage** — every cache returned by `caches.keys()` (unfiltered).
* **Service workers** — every registration.

> A generated hub's `<storageKey>_progress` / `_lang` / `_flashcards` keys match none of the
> `KEY_PATTERNS`, so a purge on a new pack's hub leaves its progress behind. `?fresh=1` still
> clears the caches, the IndexedDB mirror and the worker.

---

## 6. Progress model

### What the tracker records

`progress-tracker.js` runs only on chapter pages (it returns early when the path has no
`chapterN`). Keyed by `ch<chapter number>` inside the progress object:

```js
{
  "ch1": {
    "sections":  { "pack": 1759…, "manifest": 1759… },   // track id -> timestamp, written by an IntersectionObserver
    "quickChecks": 2,                                    // count, in the "simple" tracking mode
    "quizBest": 80,                                      // best percentage for the chapter
    "tutorials": { "sol-ch1-review": true }              // solution id -> "did I understand it"
  },
  "quizHistory": [
    { "date": "2026-10-07", "scope": "Ch1 study", "correct": 4, "total": 5, "pct": 80 }
  ]
}
```

`quizBest` is a maximum, never a latest. `quizHistory` is capped at the last 100 entries.
The tracker also exposes `window._trackQuizScore(correct, total, type)` for other scripts,
and re-binds after a language swap via the configured `contentRefreshEvent`. The quiz hub
appends the same two fields from the tool page, adding a per-week `chBreakdown` object to
each history entry it writes.

### Where the denominators come from

`build-hub.js` counts them from the pages it has **just rendered** (`countManifest`), not
from the pack, and writes `<hub>/data/chapter-manifest.js`:

```js
window.CHAPTER_MANIFEST = {
  sections:  { 1: 16,  2: 15,  3: 14 },
  checks:    { 1: 2,  2: 2,  3: 2 },
  tutorials: { 1: 2,  2: 2,  3: 2 }
};
```

| Field | Counted as | Why that is the denominator |
|---|---|---|
| `sections` | occurrences of `data-track="` across the chapter's study **and** foundations pages | the chapter-page tracker records every tracked section it scrolls past, on either page |
| `checks` | occurrences of `class="quick-check"` | one per quick-check block |
| `tutorials` | occurrences of `class="solution-toggle"` | one per reveal the learner can mark as understood |

The generator prints the section counts at the end of a build
(`sections per chapter: 16, 15, 14`), so a changed denominator is visible in the build log,
and `tests/test-generator.js` recomputes the study + foundations `data-track` total and
compares it with the manifest.

### The weighted dimensions

`progress-dashboard.js` scores each chapter as a weighted mean over four dimensions
(`weightedChapterPct`, line 189), with defaults
`{ sections: 0.20, qc: 0.25, quiz: 0.25, tutorials: 0.30 }` (`DASHBOARD_CONFIG.weights`
overrides them):

| Dimension | Numerator | Denominator |
|---|---|---|
| Sections read | `Object.keys(chN.sections).length` | `CHAPTER_MANIFEST.sections[N]` |
| Quick checks | `chN.quickChecks` | `CHAPTER_MANIFEST.checks[N]` |
| Quiz | `chN.quizBest` | `100` (a percentage, so it always participates) |
| Tutorials self-checked | count of `true` values in `chN.tutorials` | `CHAPTER_MANIFEST.tutorials[N]` |

Dimensions whose denominator is zero are **dropped and the remaining weights renormalised**
(`weightSum > 0 ? acc / weightSum : 0`), so a chapter with no solution toggles can still
reach 100 %. `mission-control.js` reads the same `CHAPTER_MANIFEST` for its per-chapter
rings, and `progress-dashboard.js` accepts `totalSections` / `totalQC` / `totalTutorials`
overrides for hubs whose denominators come from somewhere else.

The dashboard does not currently run on a generated hub: the template supplies
`chapterNames` but not `chapterColors`, which the engine lists as required and dereferences
directly (`var col = CHCOLORS[c];`). Loading `demo/tools/progress-dashboard.html` throws
`TypeError: Cannot read properties of undefined (reading '1')` before the chapter grid is
drawn, leaving it empty. See §8.

---

## 7. Testing

No framework: each file is a Node script with a local `test(name, fn)` helper that counts
passes and exits non-zero on the first failure count. `jsdom` is the only dev dependency
that matters at runtime.

| File | Covers | Run |
|---|---|---|
| `tests/test-pure-functions.js` | SM-2 scheduling maths, `chapterPercent`, weighted-percentage renormalisation, streak calculation, answer recording | `npm run test:unit` |
| `tests/test-dom-integration.js` | `MasteryStorage` sync API, `FlashcardSRS` in a DOM, progress-tracker URL detection per hub, quick-check counting, mind map rendering, Mission Control, cross-module storage coexistence | `npm run test:dom` |
| `tests/test-interactive.js` | The widget library: one mount test per declarative type, sequence/matcher/timeline/deck/race/pipeline/hotspot/stepper behaviour, `destroy`, idempotent `mount`, `langchange` refresh, bilingual labels, reduced motion | `npm run test:interactive` |
| `tests/test-hub-structure.js` | The structural contract across **every** hub: pages exist, `data-track` only on study pages and unique there, quick checks + a worked solution per chapter, language injection wired, no `eval`/`new Function`, mind map links resolve, tool pages and data files present, knowledge-graph node normalisation, translated sections introduce no duplicate ids, progress storage wiring | `npm run test:structure` |
| `tests/test-site-reset.js` | `SiteReset.inspect` / `purgeAll` key filtering, missing-API tolerance, `?fresh=1` vs `?fresh=0`, key-pattern coverage, service-worker cache purge, dashboard reset wiring | `npm run test:reset` |
| `tests/test-generator.js` | The generator contract: the demo pack verifies, an invalid pack is refused, two builds are byte-identical, generated markup is balanced, no unfilled tokens, every local reference resolves, the sidebar matches the page's sections, graph data satisfies the engine contract, practice data loads, the manifest matches the pages | `npm run test:generator` |

```bash
npm test            # all six, in the order above (814 assertions currently: 41 + 28 + 23 + 703 + 9 + 10)
npm run ci          # lint + validate + test + shared-copy check
```

`npm run lint` (ESLint) and `npm run format:check` (Prettier) cover `shared/`, `scripts/`,
`tests/`, `sw.js` and the per-chapter scripts. `npm run validate` runs the older
hub-maintenance validators (`validate.js`, `validate-manifest.js`, `verify-graph-data.js`,
`audit-denominators.js`) against the hand-built hubs; `npm run validate:sync` checks that no
hub has re-grown a stale copy of a canonical `shared/` module.

### What the suite does not catch

The current suite passes on the code as it stands, including every defect listed in §8.
Specifically:

* `test-generator.js`'s "structurally balanced" check counts `<div>`/`<section>` tags, so a
  page containing two whole documents (the mind map template) passes.
* No test asserts that a widget config which satisfies `verify-pack.js` actually renders,
  which is why the six gate/renderer mismatches survive.
* `test-hub-structure.js` iterates the ten hand-built hubs; `demo/` is not among them.
* Nothing loads `demo/tools/progress-dashboard.html`, so its `chapterColors` crash is not
  detected.

---

## 8. Known defects and inconsistencies

Everything here was reproduced against the current tree; each row says how.

| # | Defect | Impact | Evidence |
|---|---|---|---|
| 1 | `verify-pack.js`'s `WIDGETS` table disagrees with `shared/interactive.js` for six of eight types: `sequence` needs strings not objects, `matcher` needs `[left,right]` arrays not objects, `hotspot` reads `points` not `hotspots`, `race` reads `rows[].name` not `label`, `pipeline` reads `nodes` not `stages`, and `stepper` reads `frames[].draw` — a function, so no JSON config can ever work. | A pack can be "valid" and still render blank widgets. The demo itself has a blank stepper, hotspot and pipeline. | Loading the generated pages under `jsdom`: `stepper/hotspot/pipeline` hosts have `children=0`; `sequence` chips render `[object Object]`; `matcher` shows no items; `race` bars have empty names. Renderer headers/code: `shared/interactive.js:20–27, 340, 520, 654, 721, 864, 961, 1023`. The ten hand-built hubs side with the renderer: 582/582 matcher pairs are arrays, 494/494 sequence steps are strings, 340/340 race rows use `name`, 52 hotspot configs use `points` and 42 pipeline configs use `nodes`, with no `stepper` anywhere. |
| 2 | `templates/chapter-mindmap.html` emits two full documents, the first carrying stale COMP5047 mind map text; the second `#mindmapCanvas` is never drawn into. | Every generated mind map page contains another course's content and duplicate ids. | `grep -c '<html' demo/chapters/chapter1/web/chapter1-mindmap.html` → 2; generator tests still pass. |
| 3 | `templates/hub-home.html` hardcodes `totalChapters: 8` and a COMP5047 Chinese `translations` block; `templates/tool-quiz-hub.html` hardcodes eight COMP5047 week names. | Hub home and quiz hub display another course's labels. | `demo/index.html:262,267+`; `demo/tools/quiz-hub.html` (`chapterNames: {"1":"W1 Pervasive Intro",…}`). |
| 4 | `progress-dashboard.js` requires `chapterColors` and dereferences it unguarded, but no template sets it. | The Progress Dashboard throws before drawing; the chapter grid stays empty. | Over HTTP in jsdom, `demo/tools/progress-dashboard.html` raises `TypeError: Cannot read properties of undefined (reading '1')` and `#chaptersGrid` has 0 children. |
| 5 | Translation payloads cannot be packaged: `build-hub.js` overwrites `<hub>/shared/translations.js` and `section-translations.js` with one-line stubs on every build and copies nothing from the pack. | Chinese support has to be re-applied after each build by hand. | Generated stubs in `demo/shared/`; `scripts/build-hub.js:656–660`. |
| 6 | `progress-tracker.js` detects its storage key from the URL and knows only the repository's ten hubs; no template sets `PROGRESS_TRACKER_CONFIG`. | On a new pack, chapter sections land in `studyhub_progress` while the dashboard reads `<storageKey>_progress`, so the sections dimension reads 0. | `detectProgressTrackerConfig` fallback `studyhub_progress`; `grep -rn PROGRESS_TRACKER_CONFIG templates/ demo/` finds nothing. |
| 7 | `site-reset.js`'s `KEY_PATTERNS` do not cover a new pack's `<storageKey>_*` keys. | "Reset all progress" leaves that hub's progress, language and SRS state behind. | `shared/site-reset.js:42–51` vs the generated key names. |
| 8 | `templates/tool-*.html` hardcode `../../shared/...` and `hub-home.html` `../shared/...`, so a hub must be a direct child of the repository root. | `--out nested/hub` renders pages whose engine references 404. | Verified by resolving the template paths; the constraint is restated in a comment in `tests/test-generator.js`. |
| 9 | `shared/storage.js` (IndexedDB mirror) and `shared/chapter-common.js` are shipped, precached and tested but loaded by no generated page; `chapter-common.js` is used only by the legacy `5046NLP` hub. | The documented IndexedDB layer does not exist in practice; the chapter sidebar progress bar (`.progress-fill`, `.progress-text`) is never updated on generated pages, because the only code that touches it looks for `#progressFill`/`#progressText` ids that the template does not emit. | `grep -rl storage.js` finds only `sw.js`, `shared/site-reset.js` (comment) and the test; `grep -rn 'progress-fill\|progressFill' shared/` finds only `chapter-common.js:55`. |
| 10 | `course.json.cardClass` is documented in the demo prose but read by no script. | Authors set a value that does nothing. | `grep -rn cardClass scripts/ shared/` finds only the demo's own prose and manifest. |
| 11 | The `resolveHref` comment claims `chapter1/study#x` is accepted; the code only strips a `chapterN-` prefix. | A pack can pass verification and then abort the build. | Building a pack with that href throws `unsupported href "chapter1/study#sec-a" — kind must be study, math or mindmap`. |
| 12 | `chat-panel.js`'s comment above `HISTORY_KEY` describes "a full SHA-1 digest of pathname" with a SubtleCrypto path; the code is `btoa(location.pathname).slice(0, 20)`. | Two pages whose paths share their first 20 base64 characters share a chat history key. Cosmetic, but the comment is wrong. | `shared/chat-panel.js:92–95`. |

---

## 9. Related reading

* [`AUTHORING.md`](AUTHORING.md) — the pack format, the widget catalogue, href resolution,
  theming, translation, and the validator's messages.
* [`../README.md`](../README.md) — what the project is, how to run it, and the content
  ownership rules.
