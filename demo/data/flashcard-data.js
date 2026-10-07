/* DEMO101 — spaced-repetition deck. Generated from the content pack. */
var FLASHCARD_DECK_VERSION = "demo101-1";
var ALL_FLASHCARD_DATA = [
  {
    "ch": 1,
    "front": "What is a content pack?",
    "back": "One folder holding course.json, a chapters tree and a data folder. Every page in the hub is generated from files inside that folder and nothing else."
  },
  {
    "ch": 1,
    "front": "What makes a section visible to the sidebar and the progress bar?",
    "back": "A unique data-track value. The track is both the progress unit and the key the navigation uses; an untracked section still renders but never counts."
  },
  {
    "ch": 1,
    "front": "How many sections does each page type hold?",
    "back": "Six to nine sections on a study page, including the hero, and five to seven on a foundations page."
  },
  {
    "ch": 1,
    "front": "Why keep the section-title heading to two to four words?",
    "back": "Its text becomes the sidebar label. A sidebar entry has to be readable at a glance, so a sentence makes the navigation worse the longer it gets."
  },
  {
    "ch": 1,
    "front": "When should the data files be written?",
    "back": "After the pages stop moving. Quiz entries, flashcards and graph nodes all quote anchors, so data written against a draft has to be rewritten."
  },
  {
    "ch": 2,
    "front": "Which two elements declare a widget?",
    "back": "A placeholder carrying data-ix and data-ix-src, and a script block of type application/json holding the configuration that placeholder points at."
  },
  {
    "ch": 2,
    "front": "What happens when a widget config fails to parse?",
    "back": "Nothing mounts, so the placeholder stays an empty box. The page renders normally and reports nothing, which is why parsing the block on its own is the first debugging step."
  },
  {
    "ch": 2,
    "front": "What does the max of a stepper's scale mean?",
    "back": "The ceiling of the scale. Every frame's value is read against it, and the drawn position is the current value divided by that maximum. A stepper is mounted from a chapter script rather than declared, so its scale lives in the drawing code, not in a config key."
  },
  {
    "ch": 2,
    "front": "How does a hotspot widget position its markers?",
    "back": "With x and y expressed as percentages of the drawing box, so the diagram keeps working at any width instead of breaking on a narrow window."
  },
  {
    "ch": 2,
    "front": "When does a chapter need its own script?",
    "back": "Only when the page needs behaviour that no declarative widget expresses. Most chapters need none; when one does, the script mounts its widget into an element it finds by id."
  },
  {
    "ch": 3,
    "front": "What makes a quiz explanation useful?",
    "back": "It gives the reason the correct answer is correct, in a sentence a reader could repeat out loud. Restating the correct option teaches nothing."
  },
  {
    "ch": 3,
    "front": "Why is the quiz answer field zero-based?",
    "back": "Because it indexes the options array, where the first option sits at position 0. An index equal to the number of options marks nothing at all."
  },
  {
    "ch": 3,
    "front": "What is the order of a node tuple in the graph data?",
    "back": "Identifier, chapter, difficulty from 1 to 3, label, one-line definition, and a relative link to a real anchor on one of your pages."
  },
  {
    "ch": 3,
    "front": "What does an edge strength control?",
    "back": "Whether the edge is drawn at all, and how prominently. The default threshold hides anything weaker than 4, so a chapter number in that slot silently removes the edge."
  },
  {
    "ch": 3,
    "front": "Why only five flashcards per chapter?",
    "back": "Small decks get finished. Five cards that are genuinely reviewed beat forty that are abandoned in the first week, and spacing does the rest of the work."
  }
];
