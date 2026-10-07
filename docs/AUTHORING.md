# Authoring a content pack

A **content pack** is a folder of plain text that the engine renders into a course hub.
Everything a hub shows comes from that folder: `course.json`, one folder per chapter, and
one folder of practice data. `content/demo/` is a complete three-chapter pack and is the
reference for every rule below.

Two scripts define the contract:

| Script | Role |
|---|---|
| `scripts/verify-pack.js` | The **gate**. Reads the pack, prints every problem with file, location and rule, exits 1 on any hard failure. |
| `scripts/build-hub.js` | The **renderer**. Runs the gate first, then writes the hub. Refuses to render a pack that fails the gate unless you pass `--skip-verify`. |

Both scripts use only Node built-ins, so they run before `npm install`. The test suite
needs the dev dependencies (`jsdom`), so run `npm ci` if you want to run `npm test`.

---

## 1. The 60-second version

```bash
# from the repository root
npm run verify:pack     # validate content/demo
npm run build:demo      # render content/demo into demo/
```

Real output — `npm run verify:pack`:

```
verify-pack: content/demo
  chapters 3 · sections 43 · widgets 12 · quiz 18 · cards 15 · nodes 54 · edges 81

Pack is valid. ✓
```

Real output — `npm run build:demo`:

```
verify-pack: content/demo
  chapters 3 · sections 43 · widgets 12 · quiz 18 · cards 15 · nodes 54 · edges 81

Pack is valid. ✓

building DEMO101 (3 chapters) -> demo
wrote 32 files
  sections per chapter: 16, 15, 14

Run: node scripts/verify-pack.js content/demo
```

The hub then lives at `demo/`; open `demo/index.html` through a web server (see
[§12](#12-serving-a-hub)), not from the filesystem — the service worker and
`localStorage` need an `http(s)` origin.

### Pointing at your own pack

The two npm scripts are hardwired to `content/demo`. Extra arguments after `--` are
appended to the hardcoded ones and ignored (`scripts/verify-pack.js` reads `argv[2]`,
which stays `content/demo`). Call the scripts directly instead:

```bash
node scripts/verify-pack.js content/mypack
node scripts/build-hub.js  content/mypack --out mypack
```

| Flag | Effect |
|---|---|
| `--out <dir>` | Output directory, resolved against the repository root. Defaults to the pack's `slug`. |
| `--skip-verify` | Render even when the gate fails. Not recommended: the gate exists because most render failures are authoring failures. |

> **Output location matters.** The templates hardcode the hub's position: a generated hub
> must sit **directly under the repository root**, as a sibling of `shared/`. Chapter pages
> load the engine from `../../../../shared/`, tool pages from `../../shared/`, and the hub
> home from `../shared/`. Building to a nested path such as `out/mypack` produces pages
> whose engine references do not resolve. `tests/test-generator.js` documents the same
> constraint in a comment and builds inside the repository for that reason.

---

## 2. Pack layout

```
content/mypack/
├── course.json                       REQUIRED   the manifest — see §3
├── chapters/
│   └── 01/                           REQUIRED   one folder per chapter, two-digit padded
│       ├── study.html                REQUIRED   study page fragment   (hero first)
│       ├── math.html                 REQUIRED   foundations fragment  (sec-m-hero first)
│       ├── mindmap.json              REQUIRED   mind map tree         — see §6
│       └── study.js                  optional   copied verbatim to chapterN-study.js
└── data/
    ├── quiz.json                     REQUIRED*  quiz bank       — see §7
    ├── flashcards.json               REQUIRED*  SRS deck        — see §7
    ├── kg.json                       REQUIRED*  concept graph   — see §7
    └── mkg.json                      REQUIRED*  foundations graph
```

`*` **Required by the gate, optional to the renderer.** `build-hub.js` tolerates a missing
`data/*.json` (`loadJSON` returns `null`, the quiz deck becomes `[]`), but
`verify-pack.js` calls `json()` on all four paths and reports a missing file as
`invalid JSON — ENOENT: no such file or directory`. A pack with no practice data still
has to ship four files — empty arrays and `{ "nodes": [], "edges": [] }` — and an empty
graph then fails with `foundations graph has no nodes`. In practice: write real data.

Directory rules the gate enforces:

* Chapter folders are `chapters/` + the chapter's `n` padded to two digits
  (`String(n).padStart(2, "0")`). A chapter record whose folder is missing fails with
  `no chapters/NN/ directory`.
* The folder number, not the array index, is the chapter identity. Records are rendered in
  array order, but file paths, page names and `chN` progress keys all use `n`.
* Nothing else in the pack is read. Extra files (notes, drafts, `materials/`) are ignored
  by both scripts.
* The renderer creates an **empty** `chapters/chapterN/materials/` in the *output* (with a
  `.gitkeep`, plus a generated `.gitignore` that ignores everything else in it) so a learner
  can drop their own PDFs next to the pages. Nothing in the pack populates it.

---

## 3. `course.json`

Read by `build-hub.js` (`main()`), gated by `verify-pack.js`. Types are the types the
renderer actually handles; the gate only checks presence and, for `storageKey`, the shape.

| Key | Type | Required | What it affects |
|---|---|---|---|
| `code` | string | **yes** | Page titles (`<title>`, `og:title`), the footer, `data/site-data.js`'s `window.<CODE>_SITE` global, and the `<CODE>_SECTION_TRANSLATIONS` / `<CODE>_LANG` global names. Non-alphanumerics are stripped for global names. |
| `slug` | string | **yes** | Default output directory when `--out` is omitted. |
| `storageKey` | string, `^[a-z0-9]+$` | **yes** | Prefixes every generated storage key: `<storageKey>_lang`, `<storageKey>_progress`, `<storageKey>_flashcards`, and `FLASHCARD_DECK_VERSION = "<storageKey>-1"`. The gate rejects anything else. |
| `title` | string | **yes** | Hub home `<h1>`, `courseName` in `site-data.js`, chapter card metadata. |
| `chapters` | array, non-empty | **yes** | Chapter records, in display order — see below. |
| `term` | string | no | Badge next to the course code on the hub home (`DEMO101 · Demo`). |
| `subtitle` | string | no | Hub home subtitle and the home page's meta description. |
| `icon` | string (HTML entity) | no | Sidebar icon on chapter pages. Default `&#x1F4D8;`. Written into the template raw, so escape it as an entity. |
| `heroImage` | string (URL) | no | `--course-hero-bg` in `shared/study.css` and `--home-hero-image` on the hub home. `"none"` when absent. |
| `heroMetrics` | array of `{ label, value }` | no | The metric strip under the hero, rendered as `<span class="label">` then `<strong>` per entry. |
| `theme` | object | no | CSS custom properties for the whole hub — see §9. |
| `footerNote` | string | no | Footer paragraph. Defaults to a sentence stating that the course author is responsible for the rights to every item they load. |
| `cardClass` | string | **no — unused** | Present in `content/demo/course.json` and described in the demo prose, but no script in `scripts/` or `shared/` reads it. Harmless, but it changes nothing. |

### Chapter records

| Key | Type | Required | What it affects |
|---|---|---|---|
| `n` | number | no | Chapter number. Defaults to the record's 1-based position. Drives folder path, page filenames, card links and `chN` progress keys. |
| `week` | number | no | The word after "Week" in the sidebar label and the home card. Defaults to `n`. |
| `title` | string | no (warning) | Home card heading, page titles, mind map root label fallback. Missing → `no "title" — the hub home card will look thin`. |
| `shortTitle` | string | no | Knowledge-graph week labels (`W1: Structure`) and the pipeline steps on the home page. Falls back to `title`. |
| `summary` | string | no (warning) | Home card body, page meta description, pipeline step text. |
| `status` | string | no | The green tag on the home card. Default `Ready`. |
| `concepts` | array of strings | no | Copied into `data/site-data.js` only; no generated page renders them today. |

Unknown keys are ignored silently. There is no `theme` or `storageKey` per chapter.

---

## 4. Chapter content: the section contract

`study.html` and `math.html` are **fragments**: sections only. The generator supplies
`<!DOCTYPE html>`, `<head>`, `<body>`, the sidebar, the table of contents, the scripts and
the footer. The gate rejects a fragment that contains `<html`, `<head`, `<body`, `<nav` or
`<main` with
`a content fragment must not contain page-level markup`.

### The rules

| # | Rule | Enforced by | Message when broken |
|---|---|---|---|
| 1 | At least one `<section>` | gate | `no <section> blocks — a content page must contain at least a hero` |
| 2 | First section is `id="hero"` in `study.html`, `id="sec-m-hero"` in `math.html` | gate + renderer | `the first section must be id="hero"` |
| 3 | Every section has a unique `id` on the page | gate | `duplicate section id` |
| 4 | Every section has a `data-track`, unique within the page, lowercase, no spaces | gate | `missing data-track — the progress tracker needs it` / `data-track="X" is already used by another section` / `must be lowercase with no spaces` |
| 5 | Every non-hero section contains `<h2 class="section-title">` | gate | `non-hero sections need an <h2 class="section-title"> — the sidebar label comes from it` |
| 6 | No page-level markup inside the fragment | gate | `a content fragment must not contain page-level markup` |
| 7 | Every `id="…"` on the page is unique (sections, widget config blocks, solution bodies) | gate | `duplicate id on the page` |
| 8 | `\(`/`\[` count equals `\)`/`\]` count | gate | `unbalanced KaTeX delimiters: N open vs M close …` |
| 9 | `class="solution-toggle"` count equals `class="solution-body"` count | gate | `N solution-toggle but M solution-body — every reveal needs a body` |
| 10 | Each `.quick-check` has ≥ 2 `.qc-opt` and exactly one `data-correct="true"` | gate | `needs at least two options, found N` / `must have exactly one data-correct="true", found N` |

There is **no** section-count rule. The demo prose recommends six to nine study sections
and five to seven foundations sections; nothing enforces it, and the engine renders any
number.

### How the navigation is derived

You never write navigation. `build-hub.js` re-parses your fragment (`parseSections`,
`scripts/build-hub.js:77`) and:

* the **study** page: one `<li><a href="#<id>" class="nav-link" data-section="<track>">`
  per section, labelled with the section's `<h2 class="section-title">` text, followed by
  fixed links to Foundations, Mind Map, Quiz Hub and Flashcards;
* the **foundations** page: a `toc-link` list in the same order, labelled the same way;
* the **mind map** page: nothing — it is a full-screen canvas.

The label is the heading text with tags stripped and whitespace collapsed (`plain()`), so
`<h2 class="section-title">The <em>content</em> pack</h2>` yields the sidebar label
`The content pack`.

> Sections carrying a `hidden` attribute are skipped when the sidebar is built
> (`if (/\bhidden\b/.test(tag)) continue;`) but are **still counted** in the progress
> denominator, because `countManifest` counts `data-track="` occurrences in the rendered
> HTML. Hiding a section therefore makes 100 % unreachable. Prefer deleting it.

### The `hero` section

* `study.html` — `id="hero"`, typically `class="section hero-section"`, containing
  `<p class="hero-course">`, `<h1>` and `<p class="hero-subtitle">`. The sidebar shows it
  as `Overview` and it is first in the nav list.
* `math.html` — `id="sec-m-hero"`, and its `data-track` is conventionally `m-hero`.

Track names are free-form apart from being lowercase and unique; the demo uses the section
name without the `sec-` prefix (`sec-pack` → `data-track="pack"`). If a section has no
`data-track`, the renderer falls back to the id with a leading `sec-`/`sec-m-` stripped —
but the gate has already failed the pack at that point.

### Content classes

The fragments use a fixed vocabulary styled by `shared/study-base.css` (imported by the
generated `shared/study.css`): `section-title`, `section-lead`, `def-box`, `theorem-box`,
`insight-box`, `callout`, `glance-grid`/`glance-card`, `two-col`, `why-grid`/`why-card`
(with `pro`/`con`), `styled-table`, `badge` (plus `badge-blue` and friends),
`quick-check`/`qc-h`/`qc-question`/`qc-options`/`qc-opt`/`qc-feedback`,
`solution-toggle` + `solution-body`. Quick checks and solution toggles are wired by
`shared/chapter-ui.js`; the quick-check feedback text comes from `data-good`/`data-bad` on
the option, and the solution toggle names its body with `data-target="<id>"`.

### `study.js` (optional)

`chapters/NN/study.js` is copied byte-for-byte to
`chapters/chapterN/web/chapterN-study.js` and referenced from the study page's `<head>`
with `defer`. The gate parses it with `new Function(source)` and fails with
`does not parse — <message>` when it is not valid JavaScript. There is no equivalent hook
for the foundations or mind map pages: the templates have no page-script token there.

Write it only for behaviour the declarative widgets cannot express. `content/demo/chapters/01/study.js`
explains why it is empty; `content/demo/chapters/02/study.js` is a 166-line worked example
(a "config doctor" panel) and `content/demo/chapters/03/study.js` is a two-line stub.

### Examples inside prose

The gate masks `<pre>`, `<code>` and HTML comments before scanning for sections, widgets,
ids and KaTeX delimiters (`maskLiterals`, `scripts/verify-pack.js:68`). You can therefore
paste a widget placeholder and a JSON block inside `<code>` as sample markup without it
being validated — that is how `content/demo/chapters/02/study.html` teaches the widget
catalogue. The masking preserves offsets so the reported positions stay meaningful.

---

## 5. Widgets

A widget is two elements: an **empty placeholder** and a **JSON config block**.

```html
<div data-ix="sequence" data-ix-src="#ix-order"></div>
<script type="application/json" id="ix-order">
{ "title": "Order the review session", "steps": ["first", "second", "third"] }
</script>
```

`shared/interactive.js` scans for `[data-ix]`, resolves `data-ix-src` with
`document.querySelector(src)` (falling back to the placeholder's next sibling when the
attribute is missing), parses the block's text with `JSON.parse`, marks the element
`data-ix-mounted="1"` and calls the renderer for that type.

### The two traps

1. **The JSON is parsed strictly.** No comments, no trailing commas, no single quotes, no
   bare words, no raw newline inside a string value. A block that fails to parse logs
   `[interactive] bad config for` to the console and mounts nothing — the placeholder stays
   an empty box. `verify-pack.js` catches this first with
   `config is not valid JSON — <parser message>`.
2. **A mismatched id is a silent no-op.** `data-ix-src="#typo"` makes
   `document.querySelector` return `null`; the widget never mounts, nothing is logged, and
   the page looks like a styling bug. The gate reports
   `no <script type="application/json"> with that id — the widget will never mount`.
   The `#` is part of the selector: the id must match exactly.

A third silent failure is worth knowing: **an unknown `data-ix` type is ignored without a
warning** (`if (!fn) return;` in `mount`). Only the gate tells you, with
`unknown widget type "wobble" — valid types: stepper, sequence, matcher, timeline, hotspot,
deck, race, pipeline`.

### Required keys — the gate's view

From the `WIDGETS` table in `scripts/verify-pack.js:52`. Every key must be present; an
array-valued key must also be non-empty (`<type> config key "<k>" is an empty array`), and
`max`/`value` must be numbers on the types that declare them.

| `data-ix` | Required keys | Extra gate checks |
|---|---|---|
| `stepper` | `steps`, `max`, `value` | `max` is a number, `value` is a number |
| `sequence` | `steps` | — |
| `matcher` | `pairs` | — |
| `timeline` | `events` | — |
| `hotspot` | `svg`, `hotspots` | — |
| `deck` | `cards` | — |
| `race` | `rows`, `max` | `max` is a number |
| `pipeline` | `stages` | — |

`title` is **not** required by the gate (the demo's own study script treats it as required;
that is the demo's choice, not the engine's).

### What the renderers actually read — and where it disagrees with the gate

`shared/interactive.js` documents its own contract in the header comment (lines 20–27) and
implements it in `TYPES` (line 1141). For six of the eight types the gate requires keys the
renderer never reads, so a config that satisfies `verify-pack.js` can still render an empty
box. This is verified behaviour, not theory — see the reproduction at the end of this
section.

| `data-ix` | Gate demands | Renderer reads | Verdict |
|---|---|---|---|
| `sequence` | `steps` | `steps` as an array of **strings** (each chip is `steps[i]`, rendered as text) | Gate passes, renderer needs strings. Objects render as `[object Object]`. |
| `matcher` | `pairs` | `pairs[i][0]` / `pairs[i][1]` — i.e. **2-element arrays** | Gate passes, renderer needs arrays. `{left, right}` objects render as empty buttons. |
| `timeline` | `events` | `events[].label`, `.title`, `.detail` | Works as documented. |
| `hotspot` | `svg`, `hotspots` | `points[]` (`.x`, `.y`, `.label`, `.detail`), plus `img`/`imgAlt` or `svg` | Gate passes, renderer needs `points`. Without it: empty box. |
| `deck` | `cards` | `cards[].front`, `.back`, optional `.hint` | Works as documented. |
| `race` | `rows`, `max` | `rows[].name` (label), `.value`, optional `.display`; `max` | Gate passes, renderer needs `name`. With `label` the bars draw but their names are blank. |
| `pipeline` | `stages` | `nodes[]` with `.label` and `.note` | Gate passes, renderer needs `nodes`. Without it: empty box. |
| `stepper` | `steps`, `max`, `value` | `frames[]` whose entries carry a **`draw(ctx, w, h, ctxKit)` function**; `height`; `intervalMs` | **No declarative config can work**: JSON cannot carry a function. The renderer returns `null` before drawing anything. |

The examples below are the ones that were built, verified and mounted in a browser
environment (`jsdom` over `http://`): for the seven types that have a working declarative
form they include **both** the gate's keys and the renderer's keys, so they pass
`verify-pack.js` *and* draw. For `stepper`, only the imperative path works, and the example
shows that instead.

The 234 chapter pages in the ten hand-built course hubs all use the renderer's keys: 582
matcher pairs are arrays, 494 sequence steps are strings, 340 race rows carry `name`, 52
hotspot configs are called `points`, 42 pipeline configs are called `nodes`, and not one of
them uses `stepper`. The demo pack is the only place that follows the gate's names, which is
why its stepper, hotspot and pipeline slots are the ones that render nothing.

#### Copy-pasteable examples

**`sequence`** — `steps` is an array of strings:

```html
<div data-ix="sequence" data-ix-src="#ix-order"></div>
<script type="application/json" id="ix-order">
{
  "title": "Order the review session",
  "subtitle": "Drag the steps into the order you would work in.",
  "steps": [
    "Read the section once",
    "Close the notes and recall it",
    "Attempt the quiz",
    "Review only what you missed"
  ]
}
</script>
```

**`matcher`** — `pairs` is an array of `[left, right]` arrays:

```html
<div data-ix="matcher" data-ix-src="#ix-pairs"></div>
<script type="application/json" id="ix-pairs">
{
  "title": "Match the widget to its list key",
  "pairs": [
    ["sequence", "steps, an array of strings"],
    ["matcher", "pairs, an array of [left, right] arrays"],
    ["timeline", "events, an array of records"],
    ["deck", "cards, an array of front/back records"]
  ]
}
</script>
```

**`timeline`** — `events[]`, each with `label` (axis mark), optional `title` (caption
heading) and `detail`:

```html
<div data-ix="timeline" data-ix-src="#ix-stages"></div>
<script type="application/json" id="ix-stages">
{
  "title": "From draft to published chapter",
  "events": [
    { "label": "Draft", "detail": "Every section exists and says something." },
    { "label": "Trim", "detail": "Cut the sections that repeat each other." },
    { "label": "Validate", "detail": "Parse the manifest, the widget JSON and the mind map." }
  ]
}
</script>
```

**`hotspot`** — `svg` plus `points[]`; `hotspots` is the gate's name for the same list, so
ship both. Coordinates are percentages of the drawing box:

```html
<div data-ix="hotspot" data-ix-src="#ix-diagram"></div>
<script type="application/json" id="ix-diagram">
{
  "title": "Anatomy of a chapter page",
  "svg": "<svg viewBox='0 0 200 100' xmlns='http://www.w3.org/2000/svg'><rect width='200' height='100' fill='#111827'/><rect x='8' y='8' width='48' height='84' rx='4' fill='#1f2937'/></svg>",
  "hotspots": [
    { "x": 16, "y": 50, "label": "Sidebar", "detail": "Generated from the section tracks." }
  ],
  "points": [
    { "x": 16, "y": 50, "label": "Sidebar", "detail": "Generated from the section tracks." }
  ]
}
</script>
```

**`deck`** — `cards[]` with `front` and `back` (optional `hint` for the flip affordance).
Inline HTML in `front`/`back` is inserted, so keep it to text and simple tags:

```html
<div data-ix="deck" data-ix-src="#ix-cards"></div>
<script type="application/json" id="ix-cards">
{
  "title": "Two facts worth keeping",
  "cards": [
    { "front": "What does data-ix-src point at?", "back": "The id of a script block on the same page, written with a leading #." },
    { "front": "Can a JSON string contain a line break?", "back": "No. Keep each value on one line." }
  ]
}
</script>
```

**`race`** — `rows[]` with `name` (the label the renderer reads), `value`, optional
`display`; `max` fixes the scale:

```html
<div data-ix="race" data-ix-src="#ix-race"></div>
<script type="application/json" id="ix-race">
{
  "title": "Where the authoring minutes went",
  "max": 120,
  "rows": [
    { "name": "Writing prose", "value": 120, "display": "120 min" },
    { "name": "Tuning widget configs", "value": 45, "display": "45 min" }
  ]
}
</script>
```

**`pipeline`** — `nodes[]` with `label` and `note`; `stages` is the gate's name, so ship
both lists:

```html
<div data-ix="pipeline" data-ix-src="#ix-flow"></div>
<script type="application/json" id="ix-flow">
{
  "title": "From request to mounted widget",
  "stages": [
    { "label": "Fetch the fragment", "detail": "The generator wraps the fragment in the page shell." }
  ],
  "nodes": [
    { "label": "Fetch the fragment", "note": "The generator wraps the fragment in the page shell." }
  ]
}
</script>
```

**`stepper`** — not expressible in JSON. The gate's config passes verification and renders
an empty box. Use the imperative API from `chapters/NN/study.js`, which the study page
loads as a deferred script after `interactive.js`:

```html
<section id="sec-stepper" class="section" data-track="stepper">
  <h2 class="section-title">Stepper</h2>
  <div id="ix-step-host"></div>
</section>
```

```js
/* chapters/NN/study.js */
window.Interactive.stepper("ix-step-host", {
  title: "How complete is your chapter?",
  height: 220,
  frames: [
    { title: "Empty folder", caption: "0 of 6 steps",
      draw: function (ctx, w, h, c) { c.clear(); c.bar(24, 60, w - 48, 16, 0, {}); c.label(24, 40, "0 of 6"); } },
    { title: "Registered in the manifest", caption: "1 of 6 steps",
      draw: function (ctx, w, h, c) { c.clear(); c.bar(24, 60, w - 48, 16, 1 / 6, {}); c.label(24, 40, "1 of 6"); } }
  ]
});
```

`draw(ctx, w, h, ctxKit)` receives a 2-D context and a helper kit with `clear(fill)`,
`box(x, y, w, h, opts)`, `label(x, y, text, opts)`, `dot(x, y, r, opts)`,
`bar(x, y, w, h, value, opts)`, `arrow(x1, y1, x2, y2, opts)`,
`highlight(x, y, w, h, opts)` and `code(x, y, lines, opts)`. The returned object exposes
`go(i)`, `play()`, `pause()`. `window.Interactive` also exposes every declarative renderer,
`mount(root)`, `destroy(elOrId)`, `refresh()`, `labels` and `reducedMotion`.

### Shared config keys

Every renderer builds its frame through `shell(host, cfg)`, so these work on all eight
types: `title` (rendered as `<h3>`), `subtitle` (rendered as a paragraph) and `badge` (a
small pill). `sequence` also reads `seed` (default `7`, used for its deterministic
shuffle), and `stepper`/`pipeline` read `intervalMs` for autoplay pacing. Any key ending in
`Zh` is used instead of its English twin when the page language is Chinese
(`pick(obj, base)` checks `<base>Zh`, then `window.IX_ZH`).

Widgets re-render their own chrome on the `langchange` event, but their **config text is
not re-read**; a widget whose labels come from the config needs a `langchange` listener
that calls `Interactive.destroy(el)` followed by `Interactive.mount(el)` if you translate
it at runtime.

### Reproducing the mismatch

Any pack containing the gate-shaped `stepper`, `hotspot` or `pipeline` configs passes
`verify-pack.js` and produces empty placeholders. The quickest check is the demo hub
itself:

```bash
npm run build:demo
grep -c 'data-ix="pipeline"' demo/chapters/chapter1/web/chapter1-math.html   # 1
```

then load `demo/chapters/chapter2/web/chapter2-study.html` and observe that the stepper,
hotspot and pipeline slots are blank while the deck, matcher, race and timeline slots
render. Loading the same page with `jsdom` and reading `element.children.length` for each
`[data-ix]` host shows `stepper=0, hotspot=0, pipeline=0` and non-zero for the rest.

---

## 6. `mindmap.json`

One file per chapter, at `chapters/NN/mindmap.json`. The generator reads `legend` and
`data`, rewrites every `href` through `resolveHref`, and inlines the result into the
generated mind map page as `var data = { … };`.

```json
{
  "legend": [
    { "color": "accent", "label": "The pack on disk" },
    { "color": "blue",   "label": "Section contract" }
  ],
  "data": {
    "label": "Week 1: Content and Structure",
    "children": [
      {
        "label": "The content pack",
        "color": "accent",
        "href": "study.html#sec-pack",
        "children": [
          { "label": "One folder holds the whole course", "href": "study.html#sec-pack" }
        ]
      }
    ]
  }
}
```

| Field | Type | Rules |
|---|---|---|
| `legend` | array of `{ color, label }` | Optional. `color` must be one of `accent`, `blue`, `green`, `purple`, `yellow`, `orange`, `cyan`; anything else fails with `legend[i] colour "X" is not one of …`. The legend renders as `<span class="dot" style="background:var(--<color>)">`, so it also depends on the theme defining that variable. |
| `data` | object | The tree root: `label`, optional `label_zh`, optional `color`, optional `href`, optional `children[]`. |
| `data.children` | array | Top-level branches. Fewer than two fails (`needs at least two top-level branches`); more than six warns (`N branches — the canvas gets crowded`). |
| `*.href` | string | Must contain `#` on any node the gate walks (`leaf "X" href has no #anchor`). Rewritten by `resolveHref` before it reaches the page. |
| `*.color` | string | One of the seven legend colours. The renderer adds the class `c-<color>`; without it the node inherits the parent's colour. |
| `*.label_zh` | string | Chinese label, applied on `langchange` (the renderer keeps the English text in `label_zh || labelEn` pairs). Labels also support `$…$` inline maths. |

The gate walks only three levels below the root (`walk(node, d)` stops recursing once
`d` reaches 3), so a deeper node's `href` is not checked — but it is still rewritten and
still navigated to on click, so keep every anchor valid.

Navigation: clicking a node sets `window.location.href` to its resolved `href`; a modified
click (ctrl/cmd/middle) opens it in a new tab. `href` is the only navigational field — a
node without one is inert.

---

## 7. Practice data

All four files are read by the gate; the renderer inlines the first two verbatim.

### `data/quiz.json`

An array of entries consumed by `tools/quiz-hub.html` (`window.ALL_QUIZ_DATA`) and
`shared/quiz-hub.js`.

| Field | Type | Gate rule |
|---|---|---|
| `q` | string | required (`missing q`); must be unique (`duplicate question text`) |
| `opts` | array of 4 strings | exactly four, all distinct (`needs exactly 4 options`, `options are not unique`) |
| `answer` | integer 0–3 | 0-based index into `opts` (`answer must be a 0-based index 0-3, found …`) |
| `exp` | string | required — "the explanation is the teaching moment" (`missing exp`) |
| `type` | `"study"` or `"math"` | required (`type must be "study" or "math"`) |
| `ch` | number | **not checked by the gate**, but the quiz hub filters and buckets on `q.ch`: without it every question lands in chapter `undefined` and is filtered out of every week selection. Always set it. |

`quiz-hub.js` assigns a runtime `id` to each entry that lacks one. Answers and per-week
totals are appended to `<storageKey>_progress` under `quizHistory` and `chN.quizBest`.

### `data/flashcards.json`

An array of cards for `tools/flashcards.html` (`window.ALL_FLASHCARD_DATA`) and
`shared/flashcards.js` (SM-2 scheduling).

| Field | Type | Gate rule |
|---|---|---|
| `front` | string | required, unique (`missing front`, `duplicate front`) |
| `back` | string | required (`missing back`) |
| `ch` | number ≥ 1 | required (`missing chapter number`) |
| `front_zh`, `back_zh` | string | optional Chinese twins, used when the language is Chinese |

The generated `data/flashcard-data.js` also declares
`FLASHCARD_DECK_VERSION = "<storageKey>-1"`. The suffix is hardcoded to `-1`, so **a
rebuild never resets a learner's SRS state**; `flashcards.js` discards stored state only
when the stored `deckVersion` differs. Changing it means editing a generated file, which
the next build overwrites.

### `data/kg.json` and `data/mkg.json`

Both files share one shape: `{ "nodes": [...], "edges": [...] }`. `kg.json` feeds the
Knowledge Graph (`tools/knowledge-graph.html`), `mkg.json` feeds the Foundations Graph
(`tools/math-knowledge-graph.html`).

**Node tuple — exactly six elements, in order:**

```json
["demo-pack", 1, 1, "Content pack", "One folder holding the manifest and the chapter tree.", "study.html#sec-pack"]
```

| Index | Meaning | Gate rule |
|---|---|---|
| 0 | node id (unique) | `duplicate node id` |
| 1 | chapter number | must be ≥ 1 (`chapter must be a positive number`) |
| 2 | difficulty, 1–3 | `difficulty must be 1-3, found N` |
| 3 | label | required (`missing label`) |
| 4 | definition / tooltip | required (`missing definition`) |
| 5 | href | must be an absolute URL or contain `#` (`href "…" has no #anchor — a node must point at a section`) |

Fewer than six elements fails with
`expected [id, chapter, difficulty, label, definition, href]`. Extra elements are ignored.

**Edge tuple — `[fromId, toId, strength]`:**

```json
["demo-pack", "demo-manifest", 8]
```

> ### The third element is a strength from 4 to 9 — never a chapter number
>
> ```json
> ["a", "b", 8]   ← 8 is "how strongly these two concepts are related"
> ["a", "b", 2]   ← invalid: the graph would never draw it
> ```
>
> The graph renders an edge only when `strength >= threshold`
> (`shared/knowledge-graph.js:171`), and the threshold slider ships with
> `min="1" max="10" value="3"` — so the default view hides anything below 3, and 1 or 2 are
> effectively invisible. The gate enforces `4 <= strength <= 9` and says so:
>
> ```
> strength 3 is outside 4-9. Strength is not a chapter number: the graph hides anything
> below the threshold (default 3), so 1 and 2 never draw.
> ```
>
> Chapter membership comes from the **node's** second element, not from the edge.

Other edge rules: both endpoints must exist (`unknown from-node "x"` / `unknown to-node "x"`),
no self-loops (`self-loop on a`), no duplicate directed pair (`duplicate edge a>b`), and a
missing strength fails with `expected [fromId, toId, strength]`.

Two ratio warnings, both advisory: below
`edge/node ratio is X — a sparse graph reads as disconnected` (ratio < 1.1) and above
`— a dense graph becomes unreadable` (ratio > 3).

---

## 8. Hrefs

Packs address pages **logically**; the generator resolves every link for its consumer.
`resolveHref(href, defaultChapter, opts)` (`scripts/build-hub.js:107`) is applied to mind
map node links (consumer: the chapter page, chapter defaulting to the file's own chapter)
and to graph node links (consumer: a tool page, chapter defaulting to the node's own
chapter field).

Accepted forms, with the emitted result for a chapter-1 mind map and for a graph node
(verified by building a one-chapter pack per form):

| Written in the pack | Mind map emits | Graph emits |
|---|---|---|
| `study.html#sec-a` | `chapter1-study.html#sec-a` | `../chapters/chapter1/web/chapter1-study.html#sec-a` |
| `math.html#sec-m-a` | `chapter1-math.html#sec-m-a` | `../chapters/chapter1/web/chapter1-math.html#sec-m-a` |
| `mindmap.html#sec-a` | `chapter1-mindmap.html#sec-a` | `../chapters/chapter1/web/chapter1-mindmap.html#sec-a` |
| `study#sec-a` (kind without `.html`) | `chapter1-study.html#sec-a` | `../chapters/chapter1/web/chapter1-study.html#sec-a` |
| `01/study.html#sec-a` | `chapter1-study.html#sec-a` | `../chapters/chapter1/web/chapter1-study.html#sec-a` |
| `02/math.html#sec-m-a` | `chapter2-math.html#sec-m-a` | `../chapters/chapter2/web/chapter2-math.html#sec-m-a` |
| `chapters/02/study.html#sec-a` | `chapter2-study.html#sec-a` | `../chapters/chapter2/web/chapter2-study.html#sec-a` |
| `../chapters/02/math.html#sec-m-a` | `chapter2-math.html#sec-m-a` | `../chapters/chapter2/web/chapter2-math.html#sec-m-a` |
| `https://example.com/x#y` | unchanged | unchanged |

Rules, in the order the function applies them:

1. A value matching `^[a-z]+://` is returned untouched (no rewriting, no validation).
2. Leading `../` sequences are stripped, then a leading `chapters/` is stripped.
3. The fragment (everything from `#`) is split off and re-attached unchanged.
4. A leading `<digits>/` sets the chapter; otherwise the default chapter is used. The
   number is **not** validated against the pack's chapter list — `03/study.html#x` in a
   two-chapter pack silently resolves to a page that does not exist.
5. The remaining "kind" is the path with a trailing `.html` removed and a leading
   `chapter<digits>-` removed. It must be `study`, `math` or `mindmap`, or the build throws
   `unsupported href "…" — kind must be study, math or mindmap`.

> **The comment in `scripts/build-hub.js:99–105` overstates the accepted forms.** It lists
> `chapter1/study#sec-x` as equivalent to `study.html#sec-x`. It is not: step 5 only strips
> a `chapter<digits>-` *prefix*, so `chapter1/study`, `chapter1/study.html` and
> `chapter2/math` all fail the kind check and abort the build. Use `01/study.html#x`,
> `study.html#x` or `study#x` instead.
>
> Note also that this failure happens at **build** time, after the gate has already said
> "Pack is valid": the validator does not check mind map `href` kinds. An unsupported form
> therefore costs you a build, not a validation error.

---

## 9. Theming

`course.json.theme` is merged over `DEFAULT_THEME` (`scripts/build-hub.js:140`) and written
to `<hub>/shared/study.css` as CSS custom properties. Every key is a string; `accent`,
`accentStrong`, `darkBg`, `darkBg2` and `grid` are parsed by `hexToRgb`, so they must be
3- or 6-digit hex (`#6366f1`) — anything else silently yields `NaN` channel values.
`border` may be `rgba(...)` or hex; for the `--border-rgb` variable an `rgba()`/`rgb()`
value is replaced by `#6366f1`.

| Key | Default | Used for |
|---|---|---|
| `bg` | `#f7f8fc` | `--bg` page background |
| `card` | `rgba(255,255,255,0.86)` | `--bg-card` |
| `cardHover` | `rgba(255,255,255,0.97)` | `--bg-card-hover` |
| `sidebar` | `rgba(18,20,38,0.88)` | `--bg-sidebar` |
| `border` | `rgba(99,102,241,0.16)` | `--border`, and `--border-rgb` |
| `text` | `#141826` | `--text`, `--section-title-dark` |
| `textMuted` | `#565d75` | `--text-muted` |
| `textDim` | `#7b829a` | `--text-dim` |
| `accent` | `#6366f1` | `--accent`, glows, hero highlight, chip background |
| `accentStrong` | `#4f46e5` | `--accent-strong`, card shadows |
| `blue`, `purple`, `green`, `yellow`, `red` | `#2563eb`, `#7c3aed`, `#059669`, `#f59e0b`, `#dc2626` | status colours; the mind map `legend[].color` values map onto these names plus `orange` and `cyan` |
| `darkBg` | `#12142a` | `--dark-bg`, shadow colour |
| `darkBg2` | `#1e2148` | `--dark-bg-2` |
| `lightBg` | `#fbfbfe` | `--light-bg-1` |
| `grid` | `#d8d8e0` | `--grid-line-rgb` |

The generator writes exactly three other variables from the pack: `--course-hero-bg`
(`url("<heroImage>")`, or `none`), `--course-divider-display: none`, and
`--home-hero-image` on the hub home. `study.css` starts with two `@import`s — Google Fonts
and `../../shared/study-base.css` — so it is a thin theme layer over the engine stylesheet,
not a replacement for it.

---

## 10. Translation

The generated `<hub>/shared/lang-config.js` sets `window.LANG_CONFIG` before
`shared/lang-toggle.js` loads, reading whatever the pack's translation files happen to
define:

```js
window.LANG_CONFIG = {
  storageKey: "<storageKey>_lang",
  translations:        hasTranslations ? T : undefined,          // COMMON + CH[chapter]
  sectionTranslations: typeof <CODE>_SECTION_TRANSLATIONS !== "undefined" ? … : undefined,
  mindmapTranslations: typeof MINDMAP_UI !== "undefined" ? MINDMAP_UI : undefined
};
```

`shared/lang-toggle.js` supports four strategies, all optional:

| Strategy | `LANG_CONFIG` key | Shape | Consumed by |
|---|---|---|---|
| 1. Attribute swap | `translations` | `{ "<data-i18n value>": "<html>" }`, merged from the pack's `COMMON` plus `CH[<chapter number>]` | `[data-i18n]` elements on any page |
| 2. Selector arrays | `selectorTranslations` | `[[{ s: "<css selector>", i: <index>, t: "<html>" }, …], …]` | legacy 5270 hubs only |
| 3. Whole-section replace | `sectionTranslations` | `{ "<page filename>": { "title": "…", "sections": { "<section id>": "<html>" } } }` | chapter pages, keyed by filename (`chapter1-study.html`) |
| 4. Mind map chrome | `mindmapTranslations` | `{ "<chapter number>": { title, study, math, home, … } }` | mind map pages only (`body.mm-page`) |

Widget labels rendered from JavaScript are translated through `window.IX_ZH`, an
English→Chinese lookup table that `shared/interactive.js` consults via `pick()`.

> **The generator emits stubs, not translations.** `build-hub.js` writes
> `<hub>/shared/translations.js` and `<hub>/shared/section-translations.js` with a one-line
> comment each, and copies **nothing** from the pack. There is no `translations` directory
> in the pack format. So today, adding Chinese to a generated hub means editing those two
> generated files after the build — and the next `build-hub.js` run overwrites them.

### Worked example to copy

`COMP5047/` is the reference implementation of the same four strategies; read it rather
than inventing a layout:

| File | What it shows |
|---|---|
| `COMP5047/shared/translations.js` | `var COMMON = { nav_home: "&larr; 课程主页", … }`, `var CH = {}`, `var MINDMAP_UI = {}`, and `window.IX_ZH = { "<english string>": "<chinese>" }` for widget labels |
| `COMP5047/shared/section-translations.js` | `window.COMP5047_SECTION_TRANSLATIONS = { "chapter1-study.html": { title, sections: { "sec-…": "<translated html>" } }, … }` |
| `COMP5047/shared/translations-data/chapterN.json` | The per-chapter sources that `scripts/merge-translations.js` merges into the file above |
| `COMP5047/shared/lang-config.js` | A hand-written adapter equivalent to the generated one |

`node scripts/merge-translations.js <courseDir>` rebuilds
`<courseDir>/shared/section-translations.js` from
`<courseDir>/shared/translations-data/*.json`. Two caveats for generated hubs: it derives
the global name from the **directory** name (`5046NLP` → `COMP5046_SECTION_TRANSLATIONS`)
while the generator derives it from `course.json.code` (non-alphanumerics stripped), so the
two must agree for the wiring to work; and it writes into the generated `shared/` folder,
which the next build overwrites.

---

## 11. Common errors

### Hard failures (`verify-pack.js` exits 1)

| Message (as printed) | Cause | Fix |
|---|---|---|
| `course.json: invalid JSON — <e>` | Malformed manifest | Fix the JSON; the parser message gives the position |
| `course.json: missing required key "code"` (also `slug`, `storageKey`, `title`, `chapters`) | A required top-level key is absent or empty | Add it — see §3 |
| `course.json: chapters must be a non-empty array` | `chapters` is missing, `[]`, or not an array | List at least one chapter record |
| `course.json: storageKey must be lowercase alphanumeric (it prefixes every localStorage key)` | `storageKey` contains `-`, `_`, uppercase or spaces | Use `^[a-z0-9]+$`, e.g. `demo101` |
| `course.json [chapter N]: no chapters/NN/ directory` | Folder missing or numbered differently | Create `chapters/NN/` with the two-digit number |
| `chapters/NN [study.html]: missing` / `[math.html]: missing` | Required fragment absent | Add the file |
| `chapters/NN [mindmap.json]: missing` | Required mind map absent | Add the file |
| `<file>: no <section> blocks — a content page must contain at least a hero` | The fragment has no `<section>` at all | Wrap the content in sections |
| `<file> [<id>]: the first section must be id="hero"` (or `"sec-m-hero"`) | Wrong first section id, or a wrapper element before it | Rename the first section's id |
| `<file> [<id>]: duplicate section id` | Two sections share an id | Make ids unique |
| `<file> [<id>]: missing data-track — the progress tracker needs it` | Section lacks `data-track` | Add a lowercase, space-free track |
| `<file> [<id>]: data-track="X" is already used by another section` | Two sections share a track | Give each section its own track |
| `<file> [<id>]: data-track="X" must be lowercase with no spaces` | Mixed case or whitespace | Lowercase it |
| `<file> [<id>]: non-hero sections need an <h2 class="section-title"> …` | Heading missing, or the class is misspelled/absent | Add `<h2 class="section-title">` |
| `<file> [<id>]: a content fragment must not contain page-level markup` | `<html>`, `<head>`, `<body>`, `<nav>` or `<main>` inside the fragment | Delete it — the shell supplies it |
| `<file> [quick-check N]: needs at least two options, found M` | Fewer than two `.qc-opt` elements | Add options |
| `<file> [quick-check N]: must have exactly one data-correct="true", found M` | Zero or several correct options | Mark exactly one |
| `<file> [<id>]: unknown widget type "X" — valid types: stepper, sequence, …` | `data-ix` typo | Use one of the eight names |
| `<file> [<id>]: no <script type="application/json"> with that id — the widget will never mount` | `data-ix-src` does not match any config block | Make the ids identical, `#` included |
| `<file> [<id>]: config is not valid JSON — <e>` | Trailing comma, comment, single quotes, raw newline in a string | Fix the block; the position is in the message |
| `<file> [<id>]: <type> config is missing required key "k"` | Key absent | Add it (§5 table) |
| `<file> [<id>]: <type> config key "k" is an empty array` | `[]` for a list key | Supply at least one entry |
| `<file> [<id>]: race "max" must be a number` / `stepper "value" must be a number` | Numeric key quoted | Remove the quotes |
| `<file> [<id>]: duplicate id on the page` | Any repeated `id="…"` — sections, config blocks, solution bodies | Rename one |
| `<file>: unbalanced KaTeX delimiters: N open vs M close …` | Stray `\(`, `\[`, `\)` or `\]` | Balance the delimiters |
| `<file>: N solution-toggle but M solution-body — every reveal needs a body` | A toggle without a body, or vice versa | Pair them |
| `chapters/NN [study.js]: does not parse — <e>` | Syntax error in the optional chapter script | Fix the JS |
| `mindmap.json [chapter N]: legend[i] colour "X" is not one of accent, blue, green, purple, yellow, orange, cyan` | Colour outside the allowed set | Use a listed colour |
| `mindmap.json [chapter N]: needs at least two top-level branches` | `data.children` has fewer than two entries | Add branches |
| `mindmap.json [chapter N]: leaf "L" href has no #anchor` | Node link without a fragment | Add `#<section-id>` |
| `data/kg.json [id]: duplicate node id` / `missing label` / `missing definition` | Node tuple problems | Fix the tuple |
| `data/kg.json [id]: chapter must be a positive number` | Second element is 0/NaN | Use 1…N |
| `data/kg.json [id]: difficulty must be 1-3, found N` | Difficulty outside 1–3 | Use 1, 2 or 3 |
| `data/kg.json [id]: href "X" has no #anchor — a node must point at a section` | No fragment, and not an absolute URL | Add the anchor |
| `data/kg.json [node M]: expected [id, chapter, difficulty, label, definition, href]` | Fewer than six elements | Supply all six |
| `data/kg.json [edge M]: unknown from-node "x"` / `unknown to-node "x"` | Endpoint not in `nodes` | Fix the id |
| `data/kg.json [edge M]: self-loop on a` | Both endpoints identical | Remove it |
| `data/kg.json [edge M]: duplicate edge a>b` | Same directed pair twice | Remove the duplicate |
| `data/kg.json [edge M]: expected [fromId, toId, strength]` | Fewer than three elements | Supply the strength |
| `data/kg.json [edge M]: strength N is outside 4-9. Strength is not a chapter number …` | Third element is a chapter number, or below 4 / above 9 | Use 4–9 (§7) |
| `data/mkg.json: foundations graph has no nodes` | Empty `nodes` array | Populate it |
| `data/quiz.json: must be an array` | Wrapped in an object | Use a top-level array |
| `data/quiz.json [entry N]: missing q` / `missing exp` | Required text absent | Add it |
| `data/quiz.json [entry N]: needs exactly 4 options` | Not four options | Supply four |
| `data/quiz.json [entry N]: options are not unique` | Duplicate option text | Make them distinct |
| `data/quiz.json [entry N]: answer must be a 0-based index 0-3, found X` | 1-based index, string, or out of range | Use `0`–`3` |
| `data/quiz.json [entry N]: duplicate question text` | Same `q` twice | Rewrite or remove |
| `data/quiz.json [entry N]: type must be "study" or "math"` | Anything else | Use one of the two |
| `data/flashcards.json [card N]: missing front` / `missing back` / `missing chapter number` | Required field absent (`ch` ≥ 1) | Add it |
| `data/flashcards.json [card N]: duplicate front` | Same front twice | Make it unique |
| `data/*.json: invalid JSON — ENOENT: no such file or directory` | The file does not exist; the gate treats all four data files as required | Create it (§7) |

### Warnings (the pack still builds)

| Warning | Meaning |
|---|---|
| `course.json [chapter N]: no "title" — the hub home card will look thin` | Chapter record lacks `title` (same for `summary`) |
| `<file>: contains a bare & — escape it as &amp;` | An `&` that is not part of a known entity |
| `mindmap.json [chapter N]: N branches — the canvas gets crowded` | More than six top-level branches |
| `data/kg.json: edge/node ratio is X — a sparse graph reads as disconnected` | Ratio < 1.1 |
| `data/kg.json: edge/node ratio is X — a dense graph becomes unreadable` | Ratio > 3 |

### Build-time errors (after a clean validation)

| Message | Cause |
|---|---|
| `unsupported href "X" — kind must be study, math or mindmap` | An href form `resolveHref` does not accept, e.g. `chapter1/study#x` (§8) |
| `course.json is missing required key: X` | `build-hub.js` re-checks the five required keys and throws instead of printing a report |
| `no course.json in <dir>` | Wrong pack path |
| `chapter N: study.html has no <section> blocks` / `the first section must have id="hero"` | The renderer re-checks the hero rule |
| `kg.json: edge a -> b has strength N. Strength is 4-9, not a chapter number …` | The renderer re-checks edge strength |
| `usage: node scripts/build-hub.js <content-pack-dir> [--out <dir>]` | No pack argument |
| `build-hub: the content pack failed verification. …` | The gate failed and `--skip-verify` was not passed |

---

## 12. Serving a hub

Any static server works; the engine needs `http(s)` for `localStorage` and the service
worker:

```bash
python3 -m http.server 8000          # from the repository root
# then open http://localhost:8000/mypack/
```

`file://` mostly works for reading a chapter page, but progress, language choice, SRS state
and offline caching are disabled, and the service worker never registers.

---

## 13. Known gaps an author should know about

These are real behaviours of the current code, verified but not yet fixed. The generator
and the gate agree on most things; where they do not, this list says which one to trust.

1. **Six of the eight widget types disagree between the gate and the renderer** — see the
   table in §5. Trust `shared/interactive.js` for anything that must draw; keep the gate's
   keys alongside it so the pack still validates. `stepper` has no working declarative form.
2. **`href` forms** — the accepted set is narrower than the comment in `build-hub.js`
   claims (§8).
3. **Hidden sections** still count towards the progress denominator (§4).
4. **`cardClass`** in `course.json` is read by nothing (§3).
5. **Translations** cannot be shipped in a pack; the two generated translation files are
   stubs that the next build overwrites (§10).
6. **Progress storage is detected, not configured.** `shared/progress-tracker.js` picks a
   storage key from the URL path and knows only the repository's own hubs
   (`comp5318_progress`, `comp5270_progress`, `comp5046_progress`, `comp9001_progress`,
   `comp9123_progress`, the five `compXXXX_progress` hubs of 2026 S2, and the fallback
   `studyhub_progress`). Nothing in the templates sets `window.PROGRESS_TRACKER_CONFIG`, so
   a generated hub whose folder is not one of those names writes chapter progress to
   `studyhub_progress` while its dashboard reads `<storageKey>_progress` — the dashboard's
   sections dimension then reads zero. To make a new pack's progress land on its own key,
   set `window.PROGRESS_TRACKER_CONFIG = { storageKey: "<storageKey>_progress" }` **before**
   `progress-tracker.js` loads, which today means editing the generated chapter-page
   template or post-processing the output.
7. **`shared/site-reset.js` does not know new namespaces.** Its `KEY_PATTERNS` list covers
   `comp\d+_`, `elec\d+_`, `info\d+_`, `root_lang`, `studyhub_progress`, `custom_progress`,
   `srs_` and `chat_config` — so a `<storageKey>_progress` such as `demo101_progress` is left
   behind by "Reset all progress" (§5 of `docs/ARCHITECTURE.md`).
