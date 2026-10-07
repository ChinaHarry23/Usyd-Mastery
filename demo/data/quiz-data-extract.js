/* DEMO101 — quiz bank. Generated from the content pack. */
var ALL_QUIZ_DATA = [
  {
    "ch": 1,
    "type": "study",
    "q": "Which section must come first on a study page, and what must it carry?",
    "opts": [
      "The longest section, with no attributes required",
      "The hero section, carrying id=hero and data-track=hero",
      "The quick check, so readers can test themselves early",
      "Any section, because the generator sorts sections by heading"
    ],
    "answer": 1,
    "exp": "The section contract fixes the hero first. The sidebar, the progress denominator and the relative anchors that follow are all derived from the order of the sections after it."
  },
  {
    "ch": 1,
    "type": "study",
    "q": "Where does the text of a sidebar entry come from?",
    "opts": [
      "The value of the section's data-track attribute",
      "The first sentence of the section body",
      "The text inside the section's h2 with class section-title",
      "The section id with the sec- prefix removed"
    ],
    "answer": 2,
    "exp": "The generator reads the section-title heading as the navigation label, which is why the guidance is two to four words rather than a sentence."
  },
  {
    "ch": 1,
    "type": "study",
    "q": "Which of these belongs inside a chapter's study.html file?",
    "opts": [
      "Only section elements, as a fragment with no page furniture",
      "A complete document with html, head and body elements",
      "A JSON array of section objects",
      "A full page including the sidebar and the script tags"
    ],
    "answer": 0,
    "exp": "Chapter pages are fragments. The generator supplies the document shell, the navigation and the scripts, so a hand-written head or nav would be duplicated at build time."
  },
  {
    "ch": 1,
    "type": "study",
    "q": "A reader finishes a section but the progress counter does not move. What is the most likely cause?",
    "opts": [
      "The section is placed after the hero",
      "The section has no heading",
      "The section is too short to count",
      "The section has no data-track attribute"
    ],
    "answer": 3,
    "exp": "Progress is counted in tracks. A section without a data-track renders normally but contributes nothing to the counter, so a reader can finish it and see no change at all."
  },
  {
    "ch": 1,
    "type": "study",
    "q": "Which block should hold a single self-test question with one correct option?",
    "opts": [
      "quick-check, with each option's data-correct attribute deciding the answer",
      "callout, because a question is an aside",
      "glance-card, because it holds one small item",
      "why-card, using the pro and con variants"
    ],
    "answer": 0,
    "exp": "The quick-check block is the engine's single-question self-test, and exactly one of its options is marked correct while the others carry feedback for the wrong choice."
  },
  {
    "ch": 1,
    "type": "math",
    "q": "A study page has eight sections whose mean word count is 250. Which section length falls outside the balance band?",
    "opts": [
      "100 words",
      "300 words",
      "600 words",
      "450 words"
    ],
    "answer": 2,
    "exp": "The band runs from one third of the mean to twice the mean, so 83 to 500 words when the mean is 250. Only 600 words sits above the band; the other three lengths are inside it."
  },
  {
    "ch": 2,
    "type": "study",
    "q": "What does the data-ix-src attribute of a widget placeholder contain?",
    "opts": [
      "The URL of a separate JSON file",
      "The widget type that should be mounted",
      "The id of the section the widget belongs to",
      "A fragment reference such as #ix-example, pointing at a JSON script block on the same page"
    ],
    "answer": 3,
    "exp": "The engine resolves the fragment against the current document, reads that script block's text content and parses it as the widget configuration."
  },
  {
    "ch": 2,
    "type": "study",
    "q": "Which character must be escaped when it appears inside a JSON string value?",
    "opts": [
      "The hyphen",
      "A double quotation mark",
      "The full stop",
      "The underscore"
    ],
    "answer": 1,
    "exp": "A double quote inside a string ends the string early unless it is escaped with a backslash, and everything after it is then parsed as syntax errors rather than as text."
  },
  {
    "ch": 2,
    "type": "study",
    "q": "A deck widget renders its title but no cards. Which config problem fits that symptom?",
    "opts": [
      "The config block fails to parse as JSON",
      "The placeholder has no data-ix-src attribute",
      "The cards key is missing, empty, or spelled differently",
      "The widget type is not one of the eight supported types"
    ],
    "answer": 2,
    "exp": "A visible title proves the config was found and parsed, so the fault is inside the config: the renderer had no non-empty list of cards to draw."
  },
  {
    "ch": 2,
    "type": "study",
    "q": "Which widget type asks the reader to put steps into the correct order and then checks the result?",
    "opts": [
      "sequence",
      "pipeline",
      "timeline",
      "stepper"
    ],
    "answer": 0,
    "exp": "A sequence is an ordering exercise: the reader arranges the steps and can check the arrangement. A pipeline plays its nodes in order without asking the reader anything."
  },
  {
    "ch": 2,
    "type": "study",
    "q": "Which pair of keys does a race widget require in addition to its title?",
    "opts": [
      "value and display",
      "svg and points",
      "pairs and steps",
      "max and rows"
    ],
    "answer": 3,
    "exp": "Bars are drawn as a proportion of the declared maximum, and each row supplies a name, a numeric value and a display string. Without max there is no denominator and without rows there is nothing to draw; value and display describe one row, not the config."
  },
  {
    "ch": 2,
    "type": "math",
    "q": "A stepper draws a scale with max 8, and the current frame sits at value 6. What fraction of the scale is filled?",
    "opts": [
      "0.60",
      "0.75",
      "1.33",
      "0.86"
    ],
    "answer": 1,
    "exp": "The filled fraction is value divided by max, so 6 divided by 8 is 0.75. The value 1.33 is the inverse ratio and is not the quantity that gets drawn."
  },
  {
    "ch": 3,
    "type": "study",
    "q": "A quiz entry has four options and an answer field holding 3. Which option is marked correct?",
    "opts": [
      "The fourth option",
      "The third option",
      "The second option",
      "The option with the longest text"
    ],
    "answer": 0,
    "exp": "The index is zero-based, so 3 selects the fourth option. Counting options from one is the most common authoring error in the data files and it renders perfectly, which is what makes it dangerous."
  },
  {
    "ch": 3,
    "type": "study",
    "q": "What decides which course a reader's saved progress belongs to?",
    "opts": [
      "The chapter number recorded in each data file",
      "The order of chapters in the manifest",
      "The storageKey declared in the manifest",
      "The file path of the study page"
    ],
    "answer": 2,
    "exp": "Progress is stored under the manifest's storageKey, so two courses on the same machine keep separate records instead of overwriting each other."
  },
  {
    "ch": 3,
    "type": "study",
    "q": "In a kg.json node tuple, what does the third element mean?",
    "opts": [
      "The strength of the node's strongest edge",
      "The difficulty from 1 to 3, which scales how large the node is drawn",
      "The chapter the node belongs to",
      "The number of edges attached to the node"
    ],
    "answer": 1,
    "exp": "The tuple runs id, chapter, difficulty, label, definition and link. Difficulty only scales the drawn radius, which is why its range is narrow."
  },
  {
    "ch": 3,
    "type": "study",
    "q": "An edge in kg.json is written as a pair of ids followed by 7. What does the 7 mean?",
    "opts": [
      "The chapter in which both concepts are taught",
      "The number of paragraphs that mention the concepts",
      "The node id of the second endpoint",
      "The strength of the relationship, on a scale from 4 to 9"
    ],
    "answer": 3,
    "exp": "The third element of an edge is a strength, not a chapter. Values below 4 fall under the graph's default threshold and are never drawn, so a chapter number in that slot deletes the edge."
  },
  {
    "ch": 3,
    "type": "math",
    "q": "Six quiz entries have four options each. What score should a reader who guesses every answer expect?",
    "opts": [
      "0.00",
      "0.50",
      "0.25",
      "0.167"
    ],
    "answer": 2,
    "exp": "Each guess is correct with probability one quarter, so the expected number of correct answers is six quarters, or 1.5, and the expected score is 1.5 divided by 6, which is 0.25."
  },
  {
    "ch": 3,
    "type": "math",
    "q": "Review intervals follow I_k = I_0 times r^k, with I_0 equal to 2 days and r equal to 3. Which interval is the third review?",
    "opts": [
      "18 days",
      "6 days",
      "54 days",
      "12 days"
    ],
    "answer": 0,
    "exp": "Counting from k = 0, the third interval has k = 2, so it is 2 times 3 squared, which is 18 days. The value 54 days is the fourth interval, one step further along."
  }
];
