(function () {
  "use strict";

  /* INFO5995 — Week 2 page behaviour.
   *
   * The declarative widgets (pipeline, sequence, matcher, race) are mounted by
   * shared/interactive.js from the JSON config blocks in the page. This file owns
   * the three animated canvas steppers and the re-binding a language swap needs.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure in
     * it must not stop the page's own animations from mounting. */
    initReasoningStepper();
    initAgentStepper();
    initFailureStepper();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every widget and
   * every quick-check inside a translated section is a brand-new node. Re-mount
   * the widgets and re-run the chrome bindings; the sidebar toggle lives outside
   * any section, so its old listener is dropped first to avoid double-binding. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    initReasoningStepper();
    initAgentStepper();
    initFailureStepper();
    rebindChrome();
  });

  var lastChromeLang = null;

  function currentLang() {
    return typeof window.getLang === "function" ? window.getLang() : "en";
  }

  function rebindChrome() {
    var lang = currentLang();
    if (lang === lastChromeLang) return;
    lastChromeLang = lang;

    var toggle = document.getElementById("sidebarToggle");
    if (toggle && toggle.parentNode) {
      var fresh = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(fresh, toggle);
    }
    initChrome();
  }

  function initChrome() {
    if (!window.initINFO5995ChapterUI) return;
    try {
      window.initINFO5995ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[INFO5995 chapter 2] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* Shared palette — kept local so the canvas does not depend on CSS parsing. */
  var COL = {
    accent: "#059669",
    accentDark: "#047857",
    blue: "#2563eb",
    teal: "#0e7490",
    purple: "#7c3aed",
    green: "#10b981",
    amber: "#f59e0b",
    red: "#dc2626",
    slate: "#94a3b8",
    ink: "#141826",
    muted: "#565d75",
    panel: "#f6fbf9"
  };

  /* Encode an abstract "how long did it run" quantity as a row of blocks. */
  function pulseRow(k, x, y, count, opts) {
    opts = opts || {};
    var cw = opts.w || 9;
    var gap = opts.gap == null ? 4 : opts.gap;
    var h = opts.h || 16;
    for (var i = 0; i < count; i++) {
      k.box(x + i * (cw + gap), y, cw, h, {
        fill: i % 3 === 2 ? opts.fill || "rgba(124,58,237,0.20)" : opts.track || "rgba(148,163,184,0.28)",
        r: 2
      });
    }
  }

  /* ── Stepper 1: what a reasoning model actually does ─────────── */

  function initReasoningStepper() {
    var host = document.getElementById("ix-reasoning");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-reasoning", {
      title: "From immediate answer to internal reasoning",
      subtitle: "The deck's four observable properties, drawn as an execution path.",
      height: 250,
      frames: [
        {
          title: "1. A plain response: prompt in, answer out",
          caption: "The prompt is read and the answer is produced from the surface of what was supplied. Cheap, fast, and only as deep as the prompt.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 6;
            k.box(24, cy - 34, 130, 68, { fill: COL.panel, stroke: COL.teal, lw: 1.8, r: 10 });
            k.label(89, cy - 10, "prompt", { align: "center", size: 12, mono: true, color: COL.teal });
            k.label(89, cy + 12, "code + question", { align: "center", size: 10, color: COL.muted });

            k.box(w - 154, cy - 34, 130, 68, { fill: "#ffffff", stroke: COL.slate, lw: 1.6, r: 10 });
            k.label(w - 89, cy - 10, "response", { align: "center", size: 12, mono: true, color: COL.muted });
            k.label(w - 89, cy + 12, "immediate", { align: "center", size: 10, color: COL.muted });

            k.box(w / 2 - 60, cy - 30, 120, 60, { fill: "rgba(5,150,105,0.10)", stroke: COL.accent, lw: 1.8, r: 12 });
            k.label(w / 2, cy, "LLM", { align: "center", size: 15, mono: true, color: COL.accentDark });

            k.arrow(158, cy, w / 2 - 64, cy, { color: COL.slate, lw: 1.6 });
            k.arrow(w / 2 + 64, cy, w - 158, cy, { color: COL.slate, lw: 1.6 });
            k.label(w / 2, h - 22, "one pass — no space to trace a value across several files", {
              align: "center",
              size: 11,
              color: COL.muted
            });
          }
        },
        {
          title: "2. Internal scratchpad before it speaks",
          caption: "The model is given room to work privately first. That internal work can be long — hundreds or thousands of tokens.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 10;
            k.box(24, cy - 30, 118, 60, { fill: COL.panel, stroke: COL.teal, lw: 1.8, r: 10 });
            k.label(83, cy, "prompt", { align: "center", size: 12, mono: true, color: COL.teal });

            k.box(w / 2 - 135, cy - 46, 270, 92, {
              fill: "rgba(124,58,237,0.08)",
              stroke: COL.purple,
              lw: 2,
              r: 12
            });
            k.label(w / 2, cy - 30, "internal scratchpad (typically hidden)", {
              align: "center",
              size: 11,
              mono: true,
              color: COL.purple
            });
            pulseRow(k, w / 2 - 118, cy - 12, 22, { w: 9, gap: 4, h: 14 });
            pulseRow(k, w / 2 - 118, cy + 10, 22, { w: 9, gap: 4, h: 14 });

            k.box(w - 142, cy - 30, 118, 60, { fill: "#ffffff", stroke: COL.slate, lw: 1.6, r: 10 });
            k.label(w - 83, cy, "response", { align: "center", size: 12, mono: true, color: COL.muted });

            k.arrow(146, cy, w / 2 - 139, cy, { color: COL.slate, lw: 1.6 });
            k.arrow(w / 2 + 139, cy, w - 146, cy, { color: COL.slate, lw: 1.6 });
            k.label(w / 2, h - 16, "hundreds to thousands of tokens of work you cannot audit directly", {
              align: "center",
              size: 11,
              color: COL.muted
            });
          }
        },
        {
          title: "3. A visible indicator and a controllable effort setting",
          caption: "You may see a “thinking” indicator while it works, and effort is often selectable — low, medium or high in some variants.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 22;
            k.label(24, cy - 44, "effort setting", { size: 11, mono: true, color: COL.purple });

            var lanes = ["low", "medium", "high"];
            var laneH = 24;
            lanes.forEach(function (name, i) {
              var y = cy - 26 + i * (laneH + 10);
              k.box(24, y, 96, laneH, { fill: "#ffffff", stroke: COL.slate, lw: 1.4, r: 6 });
              k.label(72, y + laneH / 2, name, { align: "center", size: 11, mono: true, color: COL.muted });
              k.bar(132, y + 5, w - 240, laneH - 10, (i + 1) / 3, {
                max: 1,
                fill: i === 2 ? COL.purple : i === 1 ? COL.teal : COL.slate,
                track: "rgba(148,163,184,0.20)"
              });
              k.label(w - 96, y + laneH / 2, (i + 1) + "\u00d7 work", { size: 10, mono: true, color: COL.muted });
            });

            k.label(w / 2, h - 20, "more reasoning can improve performance — it does not guarantee a correct answer", {
              align: "center",
              size: 11,
              color: COL.red
            });
          }
        },
        {
          title: "4. The aha moment for security",
          caption: "After o3-class and R1-class models: things that did not work before start to work, and real vulnerabilities are found at scale — still unverified until a human checks them.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var baseY = h - 52;
            k.arrow(34, baseY, w - 24, baseY, { color: COL.slate, lw: 1.4 });
            k.arrow(34, baseY, 34, 26, { color: COL.slate, lw: 1.4 });
            k.label(34, 16, "findings that a single pass can reach", { size: 10, color: COL.muted });

            var bars = [0.16, 0.34, 0.58, 0.82, 0.94];
            var bw = (w - 96) / (bars.length * 1.6);
            bars.forEach(function (v, i) {
              var x = 56 + i * (bw * 1.6);
              var bh = (baseY - 40) * v;
              k.box(x, baseY - bh, bw, bh, {
                fill: i < 2 ? "rgba(148,163,184,0.35)" : "rgba(5,150,105,0.55)",
                stroke: i < 2 ? COL.slate : COL.accentDark,
                lw: 1.2,
                r: 4
              });
              k.label(x + bw / 2, baseY + 14, "gen " + (i + 1), { align: "center", size: 9, mono: true, color: COL.muted });
            });
            k.label(w - 30, 30, "reasoning depth \u2192", { align: "right", size: 10, mono: true, color: COL.purple });
            k.label(w / 2, h - 14, "grey: pattern matching only   green: multi-step reasoning", {
              align: "center",
              size: 10,
              color: COL.muted
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: from reasoning to an agent that gathers evidence ─ */

  function initAgentStepper() {
    var host = document.getElementById("ix-agent-loop");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-agent-loop", {
      title: "An AI agent gathering evidence with a tool",
      subtitle: "“What files are in this folder?” — the tool supplies the facts, the model decides what to do next.",
      height: 280,
      frames: [
        {
          title: "1. Reasoning alone is not enough",
          caption: "The repository is thousands of files that depend on each other, and the context window is small. Pasting the target in is not an option.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(24, 26, w - 48, h - 74, { stroke: COL.red, lw: 1.8, r: 12, fill: "rgba(220,38,38,0.04)" });
            k.label(40, 46, "code repository", { size: 11, mono: true, color: COL.red });

            var cells = 6 * 4;
            var cw = (w - 96) / 6;
            for (var i = 0; i < cells; i++) {
              var cx = 48 + (i % 6) * cw;
              var cy = 66 + Math.floor(i / 6) * 26;
              k.box(cx, cy, cw - 8, 18, { fill: "rgba(148,163,184,0.25)", stroke: COL.slate, lw: 1, r: 3 });
            }
            k.label(w - 40, 46, "thousands of files", { align: "right", size: 10, mono: true, color: COL.red });

            k.box(w / 2 - 108, h - 62, 216, 40, { fill: "#ffffff", stroke: COL.red, lw: 1.6, r: 10 });
            k.label(w / 2, h - 42, "context window: too small to hold it", {
              align: "center",
              size: 11,
              mono: true,
              color: COL.red
            });
          }
        },
        {
          title: "2. The model decides to call a tool",
          caption: "Instead of guessing, it emits a tool-call instruction — here, a listing command — and waits for the result.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 18;
            k.box(24, cy - 52, 178, 104, { fill: COL.panel, stroke: COL.teal, lw: 1.8, r: 10 });
            k.label(113, cy - 34, "system prompt", { align: "center", size: 11, mono: true, color: COL.teal });
            k.code(38, cy - 8, [
              "You are an AI agent with",
              "terminal access, return",
              "tool calls between",
              "<tool></tool>"
            ], { size: 9.5, lh: 15, color: COL.muted });

            k.box(w / 2 - 52, cy - 34, 104, 68, { fill: "rgba(5,150,105,0.10)", stroke: COL.accent, lw: 1.8, r: 12 });
            k.label(w / 2, cy - 6, "LLM", { align: "center", size: 14, mono: true, color: COL.accentDark });
            k.label(w / 2, cy + 14, "decides", { align: "center", size: 10, color: COL.muted });

            k.box(w - 202, cy - 52, 178, 104, { fill: "#ffffff", stroke: COL.amber, lw: 1.8, r: 10 });
            k.label(w - 113, cy - 32, "tool call", { align: "center", size: 11, mono: true, color: COL.amber });
            k.code(w - 190, cy - 6, ["ls"], { size: 13, lh: 16, color: COL.ink });
            k.label(w - 113, cy + 32, "I need to check the current directory", {
              align: "center",
              size: 9,
              color: COL.muted
            });

            k.arrow(206, cy, w / 2 - 56, cy, { color: COL.slate, lw: 1.6 });
            k.arrow(w / 2 + 56, cy, w - 206, cy, { color: COL.amber, lw: 1.8 });
            k.label(w / 2, h - 14, "evidence gathering, not answering", {
              align: "center",
              size: 11,
              color: COL.muted
            });
          }
        },
        {
          title: "3. The tool returns evidence",
          caption: "main.py, README.md, data.txt. These are facts about the system that the model did not have to invent — which is exactly why the tool matters.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 24;
            k.box(24, cy - 34, 150, 68, { fill: "#ffffff", stroke: COL.amber, lw: 1.8, r: 10 });
            k.label(99, cy - 10, "tool executor", { align: "center", size: 11, mono: true, color: COL.amber });
            k.label(99, cy + 12, "$ ls", { align: "center", size: 12, mono: true, color: COL.ink });

            k.arrow(178, cy, 232, cy, { color: COL.amber, lw: 1.8 });

            k.box(236, cy - 34, 168, 68, { fill: "rgba(148,163,184,0.14)", stroke: COL.slate, lw: 1.6, r: 10 });
            k.label(320, cy - 20, "tool result", { align: "center", size: 11, mono: true, color: COL.muted });
            k.code(252, cy - 2, ["main.py", "README.md", "data.txt"], { size: 10.5, lh: 14, color: COL.ink });

            k.box(w - 176, cy - 34, 152, 68, { fill: "rgba(5,150,105,0.10)", stroke: COL.accent, lw: 1.8, r: 10 });
            k.label(w - 100, cy - 10, "LLM", { align: "center", size: 12, mono: true, color: COL.accentDark });
            k.label(w - 100, cy + 12, "reasons over it", { align: "center", size: 10, color: COL.muted });

            k.arrow(408, cy, w - 180, cy, { color: COL.slate, lw: 1.6 });
            k.label(w / 2, h - 14, "the tool gathers evidence; the AI uses that evidence to decide what to do next", {
              align: "center",
              size: 11,
              color: COL.muted
            });
          }
        },
        {
          title: "4. Where is the security boundary enforced?",
          caption: "Before any of it: is the AI authorised to act? The scope, the permitted tools and the actions it may never take are a design decision, not a default.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(24, 24, w - 48, h - 52, { stroke: COL.accent, lw: 2, r: 14, fill: "rgba(5,150,105,0.04)" });
            k.label(40, 44, "authorised scope", { size: 11, mono: true, color: COL.accentDark });

            var items = [
              ["read-only mounts", true],
              ["allow-listed commands", true],
              ["in-scope targets only", true],
              ["credential isolation", true],
              ["production writes", false],
              ["anything out of scope", false]
            ];
            items.forEach(function (it, i) {
              var x = 48 + (i % 3) * ((w - 96) / 3);
              var y = 72 + Math.floor(i / 3) * 52;
              var cw2 = (w - 96) / 3 - 14;
              k.box(x, y, cw2, 38, {
                fill: it[1] ? "rgba(5,150,105,0.10)" : "rgba(220,38,38,0.08)",
                stroke: it[1] ? COL.accent : COL.red,
                lw: 1.5,
                r: 8
              });
              k.label(x + 12, y + 19, (it[1] ? "\u2713 " : "\u2715 ") + it[0], {
                size: 11,
                color: it[1] ? COL.accentDark : COL.red
              });
            });

            k.label(w / 2, h - 24, "more cyber capability requires more trust — and a place that enforces the limit", {
              align: "center",
              size: 11,
              color: COL.muted
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: the three failure modes and their responses ─── */

  function initFailureStepper() {
    var host = document.getElementById("ix-failure");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-failure", {
      title: "Three failure modes, three countermeasures",
      subtitle: "Learn each one as a problem-and-response pair — that is how it appears in a question.",
      height: 260,
      frames: [
        {
          title: "Lazy — the model stops at the first obvious issue",
          caption: "It was trained not to work for too long, so depth has to be requested explicitly. Summarise what has already been checked, then ask for new, different, edge-case and non-obvious logic flaws.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 24;
            k.label(24, cy - 40, "review depth requested", { size: 11, mono: true, color: COL.amber });
            var levels = ["obvious issue", "edge cases", "non-obvious logic"];
            levels.forEach(function (name, i) {
              var y = cy - 22 + i * 36;
              k.box(24, y, 168, 28, {
                fill: i === 0 ? "rgba(245,158,11,0.16)" : "#ffffff",
                stroke: i === 0 ? COL.amber : COL.slate,
                lw: 1.5,
                r: 6
              });
              k.label(108, y + 14, name, { align: "center", size: 10.5, color: i === 0 ? COL.amber : COL.muted });
              k.bar(208, y + 7, w - 320, 14, i === 0 ? 0.95 : 0.08, {
                max: 1,
                fill: i === 0 ? COL.amber : "rgba(148,163,184,0.45)",
                track: "rgba(148,163,184,0.18)"
              });
              k.label(w - 100, y + 14, i === 0 ? "default" : "only if asked", {
                size: 9.5,
                mono: true,
                color: COL.muted
              });
            });
            k.label(w / 2, h - 18, "fix: keep a checked-so-far table, then ask explicitly for what is missing", {
              align: "center",
              size: 11,
              color: COL.accentDark
            });
          }
        },
        {
          title: "Hallucinating — it reports fake vulnerabilities",
          caption: "A convincing narrative with no path through the code. Fix: demand concrete proof — a minimal reproducible example and the exact execution trace.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 26;
            k.box(24, cy - 44, w - 48, 88, {
              fill: "rgba(220,38,38,0.05)",
              stroke: COL.red,
              lw: 1.8,
              r: 12
            });
            k.label(40, cy - 24, "reported finding", { size: 11, mono: true, color: COL.red });
            k.code(44, cy + 2, [
              "\"Critical SQL injection in the user search function;",
              " user input is concatenated into the query string.\""
            ], { size: 11, lh: 17, color: COL.ink });

            var gates = ["file + line", "data path", "execution trace", "minimal repro"];
            var gw = (w - 96) / gates.length;
            gates.forEach(function (g, i) {
              var x = 48 + i * gw;
              k.box(x, h - 74, gw - 12, 34, {
                fill: "rgba(148,163,184,0.14)",
                stroke: COL.slate,
                lw: 1.4,
                r: 6
              });
              k.label(x + (gw - 12) / 2, h - 57, g, { align: "center", size: 10, mono: true, color: COL.muted });
            });
            k.label(w / 2, h - 20, "no artefact attached \u2192 still a hypothesis, not a vulnerability", {
              align: "center",
              size: 11,
              color: COL.red
            });
          }
        },
        {
          title: "Missing things — it overlooks vulnerabilities",
          caption: "Fix: run multiple times, change the phrasing, use different models, use different temperatures, and ask the model to critique its own answer.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 30;
            k.label(24, cy - 34, "the same target, reviewed repeatedly", { size: 11, mono: true, color: COL.purple });

            var passes = 4;
            var pw = (w - 80) / passes;
            var found = [2, 1, 3, 2];
            found.forEach(function (n, i) {
              var x = 32 + i * pw;
              k.box(x, cy - 10, pw - 16, 74, {
                fill: i % 2 === 0 ? "rgba(5,150,105,0.10)" : "rgba(37,99,235,0.08)",
                stroke: i % 2 === 0 ? COL.accent : COL.blue,
                lw: 1.5,
                r: 8
              });
              k.label(x + (pw - 16) / 2, cy + 12, "pass " + (i + 1), {
                align: "center",
                size: 10.5,
                mono: true,
                color: i % 2 === 0 ? COL.accentDark : COL.blue
              });
              k.label(x + (pw - 16) / 2, cy + 36, n + " new", { align: "center", size: 11, color: COL.muted });
              k.label(x + (pw - 16) / 2, cy + 54, ["same prompt", "rephrased", "other model", "higher temp"][i], {
                align: "center",
                size: 9,
                color: COL.muted
              });
            });

            k.label(w / 2, h - 22, "non-determinism becomes a coverage technique instead of a defect", {
              align: "center",
              size: 11,
              color: COL.accentDark
            });
          }
        },
        {
          title: "Sensitive to framing, starved of context",
          caption: "Bad prompts give shallow answers; partial code gives shallow analysis. Fix: rewrite the prompt around the artefact, the contract and a defined output format.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 26;
            k.box(24, cy - 40, (w - 68) / 2, 84, {
              fill: "rgba(220,38,38,0.05)",
              stroke: COL.red,
              lw: 1.6,
              r: 10
            });
            k.label(24 + (w - 68) / 4, cy - 22, "weak framing", { align: "center", size: 11, mono: true, color: COL.red });
            k.code(38, cy - 2, ["\"Find the", " vulnerabilities.\""], { size: 11, lh: 16, color: COL.muted });

            k.box(w / 2 + 10, cy - 40, (w - 68) / 2, 84, {
              fill: "rgba(5,150,105,0.08)",
              stroke: COL.accent,
              lw: 1.6,
              r: 10
            });
            k.label(w / 2 + 10 + (w - 68) / 4, cy - 22, "strong framing", { align: "center", size: 11, mono: true, color: COL.accentDark });
            k.code(w / 2 + 24, cy - 2, [
              "\"Review this module for untrusted",
              " input reaching a query; give file,",
              " line, path, trigger \u2014 or say none.\""
            ], { size: 9.5, lh: 16, color: COL.muted });

            k.label(w / 2, h - 20, "the output format is part of the specification, not a nicety", {
              align: "center",
              size: 11,
              color: COL.muted
            });
          }
        }
      ]
    });
  }
})();
