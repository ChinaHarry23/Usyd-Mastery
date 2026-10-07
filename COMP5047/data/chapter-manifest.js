/**
 * COMP5047 — Single source of truth for chapter progress denominators.
 *
 * sections  — .section[data-track] tracked on chapterN-study.html
 * checks    — quick-check interactions (study + foundations pages)
 * tutorials — solution-toggle self-assessments per chapter
 *
 * Generated from the live pages by scripts/audit-denominators.js — do not
 * hand-edit. Re-run: node scripts/audit-denominators.js --fix
 */
window.CHAPTER_MANIFEST = {
  sections: { 1: 10, 2: 11, 3: 11, 4: 11, 5: 12, 6: 9, 7: 10, 8: 12 },
  checks: { 1: 8, 2: 13, 3: 13, 4: 13, 5: 12, 6: 13, 7: 12, 8: 14 },
  tutorials: { 1: 5, 2: 6, 3: 6, 4: 6, 5: 6, 6: 4, 7: 5, 8: 6 }
};
