<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/English-current-6c8cff?style=for-the-badge" alt="English (current)"></a>
  &nbsp;
  <a href="README.zh.md"><img src="https://img.shields.io/badge/中文-切换语言-555?style=for-the-badge" alt="切换到中文"></a>
</p>

> **Note:** GitHub README pages cannot run interactive buttons or JavaScript. The badges above link to the English and Chinese documents so you can switch language in one click.

---

# COMPX270 Study Site

Interactive study materials for **COMPX270 — Randomised and Advanced Algorithms** (University of Sydney–aligned, S1 2026): chapter guides with simulations, math foundations, mind maps, quizzes, and a bilingual (English / 中文) UI in the web app.

This is a **static website** (HTML, CSS, JavaScript). There is no build step and no server-side code. Everything runs in the browser.

---

## What’s included

| Area | Description |
|------|-------------|
| **Home** (`index.html`) | Links to all chapters and global tools. |
| **Study guides** (`chapters/chapterN/web/chapterN-study.html`) | Narrative notes, interactive demos, tutorial problems with revealable solutions. |
| **Math foundations** (`chapters/chapterN/web/chapterN-math.html`) | Worked quick-check questions (counts toward progress). |
| **Mind maps** (`chapters/chapterN/web/chapterN-mindmap.html`) | Chapter concept maps. |
| **Knowledge graphs** | `tools/knowledge-graph.html` (concepts), `tools/math-knowledge-graph.html` (math topics). |
| **Quiz Hub** (`tools/quiz-hub.html`) | Practice / exam-style quizzes tied to chapters. |
| **Flashcards** (`tools/flashcards.html`) | Spaced-repetition cards from study guides (`data/flashcard-data.js`). |
| **Progress** (`tools/progress-dashboard.html`) | Weighted progress: sections read, quick checks, quiz best, tutorial self-checks. |

Course PDFs (notes, slides, tutorials) live under each `chapters/chapterN/materials/`.

---

## How to use it

1. **Start at the home page** — Open `index.html` in a browser and pick a chapter or a tool (Knowledge Graph, Quiz Hub, Progress).
2. **Per chapter** — Use **Study Guide** for the main narrative and simulations; **Math Foundations** for short exercises; **Mind Map** for a compact overview. Follow internal navigation and sidebars where present.
3. **Language** — Use the **EN / 中文** control on pages that support it. Preferences are stored in the browser (`localStorage`).
4. **Tutorial problems** — Try the problem first, then **Show Solution**. After the solution is visible, confirm whether you understood it and matched the conclusion — this feeds the **tutorial** portion of progress.
5. **Quizzes** — Open **Quiz Hub**, choose scope and mode. Your best chapter quiz score is tracked for progress.
6. **Progress dashboard** — Open **Progress** for per-chapter breakdowns and overall weighted completion. Data is stored **only in this browser** (local storage), not on a server — use the same device/browser for continuity.
7. **Math rendering** — KaTeX/MathJax may load from CDNs; an internet connection is needed unless you host copies locally.

---

## Run locally on your LAN (e.g. iPad)

Serve the **project root** (the folder that contains `index.html`) over HTTP and bind to **all interfaces** (`0.0.0.0`) so phones/tablets on the same Wi‑Fi can open the site. Replace `8000` if the port is in use.

### Option A — Python 3

*(No extra install on most Mac/Linux systems.)*

```bash
cd /path/to/Study && python3 -m http.server 8000 --bind 0.0.0.0
```

### Option B — Node.js

*(Uses `npx`; first run may download packages.)*

```bash
cd /path/to/Study && npx --yes http-server -p 8000 -a 0.0.0.0
```

### Then on your iPad or phone

1. Find the host computer’s **LAN IP** (e.g. macOS: **System Settings → Network → Wi‑Fi → Details** → IP, often `192.168.x.x`).
2. In Safari (or any browser), open: `http://YOUR_LAN_IP:8000/` — e.g. `http://192.168.1.42:8000/`

**Tips**

- Keep the computer awake while studying; stop the server with `Ctrl+C` when done.
- If the page won’t load, check the host **firewall** and that both devices use the **same Wi‑Fi** (guest Wi‑Fi often isolates clients).
- Public HTTPS or internet access needs a tunnel (e.g. ngrok); not required for home LAN.

---

## Repository layout (short)

```
Study/
├── index.html
├── tools/                  # Site-wide tools (graphs, quiz, flashcards, progress)
│   ├── knowledge-graph.html
│   ├── math-knowledge-graph.html
│   ├── quiz-hub.html
│   ├── flashcards.html
│   └── progress-dashboard.html
├── data/                   # Bundled data for tools
│   ├── flashcard-data.js
│   └── quiz-data-extract.js
├── shared/                 # Shared CSS, JS (language, progress, mind map)
└── chapters/               # All course chapters (1–12)
    └── chapterN/
        ├── materials/      # PDFs
        └── web/            # HTML + JS per chapter
```

---

## Source and acknowledgement

The **lecture notes, slides, and tutorials** packaged here follow the structure and content of **Clément Canonne’s** course materials for *Randomised and Advanced Algorithms* at the **University of Sydney** (listed on the author’s hub as COMP4270 / COMP5270; chapter index and links: [**ccanonne.github.io/teaching/COMPx270.html**](https://ccanonne.github.io/teaching/COMPx270.html)). The author distributes LaTeX sources and related material on GitHub under **CC BY-NC-ND 4.0**; see that page for the canonical license and downloads.

This web project adds interactive pages, quizzes, progress tracking, and bilingual UI; it is **not** an official University of Sydney publication.

---

## License and course materials

Course PDFs and curriculum content remain with their **authors** and, where applicable, the **University of Sydney** and rights holders under the original licence ([course hub](https://ccanonne.github.io/teaching/COMPx270.html)). This repository packages them for personal study convenience; respect copyright, the **CC BY-NC-ND** terms on the original notes where they apply, and your local course rules on redistribution. Primary reference: [Clément Canonne, *COMPx270* course hub](https://ccanonne.github.io/teaching/COMPx270.html).

---

## Contributing

This is a personal study project. If you fork it, adapt paths and branding to your own course as needed.
