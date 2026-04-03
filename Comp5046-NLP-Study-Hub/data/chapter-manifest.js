/**
 * COMP5046 NLP — Single source of truth for chapter progress denominators.
 *
 * sections  — count of .section[data-track] in chapterN-study.html
 * checks    — total quick-check interactions (study + math pages)
 * tutorials — solution-toggle / self-assessment count per chapter
 */
window.CHAPTER_MANIFEST = {
  sections:  { 1: 12, 2: 12, 3: 10, 4: 12, 5: 11, 6: 12 },
  checks:    { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8, 6: 8 },
  tutorials: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 }
};
