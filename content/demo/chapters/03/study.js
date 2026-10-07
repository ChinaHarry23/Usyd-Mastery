/* Chapter 3 - Practice and Progress
 *
 * This chapter needs no imperative JavaScript.
 *
 * The review sequence and the chapter comparison bars are declarative widgets,
 * mounted by the engine from the JSON blocks beside their placeholders. Scoring,
 * scheduling and progress restoration are handled by the shared page scripts,
 * which read the data files under data/ rather than anything chapter-specific.
 *
 * A script would earn its place here only if the page needed behaviour that no
 * widget type expresses - for example reading the quiz data at load time and
 * drawing a per-concept breakdown. The pattern for that is in
 * chapters/02/study.js, which mounts the config doctor into its own section.
 */
