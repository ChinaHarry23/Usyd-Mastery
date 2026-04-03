export default [
  {
    files: ["shared/**/*.js", "scripts/**/*.js", "tests/**/*.js", "sw.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        // Browser APIs
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        indexedDB: "readonly",
        fetch: "readonly",
        caches: "readonly",
        self: "readonly",
        location: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Blob: "readonly",
        FileReader: "readonly",
        DOMParser: "readonly",
        HTMLElement: "readonly",
        Response: "readonly",
        Promise: "readonly",
        IntersectionObserver: "readonly",
        MutationObserver: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        Image: "readonly",
        TextDecoder: "readonly",
        DataTransfer: "readonly",
        btoa: "readonly",
        atob: "readonly",
        alert: "readonly",
        confirm: "readonly",
        performance: "readonly",
        // CDN-loaded libraries
        renderMathInElement: "readonly",
        DOMPurify: "readonly",
        pdfjsLib: "readonly",
        katex: "readonly",
        // Cross-script module globals (loaded via separate <script> tags)
        FlashcardSRS: "readonly",
        MasteryStorage: "readonly",
        ALL_FLASHCARD_DATA: "readonly",
        ALL_QUIZ_DATA: "readonly",
        FLASHCARD_DECK_VERSION: "readonly",
        FLASHCARD_CONFIG: "readonly",
        QUIZ_CONFIG: "readonly",
        KG_CONFIG: "readonly",
        DASHBOARD_CONFIG: "readonly",
        CHAPTER_MANIFEST: "readonly",
        getLang: "readonly",
        PROGRESS_TRACKER_CONFIG: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
      "no-empty": ["error", { allowEmptyCatch: true }],
      "eqeqeq": ["warn", "smart"],
      "no-var": "off",
      "no-undef": "error",
      "no-redeclare": "warn",
      "no-shadow": "off"
    }
  },
  {
    files: ["scripts/**/*.js", "tests/**/*.js"],
    languageOptions: {
      globals: {
        process: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly"
      }
    }
  }
];
