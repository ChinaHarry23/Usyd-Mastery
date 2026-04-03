/**
 * COMP9001 — Single source of truth for chapter progress denominators.
 *
 * sections  — count of .section[data-track] in chapterN-study.html
 * checks    — total quick-check interactions (study + math pages)
 * tutorials — solution-toggle / self-assessment count per chapter
 *
 * Note: chapters 2-5 do not yet have study.html files.
 * Their section counts are placeholders and should be updated when content is added.
 */
window.CHAPTER_MANIFEST = {
  sections:  { 1: 10, 2: 6, 3: 6, 4: 5, 5: 6 },
  checks:    { 1: 8, 2: 8, 3: 8, 4: 6, 5: 8 },
  tutorials: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }
};
