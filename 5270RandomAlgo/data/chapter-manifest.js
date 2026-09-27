/**
 * COMP5270 — Single source of truth for chapter progress denominators.
 *
 * Both initMissionControl (index.html) and DASHBOARD_CONFIG (progress-dashboard.html)
 * must read from this file so totals never drift.
 *
 * sections  — count of .section[data-track] in chapterN-study.html
 * checks    — total quick-check interactions (study + math pages)
 * tutorials — solution-toggle / self-assessment count per chapter
 *
 * To update: re-count selectors in the chapter HTML, edit this file, and run
 *   node scripts/validate-manifest.js
 */
window.CHAPTER_MANIFEST = {
  sections:  { 1:8, 2:10, 3:7, 4:7, 5:7, 6:9, 7:8, 8:8, 9:9, 10:8, 11:12, 12:10 },
  checks:    { 1:10, 2:11, 3:10, 4:8, 5:7, 6:7, 7:7, 8:8, 9:7, 10:7, 11:8, 12:6 },
  tutorials: { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1 }
};
