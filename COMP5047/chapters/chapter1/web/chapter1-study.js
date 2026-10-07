(function () {
  "use strict";

  /* COMP5047 — Week 1 page behaviour.
   *
   * The declarative widgets (timeline, hotspot, race, matcher, sequence,
   * pipeline, deck) are mounted by shared/interactive.js from the JSON config
   * blocks in the page. This file owns the two animated canvas steppers and the
   * re-binding that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initErasStepper();
    initCalmStepper();
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
    initErasStepper();
    initCalmStepper();
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
    if (!window.initCOMP5047ChapterUI) return;
    try {
      window.initCOMP5047ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[COMP5047 chapter 1] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Stepper 1: Weiser's three eras ─────────────────────────── */

  function initErasStepper() {
    var host = document.getElementById("ix-eras");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-eras", {
      title: "Three eras of computing",
      subtitle: "Weiser's framing: the ratio between people and machines inverts.",
      height: 270,
      frames: [
        {
          title: "Mainframe — many people, one machine",
          caption: "Users queue for time on a shared machine that lives in a machine room. Interaction means preparing a job and waiting for the result.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 + 4;
            var spread = Math.min(w / 2 - 44, 200);

            k.box(cx - 92, cy - 46, 184, 92, { fill: "#e6f2f5", stroke: "#0e7490", lw: 2, r: 12 });
            k.label(cx, cy - 14, "MAINFRAME", { align: "center", size: 13, mono: true, color: "#0e7490" });
            k.label(cx, cy + 12, "1 computer", { align: "center", size: 11, color: "#565d75" });
            k.label(cx, cy + 32, "n users", { align: "center", size: 11, color: "#565d75" });

            var terminals = [-1, 0, 1];
            terminals.forEach(function (i) {
              var x = cx + i * spread;
              k.box(x - 26, cy - 122, 52, 34, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.6, r: 6 });
              k.label(x, cy - 105, "term", { align: "center", size: 10, mono: true, color: "#565d75" });
              k.arrow(x, cy - 84, cx + i * 40, cy - 50, { color: "#94a3b8", dash: [4, 4], lw: 1.4 });
            });
            terminals.forEach(function (i) {
              if (i === 0) return;
              var x = cx + i * spread;
              k.box(x - 26, cy + 88, 52, 34, { fill: "#ffffff", stroke: "#94a3b8", lw: 1.6, r: 6 });
              k.label(x, cy + 105, "term", { align: "center", size: 10, mono: true, color: "#565d75" });
              k.arrow(x, cy + 86, cx + i * 40, cy + 50, { color: "#94a3b8", dash: [4, 4], lw: 1.4 });
            });
          }
        },
        {
          title: "PC — one person, one machine",
          caption: "The machine moves onto the desk. It is switched on when needed, it is general purpose, and it competes for the full attention of one user.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 + 10;
            var slots = [0.2, 0.5, 0.8];
            slots.forEach(function (frac) {
              var x = w * frac;
              k.box(x - 34, cy - 74, 68, 50, { fill: "#e6f2f5", stroke: "#0e7490", lw: 1.8, r: 6 });
              k.label(x, cy - 49, "PC", { align: "center", size: 12, mono: true, color: "#0e7490" });
              k.box(x - 52, cy - 18, 104, 8, { fill: "#cbd5e1", stroke: "#94a3b8", lw: 1.2, r: 4 });
              k.dot(x, cy + 34, 13, { fill: "#ffffff", stroke: "#0e7490", lw: 2 });
              k.arrow(x, cy + 16, x, cy - 18, { color: "#0891b2", lw: 1.8 });
            });
            k.label(w / 2, h - 18, "1 person : 1 machine, attention on the screen", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "Ubiquitous computing — one person, many machines",
          caption: "The machines leave the desk and spread into the environment. There is no single device holding the whole state, and no single screen asking for attention.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.box(24, 24, w - 48, h - 48, { stroke: "#0e7490", lw: 2, r: 14 });
            k.label(40, 42, "the environment", { size: 11, mono: true, color: "#0e7490" });

            var spots = [
              [0.16, 0.3], [0.32, 0.66], [0.5, 0.26], [0.66, 0.7],
              [0.84, 0.36], [0.24, 0.82], [0.76, 0.84], [0.9, 0.64]
            ];
            spots.forEach(function (s, i) {
              var x = 24 + (w - 48) * s[0];
              var y = 24 + (h - 48) * s[1];
              k.arrow(cx, cy, x, y, { color: "rgba(148,163,184,0.65)", dash: [3, 5], lw: 1.2 });
              k.dot(x, y, 8, { fill: "#0891b2", stroke: "#0e7490", lw: 1.4 });
              k.label(x, y - 18, "dev " + (i + 1), { align: "center", size: 9, mono: true, color: "#565d75" });
            });

            k.dot(cx, cy, 20, { fill: "#ffffff", stroke: "#0e7490", lw: 2.4 });
            k.label(cx, cy, "you", { align: "center", size: 11, color: "#0e7490" });
            k.label(w / 2, h - 12, "n machines : 1 person", { align: "center", size: 11, color: "#565d75" });
          }
        },
        {
          title: "Now what? The vision is largely realised",
          caption: "The deck's closing question: if computers really are everywhere, the interesting work moves from building the box to designing the behaviour — and to deciding whose situation the system serves.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.box(24, 24, w - 48, h - 48, { stroke: "#0e7490", lw: 2, r: 14 });
            var spots = [
              [0.14, 0.34], [0.28, 0.72], [0.46, 0.24], [0.62, 0.76],
              [0.8, 0.32], [0.88, 0.66]
            ];
            spots.forEach(function (s) {
              var x = 24 + (w - 48) * s[0];
              var y = 24 + (h - 48) * s[1];
              k.dot(x, y, 7, { fill: "#0891b2", stroke: "#0e7490", lw: 1.3 });
              k.arrow(x, y, cx, cy, { color: "rgba(148,163,184,0.5)", dash: [3, 5], lw: 1.1 });
            });
            k.label(cx, cy - 6, "?", { align: "center", size: 58, weight: "700", color: "#0e7490" });
            k.label(cx, cy + 38, "design the interaction, not the box", {
              align: "center",
              size: 12,
              color: "#565d75"
            });
            k.label(cx, cy + 60, "and ask who the system is for", {
              align: "center",
              size: 12,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: calm technology and the periphery ───────────── */

  function initCalmStepper() {
    var host = document.getElementById("ix-calm");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-calm", {
      title: "Calm technology: centre and periphery",
      subtitle: "Information can sit at the edge of attention and still be available.",
      height: 230,
      frames: [
        {
          title: "Everything at the centre",
          caption: "Every signal is an interruption: a notification, an alarm, a modal dialog. Attention is fully occupied by the technology.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.dot(cx, cy, Math.min(w, h) * 0.3, { fill: "rgba(8,145,178,0.10)", stroke: "#0e7490", lw: 2 });
            k.label(cx, cy - 52, "CENTRE", { align: "center", size: 11, mono: true, color: "#0e7490" });
            k.box(cx - 34, cy - 34, 68, 46, { fill: "#ffffff", stroke: "#0e7490", lw: 2, r: 8 });
            k.label(cx, cy - 11, "!", { align: "center", size: 22, weight: "700", color: "#dc2626" });
            k.label(cx, cy + 34, "your task is pushed out", { align: "center", size: 11, color: "#565d75" });
            [0.08, 0.5, 0.92].forEach(function (f) {
              k.box(w * f - 22, h - 26, 44, 14, { fill: "#e2e8f0", stroke: "#cbd5e1", lw: 1, r: 4 });
            });
          }
        },
        {
          title: "Move the same information to the edge",
          caption: "The signal is still there, but it waits at the boundary of attention instead of taking the middle.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2;
            k.dot(cx, cy, Math.min(w, h) * 0.3, { fill: "rgba(5,150,105,0.10)", stroke: "#059669", lw: 2 });
            k.label(cx, cy - 30, "CENTRE", { align: "center", size: 11, mono: true, color: "#059669" });
            k.label(cx, cy + 2, "what you are doing", { align: "center", size: 12, color: "#565d75" });
            k.arrow(cx, cy + 30, w - 60, h - 44, { color: "#0891b2", lw: 1.8 });
            k.dot(w - 46, h - 34, 11, { fill: "#0891b2", stroke: "#0e7490", lw: 1.6 });
            k.label(w - 46, h - 58, "periphery", { align: "center", size: 11, mono: true, color: "#0e7490" });
            k.label(cx, 26, "the information keeps existing — it just stops shouting", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "Encode it in the environment",
          caption: "A change in light, sound, movement or temperature carries the state. You can read it when you choose to, and ignore it when you cannot.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bands = ["#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9"];
            var bw = (w - 48) / bands.length;
            bands.forEach(function (c, i) {
              k.box(24 + i * bw, h - 62, bw - 4, 26, { fill: c, stroke: "#0e7490", lw: 1, r: 6 });
            });
            k.label(24, h - 76, "a wall that shifts colour as the room fills", { size: 11, color: "#565d75" });

            var cx = w / 2;
            var cy = h / 2 - 26;
            k.dot(cx - 60, cy, 16, { fill: "#ffffff", stroke: "#0e7490", lw: 2 });
            k.label(cx - 60, cy, "you", { align: "center", size: 10, color: "#0e7490" });
            [0, 1, 2].forEach(function (i) {
              k.arrow(cx - 34 + i * 8, cy, cx + 40 + i * 10, cy, { color: "rgba(8,145,178,0.55)", lw: 1.4 });
            });
            k.label(cx + 82, cy, "a sound that rises", { size: 11, color: "#565d75" });
            k.label(cx - 60, cy + 34, "attention stays on the task", { align: "center", size: 11, color: "#565d75" });
          }
        },
        {
          title: "Calm technology",
          caption: "Information moves between centre and periphery as relevance changes. Weiser and Brown's 1996 design counterpart to the ubicomp vision.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 + 6;
            var r = Math.min(w * 0.3, h * 0.42);
            k.dot(cx, cy, r, { fill: "rgba(8,145,178,0.08)", stroke: "#0e7490", lw: 2 });
            k.dot(cx, cy, r * 0.45, { fill: "rgba(5,150,105,0.12)", stroke: "#059669", lw: 2 });
            k.label(cx, cy - 6, "centre", { align: "center", size: 11, mono: true, color: "#059669" });
            k.label(cx, cy + 12, "periphery", { align: "center", size: 11, mono: true, color: "#0e7490" });
            k.arrow(cx - r * 0.45 - 6, cy, cx - r + 8, cy, { color: "#0891b2", lw: 1.8 });
            k.arrow(cx + r - 8, cy, cx + r * 0.45 + 6, cy, { color: "#0891b2", lw: 1.8 });
            k.label(cx, cy + r + 22, "attention moves both ways, on the person's terms", {
              align: "center",
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }
})();
