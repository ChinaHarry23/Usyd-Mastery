/**
 * 5046NLP — Single source of truth for chapter progress denominators.
 *
 * sections  — .section[data-track] tracked on chapterN-study.html
 * checks    — quick-check interactions (study + foundations pages)
 * tutorials — solution-toggle self-assessments per chapter
 *
 * Generated from the live pages by scripts/audit-denominators.js — do not
 * hand-edit. Re-run: node scripts/audit-denominators.js --fix
 */
window.CHAPTER_MANIFEST = {
  sections: { 1: 12, 2: 12, 3: 10, 4: 12, 5: 11, 6: 12 },
  checks: { 1: 7, 2: 5, 3: 5, 4: 5, 5: 4, 6: 6 },
  tutorials: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
};
