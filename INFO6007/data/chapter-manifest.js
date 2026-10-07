/**
 * INFO6007 — Single source of truth for chapter progress denominators.
 *
 * sections  — .section[data-track] tracked on chapterN-study.html
 * checks    — quick-check interactions (study + foundations pages)
 * tutorials — solution-toggle self-assessments per chapter
 *
 * Generated from the live pages by scripts/audit-denominators.js — do not
 * hand-edit. Re-run: node scripts/audit-denominators.js --fix
 */
window.CHAPTER_MANIFEST = {
  sections: { 1: 9, 2: 9, 3: 10, 4: 12, 5: 11, 6: 12, 7: 10, 8: 11 },
  checks: { 1: 12, 2: 8, 3: 13, 4: 11, 5: 15, 6: 13, 7: 11, 8: 12 },
  tutorials: { 1: 4, 2: 6, 3: 6, 4: 6, 5: 7, 6: 6, 7: 4, 8: 6 }
};
