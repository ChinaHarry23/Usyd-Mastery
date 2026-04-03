# Usyd Mastery

A centralized, interactive study platform for University of Sydney Computer Science courses. Pure static HTML/CSS/JS — no build tools required.

## Courses

| Code | Title | Chapters | Status |
|------|-------|----------|--------|
| COMP5270 | Randomised & Advanced Algorithms | 12 | Complete |
| COMP5046 | Natural Language Processing | 6 | Complete |
| COMP5318 | Machine Learning & Data Mining | 6 | Complete |
| COMP9001 | Introduction to Programming | 5 | In progress |

## Features

- **Study Guides** — structured chapter walkthroughs with KaTeX math rendering, interactive diagrams, and recall prompts
- **Math Foundations** — dedicated formula reference pages per chapter with quick-check exercises
- **Mind Maps** — recursive tree visualizations built from JSON data with expand/collapse
- **Knowledge Graph** — custom force-directed graph engine (Canvas 2D) with 80+ nodes, drag/zoom/filter/search
- **Quiz Hub** — practice and exam modes with missed-question stack and per-chapter score tracking
- **Flashcards** — SM-2 spaced repetition scheduling with 4-level rating
- **Progress Dashboard** — weighted mastery calculation, streak tracking, quiz history, SRS review calendar
- **Mission Control** — gamified progress panel on each course homepage (mastery tier, streaks, next mission)
- **Chat Panel** — connects to local LM Studio for context-aware Q&A with streaming, vision model support, and file attachments
- **Bilingual UI** — full English/Chinese toggle across all pages

## Architecture

```
Usyd-Mastery/
├── index.html                    # Root portal (course selector)
├── shared/                       # Cross-hub shared modules
│   ├── home.css                  # Shared course homepage styles
│   └── mission-control.js        # Shared progress/gamification logic
├── 5270/                         # COMP5270 hub
├── 5318/                         # COMP5318 hub
├── Comp5046-NLP-Study-Hub/       # COMP5046 hub
├── COMP9001-Intro-to-.../        # COMP9001 hub
└── README.md
```

Each course hub follows the same structure:

```
<course>/
├── index.html          # Course homepage with Mission Control
├── shared/             # Course-specific shared assets
│   ├── study.css       # Design system
│   ├── chat-panel.js   # AI chat integration
│   ├── mindmap.js      # Mind map renderer
│   ├── progress-tracker.js
│   ├── flashcard-srs.js
│   └── lang-toggle.js  # i18n engine + translations
├── data/
│   ├── quiz-data-extract.js
│   └── flashcard-data.js
├── tools/
│   ├── flashcards.html
│   ├── quiz-hub.html
│   ├── knowledge-graph.html
│   ├── progress-dashboard.html
│   └── math-knowledge-graph.html
└── chapters/
    └── chapterN/
        ├── materials/   # PDFs, notebooks, datasets
        └── web/
            ├── chapterN-study.html
            ├── chapterN-math.html
            └── chapterN-mindmap.html
```

## Running Locally

Open `index.html` in any browser, or serve with any static file server:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

For AI chat features, run [LM Studio](https://lmstudio.ai/) on `localhost:1234`.

## Tech Stack

- Vanilla HTML/CSS/JS (no frameworks, no build step)
- KaTeX for math rendering
- Canvas 2D for knowledge graph visualization
- localStorage for all persistence (progress, SRS state, chat config)
- pdf.js (lazy-loaded) for PDF text extraction in chat

## License

Course materials are provided for personal study under University of Sydney copyright rules.
