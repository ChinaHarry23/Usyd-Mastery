/**
 * COMP5618 — Single source of truth for chapter progress denominators.
 *
 * sections  — .section[data-track] tracked on chapterN-study.html
 * checks    — quick-check interactions (study + foundations pages)
 * tutorials — solution-toggle self-assessments per chapter
 *
 * Generated from the live pages by scripts/audit-denominators.js — do not
 * hand-edit. Re-run: node scripts/audit-denominators.js --fix
 */
window.CHAPTER_MANIFEST = {
  sections: { 1: 9, 2: 12, 3: 11, 4: 10, 5: 11, 6: 11, 7: 13 },
  checks: { 1: 10, 2: 13, 3: 12, 4: 12, 5: 12, 6: 8, 7: 14 },
  tutorials: { 1: 3, 2: 6, 3: 6, 4: 6, 5: 6, 6: 6, 7: 6 }
};
