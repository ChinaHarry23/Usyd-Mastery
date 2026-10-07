/**
 * INFO5995 — Single source of truth for chapter progress denominators.
 *
 * sections  — .section[data-track] tracked on chapterN-study.html
 * checks    — quick-check interactions (study + foundations pages)
 * tutorials — solution-toggle self-assessments per chapter
 *
 * Generated from the live pages by scripts/audit-denominators.js — do not
 * hand-edit. Re-run: node scripts/audit-denominators.js --fix
 */
window.CHAPTER_MANIFEST = {
  sections: { 1: 12, 2: 9, 3: 12, 4: 12, 5: 10, 6: 10, 7: 11, 8: 12 },
  checks: { 1: 12, 2: 8, 3: 15, 4: 14, 5: 12, 6: 13, 7: 12, 8: 12 },
  tutorials: { 1: 6, 2: 4, 3: 6, 4: 6, 5: 6, 6: 5, 7: 6, 8: 6 }
};
