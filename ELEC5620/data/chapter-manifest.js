/**
 * ELEC5620 — Single source of truth for chapter progress denominators.
 *
 * sections  — .section[data-track] tracked on chapterN-study.html
 * checks    — quick-check interactions (study + foundations pages)
 * tutorials — solution-toggle self-assessments per chapter
 *
 * Generated from the live pages by scripts/audit-denominators.js — do not
 * hand-edit. Re-run: node scripts/audit-denominators.js --fix
 */
window.CHAPTER_MANIFEST = {
  sections: { 1: 9, 2: 9, 3: 11, 4: 12, 5: 10, 6: 11, 7: 9, 8: 9 },
  checks: { 1: 13, 2: 12, 3: 12, 4: 12, 5: 13, 6: 12, 7: 13, 8: 10 },
  tutorials: { 1: 5, 2: 5, 3: 4, 4: 6, 5: 4, 6: 5, 7: 5, 8: 4 }
};
