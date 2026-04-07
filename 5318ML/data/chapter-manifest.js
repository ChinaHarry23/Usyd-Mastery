/**
 * COMP5318 — Single source of truth for chapter progress denominators.
 *
 * sections  — count of .section[data-track] in chapterN-study.html
 * checks    — total quick-check interactions (study + math pages)
 * tutorials — solution-toggle / self-assessment count per chapter
 */
window.CHAPTER_MANIFEST = {
  sections:  { 1: 8, 2: 8, 3: 7, 4: 7, 5: 6, 6: 6 },
  checks:    { 1: 11, 2: 7, 3: 9, 4: 9, 5: 8, 6: 9 },
  tutorials: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 }
};
