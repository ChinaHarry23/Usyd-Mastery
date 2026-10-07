# Usyd Mastery — Cold-Start Review & Commercial Assessment

**Date:** October 2026
**Scope:** full-site review as a first-time visitor, plus a feasibility and commercial
assessment of cloud-AI tutoring.
**Method:** every cache layer purged, then the site walked from a clean browser
profile; findings measured in headless Chrome rather than judged by eye.

---

## 0. ⚠️ Read this first — lecture material is published publicly on GitHub

This outranks every other finding in this document, and it is not hypothetical.

The repository has a **public** remote — `github.com/ChinaHarry23/Usyd-Mastery`
— and the pushed tree contains **107 University of Sydney lecture PDFs totalling
180 MB**:

| Course | PDFs in the public tree |
|---|---|
| 5270RandomAlgo | 48 |
| 9123DataStructureAlgo | 22 |
| 5318ML | 21 |
| 5046NLP | 11 |
| 9001Py | 5 |
| **Total** | **107 (180 MB)** |

Sample paths, all publicly fetchable right now:

```
5046NLP/chapters/chapter1/Materials/lecture-1_comp5046-2026_handout.pdf   11.0 MB
5046NLP/chapters/chapter12/materials/lecture-12.pdf                       13.8 MB
5270RandomAlgo/...  (48 files)
```

Some are explicitly attributed to named academics (`Velloso-Gesture-Interaction.pdf`,
`Velloso-Intro-to-Pervasive-Computing.pdf`). The copyright sits with the
University and/or the author of each deck. There is no `LICENSE` file on the
repository.

**Two consequences, one of them time-sensitive:**

1. This is public redistribution of third-party teaching material. It would
   independently block any commercial path, and it plausibly breaches the
   University's IT and acceptable-use policies.
2. **The five new S² 2026 courses are not yet pushed.** `COMP5047`, `COMP5618`,
   `ELEC5620`, `INFO5995` and `INFO6007` have 43 more PDFs (~78 MB) sitting
   untracked in the working tree. **A `git add .` would publish those too.**

**Remediation — do this before anything else:**

```bash
# 1. Stop new material from being tracked, and untrack what is already tracked.
printf '*/chapters/*/materials/\n*/chapters/*/Materials/\n' >> .gitignore
git rm -r --cached --quiet '*/chapters/*/materials' '*/chapters/*/Materials'
git commit -m "Stop tracking third-party lecture material"

# 2. Scrub it from history and force-push (rewrites published history).
#    Coordinate this: anyone who has cloned the repo must re-clone.
git filter-repo --path-glob '*/chapters/*/materials/*' \
                --path-glob '*/chapters/*/Materials/*' --invert-paths
git push --force

# 3. If the exposure has been live a while, ask GitHub Support to purge
#    cached views, and consider making the repo private meanwhile.
```

`git rm --cached` removes the files from git but **keeps them on disk** — the
local study site keeps working unchanged. Nothing in the running site depends on
the PDFs being tracked.

**Decision needed from you:** whether these decks are yours to publish. If any of
them are your own work, list them and exclude them from the scrub. If none are,
scrub all of them.

---

## 1. Cache purge — what was actually cached, and what changed

The site stored state in four layers. The in-app "Reset all progress" button
only cleared **two localStorage keys**, so language, chat configuration, SRS
state, the IndexedDB mirror and the entire service-worker cache all survived a
"reset".

| Layer | What it held | Before | Now |
|---|---|---|---|
| `localStorage` | progress, SRS, language, chat config, key per course | 2 keys cleared by the reset button | all app keys cleared; foreign keys untouched |
| IndexedDB (`usyd_mastery`) | mirror written by `storage.js` | never cleared | deleted |
| Cache Storage (`usyd-mastery-v6`) | precache + runtime cache | only purged on a version bump | purged on activate, then refilled |
| Service worker registration | served the cache | never unregistered | unregistered on purge |

**New: `shared/site-reset.js`.** One canonical module owning four layers:

```js
SiteReset.inspect()    // { localStorage: [...], databases: [...], caches: [...], sw: [...] }
SiteReset.purgeAll()   // clears all four, returns what it removed
SiteReset.reloadFresh()// purge, then reload clean
```

**New: `?fresh=1` on any URL.** Purges before first paint, then reloads clean —
the fastest way to reproduce a brand-new-visitor state:

```
http://localhost:8000/COMP5047/index.html?fresh=1
```

**Purge is scoped, not nuclear.** It matches only namespaces this app writes
(`comp*_`, `elec*_`, `info*_`, `root_lang`, `studyhub_progress`,
`custom_progress`, `srs_*`, `chat_config`) and deletes only the `usyd_mastery`
database. Anything belonging to another app on the same origin survives —
verified in a real browser: `comp5047_progress`, `root_lang` and `srs_state_ch1`
were removed while `unrelated_key` was preserved.

**Service worker corrected.** Registration lived only in `root-portal.js` and
used the absolute path `/sw.js`. Two consequences, both real:

- A visitor who deep-linked straight into a chapter page got **no offline
  support at all** — the worker was never registered. Verified: after the fix, a
  direct load of a chapter page reports `controller: yes`, `registrations: 1`,
  scope `/`.
- Hosting under a sub-path (a GitHub Pages project site, say) registered a
  worker with the wrong scope, and every entry in `PRECACHE_URLS` was absolute
  so the precache would 404. Both are now relative to the worker.

The service worker is registered from 295 pages instead of 1.

---

## 2. Cold-start audit — findings

### 2.1 Every page was horizontally scrollable on a phone — **fixed**

**Severity: critical.** The most visible defect on the site, and the first thing
a phone visitor met.

Measured at a 390px viewport: the portal was **220px wider than the screen** and
every hub and chapter page **144px wider**. The page could be dragged sideways,
headlines were cut mid-word, and card content ran off the right edge.

Cause was decorative, not structural. Two absolutely positioned glows were never
clipped:

- `shared/root-portal.css` — `.hub-header::before` is `width: 800px` inside a
  328px header, bleeding ~236px each side.
- `shared/study-base.css` — `body::after { right: -8rem }`, and `-9rem` at
  ≤600px. That is exactly the 144px measured on every page.

Fixed with an overflow guard on the root element in `study-base.css`,
`home.css` and `root-portal.css`:

```css
html {
  overflow-x: hidden;  /* fallback */
  overflow-x: clip;    /* modern: contains the bleed without creating a scroll container */
}
```

`clip` rather than `hidden` matters: `hidden` would create a scroll container
and break sticky positioning; `clip` does not.

**Verified:** 61 pages sampled across all 10 hubs at 390px — **0 pages with
horizontal overflow**. A regression test now asserts the guard exists.

### 2.2 Knowledge-graph labels collide into unreadability

**Severity: serious.** The concept graph renders 112 nodes and 198 edges with
every label drawn at once. In the dense region the labels overprint each other —
`Classification Taxonomy`, `Chunking` and `Sense-Reason-Act Loop` occupy the same
space; `The Arduino Platform Setup() and loop() Lifecycle` collides with
`Digital I/O`, `LED`, `Arduino Uno Board` and `Set Relationships`.

The graph is the flagship visual of the platform and it cannot be read at its
default zoom. Suggestions, cheapest first:

1. **Zoom-dependent label density** — draw labels only above a zoom threshold,
   or only for nodes above a size/difficulty cut. Removes most collisions with
   no layout change.
2. **Focus + context** — on hover or focus, dim non-neighbours and show only
   that node's labels. Standard for graphs this size.
3. **Label de-collision** — a simple greedy pass that hides a label whose
   bounding box intersects an already-placed one. ~30 lines, runs after layout.
4. **Open framed** — start fitted to one chapter cluster rather than the whole
   graph, and let the learner zoom out.

### 2.3 No search anywhere on the site

**Severity: serious.** Across 78 chapters, 234 chapter pages, 603 quiz questions
and 2,757 graph nodes, there is **no way to search**. The only search boxes are
node filters inside the two graph tools. A learner who remembers "the bit about
pull-up resistors" but not which week it was in has to guess.

Minimum useful version: a client-side index over section titles and body text.
The content is ~422k words — a prebuilt JSON index plus a match-snippet overlay
is a small, self-contained addition that needs no server.

### 2.4 No onboarding, and no signal of what to do first

**Severity: moderate.** A first-time visitor lands on the portal, sees 10 course
cards, and is offered no orientation: no explanation of the study/foundations/
mind-map structure, no suggestion of where to begin, no indication that the
progress tracking is per-browser and needs no account.

The hub pages do this better — Mission Control names a next action ("Start Week
1") — but the portal does not. A dismissible one-screen introduction, or simply
a line of copy on the portal explaining the three page types, would close the
gap.

### 2.5 Tool and chapter pages load cleanly

**Both positive and worth recording:** no runtime errors on any page type
tested. Nine representative pages (portal, three hub homes, study, foundations
and mind-map pages across three hubs) reported a clean console. The flashcard
tool has a genuinely good empty state — counts, keyboard hints, and an
unambiguous next action.

### 2.6 Chinese content is announced in English to screen readers — **fixed**

**Severity: serious.** I checked where `<html lang>` is updated when the learner
switches language:

| Module | Pages it drives | Set `lang`? |
|---|---|---|
| `shared/root-lang-toggle.js` | the portal | ✅ yes |
| `shared/mission-control.js` | 10 hub home pages | ❌ no |
| `shared/lang-toggle.js` | 295 chapter, foundations, mind-map and tool pages | ❌ no |

So on 305 of 306 pages, switching to Chinese swapped the text but left
`<html lang="en">`. A screen reader then reads Chinese prose with English
pronunciation rules — the text is unintelligible. This is WCAG 3.1.1
(Language of Page).

Fixed by adding `syncLangAttr()` to both modules. The subtlety worth recording:
the hook must live in `apply()`, not `toggle()` — `toggle()` reads `lang`
*before* it changes, so the first version of the fix set the attribute to the
old value. Verified in a real browser:

```
chapter initial lang : en
after 中文           : zh-CN
back to EN           : en
VERDICT: lang attribute tracks the toggle
```

### 2.7 Chapter cards are not keyboard reachable

**Severity: serious** (WCAG 2.1.1 Keyboard). Each hub home page lists its
chapters as `<div class="chapter-card" onclick="location.href=...">` — eight per
hub, 78 in total. A `div` with an `onclick` is not focusable, not activatable
with Enter, and not announced as a link. A keyboard-only learner cannot open any
chapter from a hub home page. There is no `tabindex` and no `role`.

Fix: wrap the content in a real `<a href>` and style the anchor as the card, or
add `role="link" tabindex="0"` plus an Enter/Space key handler. The anchor is
better — it also restores middle-click, "open in new tab" and the status-bar
preview.

### 2.8 A chapter page is 77–89% bilingual payload

**Severity: serious** for anyone on a slow connection. Measured first-load
weight by page type (local bytes; gzip computed at level 6):

| Page | HTML | CSS | JS | Data | **Total** | **Gzipped** |
|---|---|---|---|---|---|---|
| Portal | 29K | 25K | 21K | — | **75K** | 18K |
| Hub home | 27K | 36K | 69K | 1K | **132K** | 36K |
| Chapter — study | 77K | 15K | 155K | **834K** | **1,081K** | 323K |
| Chapter — foundations | 41K | 26K | 124K | **834K** | **1,025K** | 307K |
| Chapter — mind map | 11K | 24K | 72K | **834K** | **940K** | 285K |
| Quiz hub | 7K | 29K | 73K | 78K | **188K** | 56K |
| Knowledge graph | 6K | 16K | 72K | 40K | **134K** | 38K |
| Progress dashboard | 8K | 23K | 85K | 25K | **142K** | 43K |

`section-translations.js` is **834 KB of the 1,081 KB chapter page — 77%**, and
**89% of the mind-map page**. It is loaded by a plain synchronous script tag:

```html
<script src="../../../shared/section-translations.js"></script>
```

No `defer`, no `async`, no conditional. **An English reader who never presses
中文 pays for the entire Chinese translation on every chapter page view.**

Fix: load it on demand — keep a tiny stub that resolves the current language,
and fetch the payload only when `localStorage.lang === "zh"` or the toggle is
pressed. Saves ~770 KB raw / ~226 KB gzipped per chapter page for English
readers, and removes roughly 834 KB of JavaScript parse from the critical path
on a mid-range phone.

---

## 3. Cloud AI tutoring — feasibility assessment

**Short answer: yes, and the plumbing already exists.** This is not a
greenfield build; it is a matter of what you point the existing client at.

### 3.1 What is already there — verified, not assumed

`shared/chat-panel.js` (1,120 lines) is a multi-provider OpenAI-compatible
client. I verified the full path end-to-end by standing up a mock
OpenAI-compatible server on `localhost:1234` and driving the real panel in a
real browser:

```
[fetch] http://127.0.0.1:1234/v1/models                    -> HTTP 200
[fetch] http://127.0.0.1:1234/v1/chat/completions          -> HTTP 200
assistant output rendered:
  MOCK_TUTOR_REPLY
  system_prompt_chars=30389
  has_page_context=true
  messages=2
  model=mock-tutor-1
```

So the panel: discovers models, sends an OpenAI-shaped request, streams SSE
back, and renders the reply — **with 30,389 characters of the current page
injected as grounding context.**

| Capability | Status |
|---|---|
| Providers | LM Studio (local), OpenAI, OpenRouter, Groq, xAI, DeepSeek, Gemini, Together, custom |
| Auth | BYO API key, entered in the UI, stored in `localStorage` |
| Streaming | Yes, SSE, with a separate "thinking" panel for reasoning models |
| Page grounding | 30k characters of the current page as a system prompt |
| Selection grounding | Highlighted text sent as `[Selected context from page]` |
| Attachments | Text files to 20k characters; images via a vision model |
| Safety | Endpoint host allow-list (SSRF guard), DOMPurify sanitisation, CSP `connect-src` allow-list |
| History | Per-page, in `localStorage` |

### 3.2 What it is not yet — the gaps that matter for *tutoring*

The current implementation is a **well-built page-aware chatbot**, not a tutor.
Five specific gaps:

1. **Grounding stops at the current page.** If a learner asks "how does this
   relate to week 3?", the model has no week 3. There is no retrieval across the
   corpus — and the corpus is small enough that this is easy: **422,389 words,
   roughly 570k tokens, for the entire site.**
2. **The structured data is unused.** The hub already holds 603 quiz questions
   with explanations, 548 flashcards, and 2,757 knowledge-graph nodes with
   curated definitions. None of it is given to the model. The knowledge graph in
   particular is a ready-made curriculum map that would make retrieval
   dramatically better than embedding raw prose.
3. **No pedagogical contract.** The system prompt is *"You are a helpful study
   assistant."* It will hand over a complete answer to an assignment question
   without hesitation. There is no Socratic mode, no hint-before-answer ladder,
   no check-for-understanding, no refusal boundary around assessed work.
4. **No awareness of the learner.** `progress-tracker.js` already knows which
   sections were read, which quick-checks were passed, and which questions were
   answered wrongly. None of it reaches the model, so it cannot say "you've
   failed three questions on CPM float this week".
5. **No cost or abuse control.** No token budget, no rate limit, no usage
   accounting, no per-user isolation. The API key sits in `localStorage`.

### 3.3 What a real tutoring layer would take

Ranked by value per unit of effort:

| # | Step | Effort | Why it matters |
|---|---|---|---|
| 1 | **Retrieval over the corpus.** Embed 422k words once (~$0.01 with a small embedding model); retrieve top-k sections per question instead of dumping one page | Low | Turns "answer about this page" into "answer about this unit" |
| 2 | **Tutor system prompt with a policy.** Socratic default, hint ladder, cite the section it used, refuse to write assessed work | Very low | The single biggest quality change per line of code |
| 3 | **Feed progress into the prompt.** Weak chapters, failed questions, recent activity | Low | Enables "you're struggling here, want three more like it?" |
| 4 | **Generate practice from the graph.** Walk prerequisite edges to build a question set | Medium | Uses the asset competitors do not have |
| 5 | **Answer with citations into the page.** Link each claim to its section anchor | Medium | Makes the output verifiable — essential for study material |
| 6 | **Server-side key + budget.** Required the moment anyone but you uses it | Medium | Non-negotiable for a product |

### 3.4 Running cost

Using the measured corpus and a page-level context of ~30k characters
(~8k tokens):

| Component | One-off / per unit | Notes |
|---|---|---|
| Embed the whole corpus | **≈ $0.01** | 570k tokens at ~$0.02/1M |
| One tutoring answer | **≈ $0.001–0.004** | 8k in / 500 out on a small model |
| 1,000 answers/month | **≈ $1–4** | plus retrieval, negligible |
| A 200-student cohort, 50 answers each | **≈ $10–40/month** | 10,000 answers |

The economics are not the obstacle. **The obstacles are legal and
pedagogical, not technical.**

---

## 4. Commercial assessment

### 4.1 The blocker that outranks everything else

See **section 0**. In short: 107 lecture PDFs are already public on GitHub, and
43 more from the current semester are one `git add .` away from joining them.
**Resolve that before any commercial planning** — no business model survives a
copyright claim over its core content.

Assuming it is resolved, three options for the content itself:

1. **Licence or permission** — approach the unit coordinators. Slow, uncertain,
   but the only path that keeps the existing content.
2. **Original content** — rewrite the study material in your own words from
   public sources and the textbook. Expensive, but it makes the asset yours.
3. **BYO-content model** — ship the *engine* (the hub structure, widgets,
   graphs, SRS, tutor) and let each student or institution load their own
   licensed material. This sidesteps the problem entirely and is, in my view,
   the most promising route.

Option 3 also happens to be the strongest product: the differentiator here is
not the lecture notes, it is the machinery around them.

### 4.2 What is genuinely differentiated

Being honest about this matters more than optimism.

| Asset | Defensible? | Comment |
|---|---|---|
| The lecture content | **No** | Third-party, and every student in the unit has it |
| The 12 widget types + 118 canvas steppers | **Partly** | Real work, but reproducible by a competent developer |
| Bilingual EN/中文 with full section parity | **Yes** | Genuinely uncommon, and a real market: international students in Australian CS programmes |
| Knowledge graphs with curated definitions and prerequisite edges | **Yes** | 2,757 hand-authored nodes with strength-weighted edges is a real asset |
| Zero-redundancy static architecture, no build, offline-capable | **Yes, mildly** | Cheap to host, works on a plane, no vendor lock-in |
| Progress model with honest denominators | **Partly** | Well-built, but table stakes |

The strongest single asset is the **bilingual coverage**. Chinese-speaking
students in Australian and UK CS master's programmes are a large, underserved,
and specifically identifiable market, and full-fidelity technical translation is
exactly what general-purpose tools do badly.

### 4.3 Realistic models

**A. BYO-key tutor on top of the existing site (a feature, not a company).**
The chat panel already does this. Adding retrieval and a tutor prompt makes it
excellent. No revenue, no legal exposure beyond the current situation, and it
materially improves your own study. **Do this regardless of anything else.**

**B. Subscription study companion for a single unit — ~$5–8/month.**
Student brings their own API key, or you proxy it with a token budget. Costs are
~$0.10–0.40 per active student per month, so gross margin is high. The problem
is distribution and retention: a unit lasts 12 weeks, so you must either price
for a semester ($20–30 once) or expand across units. Churn is structural.

**C. Institutional licence — the plausible business.**
Sell to a School of Computer Science, not to students. The pitch is not "AI
tutor" — that is a crowded and increasingly commoditised claim. It is:
*"a per-unit study platform with interactive simulations, prerequisite graphs,
spaced repetition and a bilingual layer, that runs offline and can be pointed at
your own material."* The BYO-content model removes the copyright problem and
turns it into a feature. Realistic pricing is per-unit-per-year, in the low
thousands.

**D. Open-source with a hosted tier.**
The architecture is unusually well suited to this: no build step, static files,
no server. Publish the engine (with the lecture material excluded — see 4.1),
let departments self-host, charge for a managed instance and the tutor proxy.
This is the lowest-friction route to credibility, and academic tooling benefits
disproportionately from being inspectable.

### 4.4 Competitive reality

- **NotebookLM** already does grounded, cited answers over your own uploaded
  material, free, and is excellent at it. Any "AI over your notes" pitch is
  competing directly with a Google product. Do not build that.
- **ChatGPT / Claude** with file upload cover the general case.
- **Anki** owns spaced repetition, and its ecosystem is deep.
- **Quizlet** owns the flashcard-to-quiz funnel.

What none of them do: **a structured per-unit curriculum with prerequisite
graphs, interactive discipline-specific simulations, and honest progress
denominators.** That is the wedge — the AI is a feature layered on it, not the
product. Positioning the AI as the product is the most likely way to fail.

### 4.5 Academic integrity — needs a decision, not a disclaimer

An AI tutor that answers assignment questions sits directly against most
universities' academic integrity policies. Two things follow:

1. The tutor needs a **deliberate boundary**: explain concepts, generate
   practice, mark *your* attempt, refuse to produce submittable work. This is a
   design decision, and it should be visible in the product, not buried in a
   footer.
2. For an institutional sale, this boundary is not a constraint — it is a
   selling point. "Our tutor will not do the assignment for you" is a feature
   that a unit coordinator can defend to a committee.

### 4.6 What I would do, in order

1. **Untrack and scrub the lecture PDFs from the public repo** (section 0).
   This is the only item on the list with a deadline attached, because the
   current-semester decks are one commit away from being published too.
2. **Add search.** Closes the largest usability gap for 422k words of content.
3. **Fix the graph labels.** The flagship visual is currently unreadable.
4. **Add retrieval + a tutor prompt** to the existing chat panel. Improves your
   own study immediately and is the whole product thesis in prototype form.
5. **Decide the content question** (licence / original / BYO) before writing any
   business plan. Everything downstream depends on it.

---

## 5. Verification summary

| Check | Result |
|---|---|
| `npm run ci` | **pass** — 0 lint errors, 802 tests, all data validations clean |
| Horizontal overflow, 61 pages at 390px | **0 pages** overflow (was: every page, 144–220px) |
| Cache purge, real browser | app keys removed, foreign key preserved |
| Service worker from a deep link | registers, `controller: yes` |
| Chat panel against a mock cloud endpoint | end-to-end, streamed, 30,389-char context |
| Runtime console errors, 9 page types | clean |
| Internal links, 302 pages | 0 broken |
| `<html lang>` after the 中文 toggle, real browser | `en → zh-CN → en` (was: stuck on `en`) |
| Public GitHub tree | **107 lecture PDFs, 180 MB — needs action** |

**Test count grew from 793 to 804** across this review: 9 new cache-purge tests,
one overflow-guard test, one translation-defect test class and one
language-attribute test.
