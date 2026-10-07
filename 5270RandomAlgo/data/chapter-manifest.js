/**
 * 5270RandomAlgo — Single source of truth for chapter progress denominators.
 *
 * sections  — .section[data-track] tracked on chapterN-study.html
 * checks    — quick-check interactions (study + foundations pages)
 * tutorials — solution-toggle self-assessments per chapter
 *
 * Generated from the live pages by scripts/audit-denominators.js — do not
 * hand-edit. Re-run: node scripts/audit-denominators.js --fix
 */
window.CHAPTER_MANIFEST = {
  sections: { 1: 8, 2: 10, 3: 7, 4: 7, 5: 7, 6: 9, 7: 8, 8: 8, 9: 9, 10: 8, 11: 12, 12: 10 },
  checks: { 1: 7, 2: 7, 3: 5, 4: 4, 5: 4, 6: 6, 7: 5, 8: 6, 9: 6, 10: 3, 11: 6, 12: 6 },
  tutorials: { 1: 10, 2: 11, 3: 10, 4: 8, 5: 7, 6: 7, 7: 7, 8: 8, 9: 7, 10: 7, 11: 8, 12: 6 }
};
