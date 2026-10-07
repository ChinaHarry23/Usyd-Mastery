# COMP5046 Natural Language Processing Study Hub

Interactive bilingual study hub for **5046** — Text representation, non-linear models, inference and search, encoder–decoder architectures and transformers — built from the lecture handouts and workshops.

Each lecture ships as a study guide, a foundations page, and a mind map, plus
five cross-course tools.

## What's inside

- `index.html` — course home page with Mission Control progress panel
- `chapters/chapterN/materials/` — the original lecture PDFs, notebooks and datasets
- `chapters/chapterN/web/` — study guide, foundations page and mind map per lecture
- `tools/` — knowledge graph, foundations graph, quiz hub, flashcards, progress dashboard
- `data/` — chapter manifest, quiz bank, flashcard deck, site metadata
- `shared/` — theme, language-toggle config and chapter page chrome

## Lectures

| # | Lecture | Topic | Status |
|---|------|-------|--------|
| 1 | Introduction &amp; Representing Text | Complete |
| 2 | Foundations of NLP Systems | Complete |
| 3 | Non-linear Models | Complete |
| 4 | Inference: Greedy &amp; Search | Complete |
| 5 | Encoder–Decoder Models | Complete |
| 6 | Transformer Models | Complete |

## Run locally

```bash
cd "/Users/chinaharry/Desktop/Workspace/University/Usyd-Mastery"
python3 -m http.server 8000
```

Then open <http://localhost:8000/5046NLP/>.

## Materials

Lecture materials are provided for personal study under University of Sydney
copyright rules. This hub adds summaries, practice questions and revision tools —
it does not replace official lectures or assessment specifications.
