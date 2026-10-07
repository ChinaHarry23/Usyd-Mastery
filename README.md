# Usyd Mastery

A static, no-build study platform that renders complete course hubs from **content packs**:
plain-text folders holding one manifest, one folder per chapter and one folder of practice
data. Each rendered hub gives a learner interactive widgets, a knowledge graph, quizzes,
spaced-repetition flashcards, bilingual (EN/中文) pages and progress tracking, plus an
optional AI tutor that runs against your own API key.

The engine itself ships **no course content**. You bring a pack; `scripts/build-hub.js`
turns it into a website.

---

## ⚠️ Content ownership — read this first

**This repository ships no third-party course material, and you are responsible for
whatever you add to it.**

* The engine modules, the generator and the demo pack (`content/demo/`) were written for this
  project, and the demo teaches the file format with text written for it.
* `chapters/*/materials/` is **gitignored** — in every hub and in `content/*/chapters/` —
  precisely so that lecture slides, tutorial solutions, textbook chapters, workshop
  notebooks, datasets and past papers cannot be committed by accident. A `.gitkeep` file is
  the only thing tracked inside those folders.
* If you load lecture slides, tutorial solutions, textbook extracts, exam papers, recorded
  lectures, or anything else you did not write, **you** are responsible for having the right
  to use and redistribute it. "It was on the course page" is not a licence. Copyright in
  teaching material normally belongs to the university or the lecturer who wrote it, and
  uploading it to a public repository or a public URL is distribution.
* The engine's knowledge graphs, mind maps, quiz banks and flashcard decks are all *derived*
  from whatever you put in them. If the source material is not yours to reuse, neither is
  the derived data file.
* Keep private course material local. The generated `.gitignore` in every hub already
  ignores `chapters/*/materials/*`; check `git status` before you push, and host the
  result privately if the material is not yours to publish.
* A `.gitignore` only stops *new* additions. If you find material you do not own in a
  repository's **history**, removing the working copy is not enough — it has to come out of
  the history too (`git filter-repo`, BFG) before the repository is public, and any public
  fork or mirror has to be dealt with as well.

The known cases where the shipped page templates still carry text from a real course
(COMP5047) are listed in
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#8-known-defects-and-inconsistencies); they are
defects to be fixed, not a licence to add more.

---

## Quick start

```bash
git clone <this repository> Usyd-Mastery
cd Usyd-Mastery

# 1. Render the demo course (writes demo/)
npm run build:demo

# 2. Serve the repository root over HTTP
python3 -m http.server 8000

# 3. Open the demo hub
open http://localhost:8000/demo/
```

The portal listing every hub is at <http://localhost:8000/>. Open pages through a server,
not `file://`: `localStorage`, the service worker and offline caching all need an `http(s)`
origin.

Requirements: Node 20 or newer for the generator and the tests (CI runs Node 20; verified
on Node 24). `verify-pack.js` and `build-hub.js` use only Node built-ins, so a pack can be
validated and rendered without installing anything. `npm ci` installs `jsdom`, `eslint` and
`prettier`, which the test suite, the linter and the formatter need.

### The demo course

`content/demo/` is a complete, working three-chapter pack — "Building a Study Hub" — that
teaches the pack format by using it: the section contract, the eight widget types and their
strict-JSON rules, then quiz/flashcard/graph data and the practice loop. It is the smallest
complete example of every file a pack can contain, and every chapter of it renders through
the same pipeline your own pack will.

```bash
npm run verify:pack     # the gate: reads content/demo, prints every problem
npm run build:demo      # verify, then render content/demo into demo/
```

### Build your own pack

```bash
mkdir -p content/mypack/chapters/01 content/mypack/data
# … author course.json, chapters/01/{study.html,math.html,mindmap.json},
#    data/{quiz,flashcards,kg,mkg}.json …

node scripts/verify-pack.js content/mypack
node scripts/build-hub.js  content/mypack --out mypack
python3 -m http.server 8000     # then open http://localhost:8000/mypack/
```

The npm scripts are hardwired to `content/demo`; call the two scripts directly for your own
pack, and render it as a direct child of the repository root (`--out` accepts a path, but the
generated pages reference `../shared/` and `../../shared/`). The full format — every
`course.json` key, the section contract, all eight widgets, href resolution, theming and
translation — is in [`docs/AUTHORING.md`](docs/AUTHORING.md).

---

## Features

| Feature | What it does |
|---|---|
| **Study pages** | Sectioned prose with a derived sidebar, scroll-spy navigation and a fixed block vocabulary (definition, theorem, insight, callout, glance grid, comparison table, quick check, hidden solution). |
| **Foundations pages** | A per-chapter reference page with its own table of contents, KaTeX-rendered maths and worked answers. |
| **Interactive widgets** | Eight widget types — stepper, sequence, matcher, timeline, hotspot diagram, flip-card deck, comparison bars, pipeline. Seven are declarative: an empty `div` plus a JSON block, no page JavaScript. The stepper animates canvas frames and is driven from the chapter script. |
| **Knowledge graphs** | Two canvas force-directed graphs per course (concepts, and foundations/notation) with week filters, difficulty sorting, search, a strength threshold and click-through to the source section. |
| **Mind maps** | A per-chapter expand/collapse tree with legend colours, bilingual labels and click-through anchors. |
| **Quiz hub** | Practice and exam modes with week/type filters, per-question review, a missed-question stack that clears after two correct answers, and per-week scoring. |
| **Flashcards** | SM-2 spaced repetition with four-level rating, chapter filters and a review schedule. |
| **Progress tracking** | Per-section, per-quick-check, per-quiz and per-solution progress, weighted into a per-chapter mastery percentage on the Progress Dashboard, plus a Mission Control panel on each hub home. |
| **Bilingual UI** | An EN/中文 toggle that swaps `data-i18n` labels, whole sections and mind map chrome, and sets `lang` for assistive technology. |
| **AI tutor (optional)** | A bring-your-own-key chat panel: LM Studio on `localhost`, or OpenAI, OpenRouter, Groq, xAI, DeepSeek, Gemini, Together, or any OpenAI-compatible endpoint you explicitly allow. It reads the current page as context and can attach images and files. |
| **Offline support** | A service worker precaches the engine, so a hub keeps working offline after the first visit; `?fresh=1` on any URL performs a full client-state reset. |

Not every row works on a freshly generated hub yet. The widget gate/renderer mismatches, the
Progress Dashboard's missing `chapterColors` and the duplicated mind map page are all listed
with evidence in
[`docs/ARCHITECTURE.md` §8](docs/ARCHITECTURE.md#8-known-defects-and-inconsistencies). The
hand-built hubs at the repository root are unaffected by most of them.

## Tech constraints

* **Vanilla JS, no frameworks.** No React, no bundler, no transpiler.
* **No build step for the site.** A hub is static HTML/CSS/JS; the generator is an authoring
  tool that runs ahead of time, not a runtime dependency. You can host the output on GitHub
  Pages, S3, or any static file server.
* **Works offline.** The service worker precaches `shared/`; only KaTeX, Google Fonts and a
  remote AI endpoint need the network.
* **Client-side state only.** Progress, SRS scheduling, language and chat configuration live
  in `localStorage`; no server, no accounts, no telemetry.
* **Deterministic output.** The same pack always renders byte-identical files.
* **Honest about its gaps.** The engine, its known defects and the parts of the pack format
  that disagree with the renderer are all documented; see
  [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#8-known-defects-and-inconsistencies).

## Repository layout

```
Usyd-Mastery/
├── index.html                  Root portal (course selector, EN/中文)
├── brand/                      Logo marks and lockups
├── manifest.webmanifest        PWA manifest
├── sw.js                       Service worker (precache + runtime cache)
├── shared/                     THE ENGINE — vanilla JS modules and stylesheets
│   ├── interactive.js/.css         widget library
│   ├── progress-tracker.js         chapter progress recording
│   ├── progress-dashboard.js/.css  weighted mastery dashboard
│   ├── mission-control.js          hub-home progress panel
│   ├── knowledge-graph.js/.css     canvas graph engine
│   ├── mindmap.js/.css             mind map renderer
│   ├── quiz-hub.js/.css            quiz engine
│   ├── flashcards.js, flashcard-srs.js, flashcards.css
│   ├── lang-toggle.js              bilingual engine (4 strategies)
│   ├── chat-panel.js/.css, chat-markdown.js   BYO-key AI tutor
│   ├── chapter-ui.js               chapter page chrome
│   ├── site-reset.js               purge all client state, register the worker
│   ├── storage.js                  IndexedDB mirror (present, not loaded by any page)
│   └── study-base.css, home.css, math.css, root-portal.css, …
├── scripts/
│   ├── build-hub.js            pack → static hub (the renderer)
│   ├── verify-pack.js          pack contract (the gate)
│   ├── extract-templates.js    templates/*.html from a reference hub
│   ├── merge-translations.js   per-chapter JSON → section-translations.js
│   └── validate*.js, verify-graph-data.js, audit-denominators.js, sync-shared.sh
├── templates/                  Page shells with {{TOKEN}} placeholders
├── tests/                      Six Node test scripts (no framework)
├── content/
│   └── demo/                   A complete example pack (3 chapters)
├── docs/
│   ├── AUTHORING.md            How to build a content pack
│   └── ARCHITECTURE.md         How the engine is put together
├── <hub>/                      Generated or hand-built hubs: index.html, chapters/,
│                               tools/, data/, shared/, materials/
└── …                           COMP5047, COMP5618, ELEC5620, INFO5995, INFO6007,
                                5270RandomAlgo, 5318ML, 5046NLP, 9001Py, 9123DataStructureAlgo
```

A generated hub contains `index.html`, `chapters/chapterN/{web,materials}/`, `tools/`,
`data/`, its own `shared/` (theme, language adapter, translation stubs) and a `.gitignore`
that keeps `chapters/*/materials/*` out of version control. The ten course hubs at the root
follow the same layout but were built by hand before the generator existed; only
`content/demo` is rendered end to end today.

## Documentation

| Document | Contents |
|---|---|
| [`docs/AUTHORING.md`](docs/AUTHORING.md) | The 60-second version, pack layout, every `course.json` key, the section contract, all eight widget types with copy-pasteable examples, `mindmap.json`, practice data, href resolution, theming, translation, and a table of every validator message with its cause and fix. |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | The engine/content/output split, the generation pipeline, the template system and its defects, the module map, the storage model, the progress model, the test suite, and the list of known inconsistencies. |

## Development

```bash
npm ci
npm test                       # 6 suites, 814 assertions
npm run test:generator         # rebuild determinism + output structure
npm run lint                   # ESLint
npm run format:check           # Prettier
npm run validate               # hub data validators
```

## Licence and use

The engine code in this repository is provided for study and reuse. Course material is
**not** included and is **not** covered by any licence granted here — see the content
ownership section above. If you publish a hub built with this engine, that is your
responsibility, not the engine's.
