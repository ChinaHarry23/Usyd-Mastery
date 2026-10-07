(function () {
  "use strict";

  /* ELEC5620 — Week 7 page behaviour.
   *
   * The declarative widgets (matcher, deck, pipeline, hotspot, sequence) are
   * mounted by shared/interactive.js from the JSON config blocks in the page.
   * This file owns the three animated canvas steppers that build the week's
   * diagrams a piece at a time, plus the re-binding a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initSteppers();
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
    initSteppers();
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
    if (!window.initELEC5620ChapterUI) return;
    try {
      window.initELEC5620ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[ELEC5620 chapter 7] chapter chrome failed to initialise:", err);
      }
    }
  }

  function initSteppers() {
    initNamespaceStepper();
    initVisibilityStepper();
    initBehaviourStepper();
    /* The foundations page loads this same file and owns no script of its own,
     * so its stepper is mounted from here too. */
    initContainmentStepper();
  }

  /* Palette shared by the three steppers. Canvas colours are written literally
   * because the widgets are also read outside the themed page (print, exports). */
  var INK = "#141826";
  var MUTED = "#565d75";
  var DIM = "#7b829a";
  var INDIGO = "#4f46e5";
  var INDIGO_FILL = "#e0e7ff";
  var GREEN = "#059669";
  var GREEN_FILL = "#dcfce7";
  var AMBER = "#d97706";
  var RED = "#dc2626";
  var RED_FILL = "#fee2e2";
  var PURPLE = "#9333ea";
  var PURPLE_FILL = "#f3e8ff";
  var GREY_STROKE = "#94a3b8";

  /* Draws the UML package icon: a small tab sitting on the top-left corner of a
   * rectangle. Returns nothing; later drawing can overlap it safely. */
  function packageGlyph(k, x, y, w, h, stroke, fill) {
    k.box(x, y, 46, 14, { fill: fill, stroke: stroke, lw: 1.4, r: 2 });
    k.box(x, y + 14, w, h, { fill: "#ffffff", stroke: stroke, lw: 1.8, r: 3 });
  }

  /* ── Stepper 1: names, nesting and the qualified name ───────── */

  function initNamespaceStepper() {
    var host = document.getElementById("ix-namespace");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-namespace", {
      title: "From a bare name to a qualified name",
      subtitle: "Each frame adds one piece of namespace notation.",
      height: 270,
      frames: [
        {
          title: "1 — a class with a name",
          caption: "A named element on its own. The name is just a string: no character set, no length limit, and an empty name is legal.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 - 18;
            k.box(cx - 78, cy - 46, 156, 92, { fill: "#ffffff", stroke: INDIGO, lw: 2, r: 8 });
            k.label(cx, cy - 20, "ACUnit", { align: "center", size: 14, weight: "700", color: INK });
            k.label(cx, cy + 6, "name = \"ACUnit\"", { align: "center", size: 11, mono: true, color: MUTED });
            k.label(cx, cy + 28, "(a string, nothing more)", { align: "center", size: 10, color: DIM });
            k.label(cx, h - 30, "one element, no home yet", { align: "center", size: 11, color: MUTED });
          }
        },
        {
          title: "2 — put it in a namespace",
          caption: "A namespace is a collection of owned elements identifiable by their names. Here the class owns its features: two attributes and one operation.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 - 6;
            k.box(cx - 96, cy - 74, 192, 148, { fill: "#ffffff", stroke: INDIGO, lw: 2, r: 8 });
            k.label(cx, cy - 56, "ACUnit", { align: "center", size: 13, weight: "700", color: INK });
            k.label(cx, cy - 40, "« the namespace »", { align: "center", size: 9.5, color: DIM });
            k.arrow(cx - 90, cy - 30, cx + 90, cy - 30, { color: "#cbd5e1", lw: 1.2 });
            k.label(cx, cy - 12, "+ mode : String", { align: "center", size: 11, mono: true, color: MUTED });
            k.label(cx, cy + 8, "+ targetTemp : Real", { align: "center", size: 11, mono: true, color: MUTED });
            k.label(cx, cy + 28, "+ coolTo(t : Real)", { align: "center", size: 11, mono: true, color: MUTED });
            k.label(cx, cy + 54, "3 owned members, 3 names", { align: "center", size: 10.5, color: DIM });
          }
        },
        {
          title: "3 — group namespaces in a package",
          caption: "A package is a kind of namespace, drawn with a tab. It groups the parts of a model the way folders group files — it does not model anything itself.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cx = w / 2;
            var cy = h / 2 - 10;
            packageGlyph(k, cx - 122, cy - 66, 244, 132, INDIGO, INDIGO_FILL);
            k.label(cx, cy - 26, "CoolingSubsystem", { align: "center", size: 13, weight: "700", color: INDIGO });
            k.label(cx, cy - 6, "«package»", { align: "center", size: 9.5, mono: true, color: DIM });
            k.box(cx - 74, cy + 12, 148, 28, { fill: "#f8fafc", stroke: GREY_STROKE, lw: 1.4, r: 5 });
            k.label(cx, cy + 26, "ACUnit", { align: "center", size: 11, mono: true, color: INK });
            k.label(cx, cy + 56, "namespaces nest: packages can contain packages", { align: "center", size: 10.5, color: MUTED });
          }
        },
        {
          title: "4 — namespace containment, not composition",
          caption: "Containment is drawn with a line ending in a circle-and-cross. The black diamond is reserved for run-time containment, so it must not be used here.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 26;
            packageGlyph(k, 40, cy - 30, 168, 104, INDIGO, INDIGO_FILL);
            k.label(124, cy + 20, "System", { align: "center", size: 12.5, weight: "700", color: INDIGO });
            k.arrow(208, cy + 44, 320, cy + 44, { color: MUTED, lw: 1.8 });
            k.dot(212, cy + 44, 8, { fill: "#ffffff", stroke: MUTED, lw: 1.8 });
            k.arrow(204, cy + 38, 220, cy + 50, { color: MUTED, lw: 1.8 });
            k.arrow(220, cy + 38, 204, cy + 50, { color: MUTED, lw: 1.8 });
            packageGlyph(k, 324, cy - 30, 168, 104, GREEN, GREEN_FILL);
            k.label(408, cy + 20, "CoolingSubsystem", { align: "center", size: 11.5, weight: "700", color: GREEN });
            k.label(w / 2, cy + 96, "namespace containment: circle-and-cross at the owner end", {
              align: "center",
              size: 10.5,
              color: MUTED
            });
            k.label(w / 2, cy + 118, "the black diamond would claim run-time containment", {
              align: "center",
              size: 10.5,
              color: RED
            });
          }
        },
        {
          title: "5 — the qualified name is the path",
          caption: "Nesting gives you a hierarchical name space, and the double colon separates the levels. System::CoolingSubsystem::ACUnit reads from the outermost namespace inwards.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 10;
            k.label(w / 2, 26, "System::CoolingSubsystem::ACUnit", {
              align: "center",
              size: 15,
              mono: true,
              weight: "700",
              color: INDIGO
            });
            k.arrow(96, 44, 96, 74, { color: GREY_STROKE, lw: 1.4, dash: [4, 4] });
            k.arrow(w / 2, 44, w / 2, 74, { color: GREY_STROKE, lw: 1.4, dash: [4, 4] });
            k.arrow(w - 96, 44, w - 96, 74, { color: GREY_STROKE, lw: 1.4, dash: [4, 4] });
            k.box(24, cy + 34, 150, 54, { fill: INDIGO_FILL, stroke: INDIGO, lw: 1.6, r: 6 });
            k.label(99, cy + 54, "System", { align: "center", size: 11.5, weight: "700", color: INDIGO });
            k.label(99, cy + 72, "outermost", { align: "center", size: 9.5, color: MUTED });
            k.box(w / 2 - 82, cy + 34, 164, 54, { fill: GREEN_FILL, stroke: GREEN, lw: 1.6, r: 6 });
            k.label(w / 2, cy + 54, "CoolingSubsystem", { align: "center", size: 11.5, weight: "700", color: GREEN });
            k.label(w / 2, cy + 72, "nested namespace", { align: "center", size: 9.5, color: MUTED });
            k.box(w - 174, cy + 34, 150, 54, { fill: "#ffffff", stroke: INDIGO, lw: 1.8, r: 6 });
            k.label(w - 99, cy + 54, "ACUnit", { align: "center", size: 11.5, weight: "700", color: INK });
            k.label(w - 99, cy + 72, "the element", { align: "center", size: 9.5, color: MUTED });
            k.label(w / 2, cy + 118, "names need not be unique inside a namespace — the path is what identifies", {
              align: "center",
              size: 10.5,
              color: MUTED
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: visibility, one modifier at a time ─────────── */

  function initVisibilityStepper() {
    var host = document.getElementById("ix-visibility");
    if (!host || !window.Interactive) return;

    function memberRow(k, x, y, symbol, text, color, emph) {
      if (emph) {
        k.box(x - 12, y - 13, k.w - 2 * (x - 12), 26, { fill: "rgba(79,70,229,0.07)", r: 5 });
      }
      k.label(x, y, symbol, { size: 13, weight: "700", mono: true, color: color });
      k.label(x + 22, y, text, { size: 11.5, mono: true, color: emph ? INK : MUTED });
    }

    window.Interactive.stepper("ix-visibility", {
      title: "Visibility, one modifier at a time",
      subtitle: "Same class each frame — only the audience of each member changes.",
      height: 260,
      frames: [
        {
          title: "No visibility shown",
          caption: "Members with no modifier. A model that never states visibility has not decided who may reference what, so every reference is an accident waiting to be found.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            k.box(x - 14, 30, w - 2 * (x - 14), h - 66, { fill: "#ffffff", stroke: GREY_STROKE, lw: 1.8, r: 8 });
            k.label(w / 2, 52, "Account", { align: "center", size: 14, weight: "700", color: INK });
            k.arrow(x - 6, 66, w - x + 6, 66, { color: "#cbd5e1", lw: 1.2 });
            k.label(x, 88, "id : String", { size: 11.5, mono: true, color: MUTED });
            k.label(x, 110, "salt : String", { size: 11.5, mono: true, color: MUTED });
            k.label(x, 132, "auditTrail : Log", { size: 11.5, mono: true, color: MUTED });
            k.label(x, 154, "feeSchedule : Money", { size: 11.5, mono: true, color: MUTED });
            k.label(x, 176, "debit(amount : Money) : Boolean", { size: 11.5, mono: true, color: MUTED });
            k.label(w / 2, h - 18, "4 members, 0 decisions", { align: "center", size: 10.5, color: DIM });
          }
        },
        {
          title: "public — +",
          caption: "Visible to all elements that can access the namespace. This is the API: the members a collaborating class in another package is allowed to name.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            k.box(x - 14, 30, w - 2 * (x - 14), h - 66, { fill: "#ffffff", stroke: GREY_STROKE, lw: 1.8, r: 8 });
            k.label(w / 2, 52, "Account", { align: "center", size: 14, weight: "700", color: INK });
            k.arrow(x - 6, 66, w - x + 6, 66, { color: "#cbd5e1", lw: 1.2 });
            memberRow(k, x, 88, "+", "id : String", GREEN, true);
            k.label(x, 110, "salt : String", { size: 11.5, mono: true, color: MUTED });
            k.label(x, 132, "auditTrail : Log", { size: 11.5, mono: true, color: MUTED });
            k.label(x, 154, "feeSchedule : Money", { size: 11.5, mono: true, color: MUTED });
            memberRow(k, x, 176, "+", "debit(amount : Money) : Boolean", GREEN, true);
            k.label(w / 2, h - 18, "referenceable by anything that can reach the namespace", {
              align: "center",
              size: 10.5,
              color: MUTED
            });
          }
        },
        {
          title: "private — \u2212",
          caption: "Visible only within the namespace that owns it. Two members move inside the class boundary, and no subclass can reach them.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            k.box(x - 14, 30, w - 2 * (x - 14), h - 66, { fill: "#ffffff", stroke: GREY_STROKE, lw: 1.8, r: 8 });
            k.label(w / 2, 52, "Account", { align: "center", size: 14, weight: "700", color: INK });
            k.arrow(x - 6, 66, w - x + 6, 66, { color: "#cbd5e1", lw: 1.2 });
            memberRow(k, x, 88, "+", "id : String", GREEN, false);
            memberRow(k, x, 110, "\u2212", "salt : String", RED, true);
            k.label(x, 132, "auditTrail : Log", { size: 11.5, mono: true, color: MUTED });
            k.label(x, 154, "feeSchedule : Money", { size: 11.5, mono: true, color: MUTED });
            memberRow(k, x, 176, "+", "debit(amount : Money) : Boolean", GREEN, false);
            k.label(w - 20, 226, "not even a subclass sees salt", { align: "right", size: 10.5, color: MUTED });
          }
        },
        {
          title: "protected — #",
          caption: "Visible to elements in its extended namespace. The inheritance contract: every subclass may reference it, unrelated classes still cannot.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            k.box(x - 14, 30, w - 2 * (x - 14), h - 66, { fill: "#ffffff", stroke: GREY_STROKE, lw: 1.8, r: 8 });
            k.label(w / 2, 52, "Account", { align: "center", size: 14, weight: "700", color: INK });
            k.arrow(x - 6, 66, w - x + 6, 66, { color: "#cbd5e1", lw: 1.2 });
            memberRow(k, x, 88, "+", "id : String", GREEN, false);
            memberRow(k, x, 110, "\u2212", "salt : String", RED, false);
            memberRow(k, x, 132, "#", "auditTrail : Log", AMBER, true);
            k.label(x, 154, "feeSchedule : Money", { size: 11.5, mono: true, color: MUTED });
            memberRow(k, x, 176, "+", "debit(amount : Money) : Boolean", GREEN, false);
            k.label(w - 20, 226, "the extended namespace is the audience", { align: "right", size: 10.5, color: MUTED });
          }
        },
        {
          title: "package — ~",
          caption: "Visible only to other elements in the same package as the class. Package scope is a different axis from inheritance: it is about where the element lives, not what extends it.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 46;
            k.box(x - 14, 30, w - 2 * (x - 14), h - 66, { fill: "#ffffff", stroke: GREY_STROKE, lw: 1.8, r: 8 });
            k.label(w / 2, 52, "Account", { align: "center", size: 14, weight: "700", color: INK });
            k.arrow(x - 6, 66, w - x + 6, 66, { color: "#cbd5e1", lw: 1.2 });
            memberRow(k, x, 88, "+", "id : String", GREEN, false);
            memberRow(k, x, 110, "\u2212", "salt : String", RED, false);
            memberRow(k, x, 132, "#", "auditTrail : Log", AMBER, false);
            memberRow(k, x, 154, "~", "feeSchedule : Money", PURPLE, true);
            memberRow(k, x, 176, "+", "debit(amount : Money) : Boolean", GREEN, false);
            k.label(w / 2, h - 18, "+  \u2212  #  ~   — four kinds, four audiences", {
              align: "center",
              size: 10.5,
              color: MUTED
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: where behaviour lives in the model ─────────── */

  function initBehaviourStepper() {
    var host = document.getElementById("ix-behaviour");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-behaviour", {
      title: "Behaviour gets a home too",
      subtitle: "Structure is partitioned by packages; behaviour is owned by the element it describes.",
      height: 270,
      frames: [
        {
          title: "The class owns its features",
          caption: "Start from the structural model: a package owns the class, and the class owns its attributes and operations.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2;
            packageGlyph(k, 24, cy - 78, w - 48, 152, INDIGO, INDIGO_FILL);
            k.label(38, cy - 54, "«package» CoolingSubsystem", { size: 10.5, mono: true, color: INDIGO });
            k.box(w / 2 - 78, cy - 28, 156, 88, { fill: "#ffffff", stroke: INDIGO, lw: 1.8, r: 6 });
            k.label(w / 2, cy - 10, "ACUnit", { align: "center", size: 12, weight: "700", color: INK });
            k.arrow(w / 2 - 70, cy + 2, w / 2 + 70, cy + 2, { color: "#cbd5e1", lw: 1.2 });
            k.label(w / 2, cy + 18, "+ mode : String", { align: "center", size: 10.5, mono: true, color: MUTED });
            k.label(w / 2, cy + 36, "+ coolTo(t : Real)", { align: "center", size: 10.5, mono: true, color: MUTED });
            k.label(w / 2, cy + 56, "structure first — the operation is only a signature", {
              align: "center",
              size: 10.5,
              color: MUTED
            });
          }
        },
        {
          title: "An activity explains an operation",
          caption: "An activity is a parameterised behaviour represented as a coordinated flow of actions. It flows through action nodes, a decision node, a merge node and a final node — one control flow, no branches left implicit.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = 62;
            k.label(w / 2, 22, "activity: coolTo(t)", { align: "center", size: 12, weight: "700", color: INDIGO });
            k.dot(40, y, 8, { fill: INK });
            k.arrow(50, y, 92, y, { color: MUTED });
            k.label(40, y - 20, "initial", { align: "center", size: 9, color: DIM });
            k.box(96, y - 16, 104, 32, { fill: INDIGO_FILL, stroke: INDIGO, lw: 1.6, r: 14 });
            k.label(148, y, "read t", { align: "center", size: 10.5, color: INK });
            k.arrow(202, y, 240, y, { color: MUTED });
            k.dot(252, y, 14, { fill: "#ffffff", stroke: INDIGO, lw: 1.8 });
            k.label(252, y, "?", { align: "center", size: 12, weight: "700", color: INDIGO });
            k.label(252, y - 28, "decision", { align: "center", size: 9, color: DIM });
            k.arrow(266, y - 4, w - 122, y - 36, { color: GREEN });
            k.label(w - 96, y - 44, "t < target", { size: 9.5, mono: true, color: GREEN });
            k.box(w - 116, y - 56, 108, 32, { fill: GREEN_FILL, stroke: GREEN, lw: 1.6, r: 14 });
            k.label(w - 62, y - 40, "run compressor", { align: "center", size: 10, color: INK });
            k.arrow(266, y + 4, w - 122, y + 42, { color: AMBER });
            k.label(w - 96, y + 52, "else", { size: 9.5, mono: true, color: AMBER });
            k.box(w - 116, y + 26, 108, 32, { fill: "#fef3c7", stroke: AMBER, lw: 1.6, r: 14 });
            k.label(w - 62, y + 42, "idle", { align: "center", size: 10, color: INK });
            k.arrow(w - 62, y + 58, w - 62, y + 96, { color: MUTED });
            k.arrow(w - 116, y + 100, 148, y + 100, { color: MUTED });
            k.arrow(148, y + 100, 148, y + 62, { color: MUTED });
            k.label(148, y + 112, "merge", { align: "center", size: 9, color: DIM });
            k.arrow(148, y + 66, 148, y + 74, { color: MUTED });
            k.dot(w - 62, y + 108, 11, { fill: "#ffffff", stroke: INK, lw: 1.8 });
            k.dot(w - 62, y + 108, 6, { fill: INK });
            k.label(w - 62, y + 130, "activity final", { align: "center", size: 9, color: DIM });
            k.label(40, h - 16, "decision, merge, fork and join are control nodes — the activity owns them", {
              size: 10,
              color: MUTED
            });
          }
        },
        {
          title: "An interaction needs a context",
          caption: "Interactions focus on the communication between collaborating instances, and they require a prior definition of a collaboration structure. Sequence, communication and interaction overview diagrams are three notations for the same interaction.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var top = 52;
            k.label(w / 2, 20, "interaction: placeOrder()", { align: "center", size: 12, weight: "700", color: INDIGO });
            packageGlyph(k, 24, top - 22, w - 48, h - top - 22, GREEN, GREEN_FILL);
            k.label(38, top + 2, "«collaboration» Ordering — the context for the interaction", {
              size: 9.5,
              mono: true,
              color: GREEN
            });
            var xs = [0.24, 0.52, 0.8];
            var names = [":Customer", ":Order", ":Stock"];
            xs.forEach(function (f, i) {
              var x = w * f;
              k.box(x - 44, top + 26, 88, 26, { fill: "#ffffff", stroke: INDIGO, lw: 1.6, r: 4 });
              k.label(x, top + 39, names[i], { align: "center", size: 10, mono: true, color: INK });
              k.arrow(x, top + 54, x, top + 152, { color: GREY_STROKE, lw: 1.3, dash: [4, 5] });
            });
            k.arrow(w * 0.24, top + 72, w * 0.52, top + 72, { color: INDIGO });
            k.label(w * 0.38, top + 64, "1: create()", { align: "center", size: 9.5, mono: true, color: INDIGO });
            k.arrow(w * 0.52, top + 96, w * 0.8, top + 96, { color: INDIGO });
            k.label(w * 0.66, top + 88, "2: check()", { align: "center", size: 9.5, mono: true, color: INDIGO });
            k.arrow(w * 0.8, top + 120, w * 0.52, top + 120, { color: GREEN, dash: [5, 4] });
            k.label(w * 0.66, top + 134, "3: available", { align: "center", size: 9.5, mono: true, color: GREEN });
            k.label(w / 2, h - 14, "ordering is vertical position; the dashed arrow is a return message", {
              align: "center",
              size: 10,
              color: MUTED
            });
          }
        },
        {
          title: "A state machine owns its states",
          caption: "Statecharts describe event-driven behaviour through finite state transitions. State is itself a namespace, so a composite state owns its substates the way a class owns its attributes.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var y = 92;
            k.label(w / 2, 22, "state machine: ACUnit lifecycle", { align: "center", size: 12, weight: "700", color: INDIGO });
            k.dot(30, y, 8, { fill: INK });
            k.label(30, y - 20, "initial", { align: "center", size: 9, color: DIM });
            k.arrow(40, y, 78, y, { color: MUTED });
            k.box(82, y - 22, 96, 44, { fill: "#ffffff", stroke: INDIGO, lw: 1.8, r: 16 });
            k.label(130, y, "Idle", { align: "center", size: 11.5, weight: "700", color: INK });
            k.arrow(180, y, 232, y, { color: MUTED });
            k.label(206, y - 14, "cool(t)", { align: "center", size: 9.5, mono: true, color: INDIGO });
            k.box(236, y - 40, 152, 80, { fill: PURPLE_FILL, stroke: PURPLE, lw: 1.8, r: 10 });
            k.label(312, y - 24, "Cooling", { align: "center", size: 11, weight: "700", color: PURPLE });
            k.label(312, y - 8, "«composite state»", { align: "center", size: 8.5, color: DIM });
            k.box(248, y + 2, 60, 26, { fill: "#ffffff", stroke: PURPLE, lw: 1.4, r: 8 });
            k.label(278, y + 15, "Ramp", { align: "center", size: 9.5, color: INK });
            k.box(316, y + 2, 60, 26, { fill: "#ffffff", stroke: PURPLE, lw: 1.4, r: 8 });
            k.label(346, y + 15, "Hold", { align: "center", size: 9.5, color: INK });
            k.arrow(310, y + 15, 314, y + 15, { color: PURPLE, lw: 1.6 });
            k.arrow(390, y, w - 96, y, { color: MUTED });
            k.label(w - 90, y - 14, "temp reached", { align: "right", size: 9.5, mono: true, color: GREEN });
            k.box(w - 92, y - 22, 78, 44, { fill: "#ffffff", stroke: GREEN, lw: 1.8, r: 16 });
            k.label(w - 53, y, "Off", { align: "center", size: 11.5, weight: "700", color: INK });
            k.arrow(w - 53, y + 24, w - 53, y + 56, { color: MUTED });
            k.dot(w - 53, y + 68, 11, { fill: "#ffffff", stroke: INK, lw: 1.8 });
            k.dot(w - 53, y + 68, 6, { fill: INK });
            k.label(w - 53, y + 88, "final state", { align: "center", size: 9, color: DIM });
            k.label(30, h - 16, "triggers are message, change or time events — an event occurrence has no duration", {
              size: 10,
              color: MUTED
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 4: containment versus composition ─────────────────
   * Mounted from this file because the foundations page loads this same
   * script and has no page script of its own. */

  function initContainmentStepper() {
    var host = document.getElementById("ix-m-containment");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-m-containment", {
      title: "Namespace containment is not composition",
      subtitle: "Same two packages, two different relationships — and only one of them is correct here.",
      height: 280,
      frames: [
        {
          title: "Namespace containment — the circle-and-cross",
          caption: "The circle-and-cross at the owner end says one thing only: these elements are filed inside this namespace. Nothing is created or destroyed by it.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 22;
            packageGlyph(k, 40, cy - 34, 156, 106, INDIGO, INDIGO_FILL);
            k.label(118, cy + 16, "Warehouse", { align: "center", size: 12, weight: "700", color: INDIGO });
            k.label(118, cy + 36, "«namespace»", { align: "center", size: 9, mono: true, color: DIM });
            k.arrow(214, cy + 48, w - 200, cy + 48, { color: MUTED, lw: 1.8 });
            k.dot(220, cy + 48, 8, { fill: "#ffffff", stroke: MUTED, lw: 1.8 });
            k.arrow(212, cy + 42, 228, cy + 54, { color: MUTED, lw: 1.8 });
            k.arrow(228, cy + 42, 212, cy + 54, { color: MUTED, lw: 1.8 });
            packageGlyph(k, w - 186, cy - 34, 146, 106, GREEN, GREEN_FILL);
            k.label(w - 113, cy + 16, "Location", { align: "center", size: 12, weight: "700", color: GREEN });
            k.label(w - 113, cy + 36, "«element»", { align: "center", size: 9, mono: true, color: DIM });
            k.label(w / 2, cy + 96, "one design-time question: where is this element filed?", {
              align: "center",
              size: 10.5,
              color: MUTED
            });
          }
        },
        {
          title: "The trap — the filled diamond",
          caption: "The black diamond asserts run-time containment: a whole owns its parts while the system executes, and destroying the whole takes the parts with it.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 22;
            k.box(40, cy - 34, 156, 106, { fill: RED_FILL, stroke: RED, lw: 1.8, r: 8 });
            k.label(118, cy + 6, "Warehouse", { align: "center", size: 12, weight: "700", color: RED });
            k.label(118, cy + 26, "«whole»", { align: "center", size: 9, mono: true, color: DIM });
            k.arrow(214, cy + 48, w - 200, cy + 48, { color: INK, lw: 1.8 });
            k.box(206, cy + 38, 32, 20, { fill: INK, r: 3 });
            k.label(w - 113, cy + 6, "Location", { align: "center", size: 12, weight: "700", color: RED });
            k.box(w - 186, cy - 34, 146, 106, { fill: RED_FILL, stroke: RED, lw: 1.8, r: 8 });
            k.label(w - 113, cy + 26, "«part»", { align: "center", size: 9, mono: true, color: DIM });
            k.label(w / 2, cy + 96, "wrong for packages: a package does not own its members at run time", {
              align: "center",
              size: 10.5,
              color: RED
            });
          }
        },
        {
          title: "Side by side",
          caption: "Both symbols connect two boxes, and that is the whole difficulty. Separate them by the question they answer: where is it filed, versus what is it made of while running.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 26, "DESIGN TIME", { size: 11, mono: true, weight: "700", color: INDIGO });
            var y1 = 78;
            k.box(24, y1 - 26, 118, 52, { fill: "#ffffff", stroke: INDIGO, lw: 1.8, r: 6 });
            k.label(83, y1, "Namespace", { align: "center", size: 11, weight: "700", color: INK });
            k.arrow(148, y1, 238, y1, { color: MUTED, lw: 1.8 });
            k.dot(156, y1, 7, { fill: "#ffffff", stroke: MUTED, lw: 1.8 });
            k.arrow(149, y1 - 5, 163, y1 + 5, { color: MUTED, lw: 1.8 });
            k.arrow(163, y1 - 5, 149, y1 + 5, { color: MUTED, lw: 1.8 });
            k.box(244, y1 - 26, 118, 52, { fill: "#ffffff", stroke: INDIGO, lw: 1.8, r: 6 });
            k.label(303, y1, "Element", { align: "center", size: 11, weight: "700", color: INK });
            k.label(390, y1 - 8, "circle-and-cross", { size: 11, weight: "700", color: INDIGO });
            k.label(390, y1 + 10, "answers: where is it filed?", { size: 10.5, color: MUTED });
            k.label(24, 158, "RUN TIME", { size: 11, mono: true, weight: "700", color: RED });
            var y2 = 210;
            k.box(24, y2 - 26, 118, 52, { fill: "#ffffff", stroke: RED, lw: 1.8, r: 6 });
            k.label(83, y2, "Whole", { align: "center", size: 11, weight: "700", color: INK });
            k.arrow(148, y2, 238, y2, { color: INK, lw: 1.8 });
            k.box(150, y2 - 11, 30, 22, { fill: INK, r: 3 });
            k.box(244, y2 - 26, 118, 52, { fill: "#ffffff", stroke: RED, lw: 1.8, r: 6 });
            k.label(303, y2, "Part", { align: "center", size: 11, weight: "700", color: INK });
            k.label(390, y2 - 8, "filled diamond", { size: 11, weight: "700", color: RED });
            k.label(390, y2 + 10, "answers: what is it made of?", { size: 10.5, color: MUTED });
            k.label(w / 2, h - 14, "the deck's answer: black diamond → run-time containment", {
              align: "center",
              size: 10.5,
              color: MUTED
            });
          }
        },
        {
          title: "Both in one diagram, each in its place",
          caption: "The two never compete. A package diagram uses the circle-and-cross for nesting and the filled diamond for a genuine run-time composition inside a class.",
          draw: function (ctx, w, h, k) {
            k.clear();
            packageGlyph(k, 24, 24, w - 48, h - 66, INDIGO, INDIGO_FILL);
            k.label(38, 50, "«package» CoolingSubsystem", { size: 10.5, mono: true, color: INDIGO });
            k.box(60, 74, 132, 52, { fill: "#ffffff", stroke: INDIGO, lw: 1.8, r: 6 });
            k.label(126, 94, "ACUnit", { align: "center", size: 11.5, weight: "700", color: INK });
            k.label(126, 112, "a class", { align: "center", size: 9.5, color: DIM });
            k.arrow(196, 100, 286, 100, { color: MUTED, lw: 1.8 });
            k.dot(202, 100, 7, { fill: "#ffffff", stroke: MUTED, lw: 1.8 });
            k.arrow(195, 95, 209, 105, { color: MUTED, lw: 1.8 });
            k.arrow(209, 95, 195, 105, { color: MUTED, lw: 1.8 });
            k.label(241, 88, "containment", { align: "center", size: 9, color: DIM });
            k.box(292, 74, 132, 52, { fill: "#ffffff", stroke: INDIGO, lw: 1.8, r: 6 });
            k.label(358, 94, "Compressor", { align: "center", size: 11.5, weight: "700", color: INK });
            k.label(358, 112, "a class", { align: "center", size: 9.5, color: DIM });
            k.arrow(358, 132, 358, 168, { color: INK, lw: 1.8 });
            k.box(344, 136, 28, 18, { fill: INK, r: 3 });
            k.label(402, 148, "composition (run time)", { size: 10, color: MUTED });
            k.box(292, 176, 132, 52, { fill: "#ffffff", stroke: INK, lw: 1.8, r: 6 });
            k.label(358, 196, "Valve", { align: "center", size: 11.5, weight: "700", color: INK });
            k.label(358, 214, "a part, not a member", { align: "center", size: 9, color: DIM });
            k.label(w / 2, h - 24, "one diagram, two relationships, two symbols — never swapped", {
              align: "center",
              size: 10.5,
              color: MUTED
            });
          }
        }
      ]
    });
  }
})();
