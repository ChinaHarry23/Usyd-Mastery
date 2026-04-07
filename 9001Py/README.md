# COMP9001 Intro to Programming Study Hub

Static study-site scaffold for **COMP9001 — Intro to Programming**, prepared from the lecture PDFs in:

`/Users/chinaharry/Desktop/Workspace/Study Sites/COMP9001 Intro to Programming`

This project mirrors the requested study-hub folder layout so it is ready for a second pass where we turn each lecture into a richer interactive study site.

## What's ready

- `index.html` home page with chapter cards and tool links
- `chapters/chapter1-5/materials/` populated with the provided PDFs
- `chapters/chapterN/web/` pages for:
  - study guide
  - foundations / checks
  - mind map
- `tools/` pages for:
  - knowledge graph
  - foundations graph
  - quiz hub
  - flashcards
  - progress dashboard
- `data/` files with starter metadata, flashcards, and quiz questions
- `shared/` reusable CSS and JS

## Notes

- Lecture 4's exact topic could not be recovered reliably from PDF metadata in this environment, so it is labelled neutrally as **Lecture 4 Materials** for now.
- The scaffold is intentionally lightweight. It is meant to be a clean starting point for turning the PDFs into full study content next.

## Run locally

```bash
cd "/Users/chinaharry/Desktop/Workspace/Study Sites/COMP9001-Intro-to-Programming-Study-Hub"
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).
