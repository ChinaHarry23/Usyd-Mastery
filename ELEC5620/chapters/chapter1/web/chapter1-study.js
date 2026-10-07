(function () {
  "use strict";

  /* ELEC5620 — Week 1 page behaviour.
   *
   * The declarative widgets (sequence, matcher, timeline, race, pipeline,
   * deck, hotspot) are mounted by shared/interactive.js from the JSON config
   * blocks in the page. This file owns the two animated UML steppers, which
   * draw the notation rather than describing it, and the re-binding that a
   * language swap requires.
   */

  var INK = "#4f46e5";
  var INK_SOFT = "#818cf8";
  var FILL = "#eef0fe";
  var TEXT = "#3f3d63";
  var MUTED = "#6b6890";
  var PAPER = "#ffffff";

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initUmlStepper();
    initStateStepper();
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
    initUmlStepper();
    initStateStepper();
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
        window.console.error("[ELEC5620 chapter 1] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── UML drawing helpers ────────────────────────────────────────
   * The canvas kit covers rectangles, text and arrows. UML notation needs a
   * little more: compartmented class boxes, and the four relationship
   * adornments (hollow triangle, open arrow, hollow diamond, filled diamond).
   */

  function umlBox(k, x, y, w, name, attrs, ops, opts) {
    opts = opts || {};
    attrs = attrs || [];
    ops = ops || [];

    var pad = 10;
    var lineH = 16;
    var nameH = 30;
    var attrH = attrs.length ? attrs.length * lineH + pad : 0;
    var opH = ops.length ? ops.length * lineH + pad : 0;
    var h = nameH + attrH + opH;

    k.box(x, y, w, h, { fill: opts.fill || FILL, stroke: opts.stroke || INK, lw: opts.lw || 2, r: 4 });

    var cx = x + w / 2;
    if (opts.stereotype) {
      k.label(cx, y - 9, opts.stereotype, { align: "center", size: 11, mono: true, color: MUTED });
    }
    k.label(cx, y + nameH / 2, name, {
      align: "center",
      size: 13,
      weight: "700",
      mono: true,
      color: opts.nameColor || INK,
    });

    var cursor = y + nameH;
    function separator(yy) {
      /* A compartment divider. Drawn with straight strokes rather than the
       * dashed arrow helper, which would look like a relationship. */
      k.arrow(x, yy, x + w / 2, yy, { color: INK_SOFT, lw: 1, head: 0.001 });
      k.arrow(x + w / 2, yy, x + w, yy, { color: INK_SOFT, lw: 1, head: 0.001 });
    }
    if (attrs.length) {
      separator(cursor);
      attrs.forEach(function (a, i) {
        k.label(x + pad, cursor + pad / 2 + i * lineH + 3, a, { size: 11, mono: true, color: TEXT });
      });
      cursor += attrH;
    }
    if (ops.length) {
      separator(cursor);
      ops.forEach(function (o, i) {
        k.label(x + pad, cursor + pad / 2 + i * lineH + 3, o, { size: 11, mono: true, color: TEXT });
      });
      cursor += opH;
    }
    return { x: x, y: y, w: w, h: h, cx: cx, cy: y + h / 2, bottom: y + h, right: x + w };
  }

  /* A UML relationship line with one of the standard adornments at (x2, y2). */
  function umlRel(k, x1, y1, x2, y2, opts) {
    opts = opts || {};
    var color = opts.color || INK;
    var lw = opts.lw || 2;
    var angle = Math.atan2(y2 - y1, x2 - x1);
    var kind = opts.kind || "association";
    var stop = { triangle: 14, arrow: 11, diamond: 13 }[kind] || 0;
    var ux = Math.cos(angle);
    var uy = Math.sin(angle);
    var ex = x2 - ux * stop;
    var ey = y2 - uy * stop;

    k.arrow(x1, y1, ex, ey, { color: color, lw: lw, dash: opts.dash, head: 0.001 });

    if (kind === "triangle") {
      /* Generalisation / realisation: hollow triangle, wide and short. */
      polygon(k, [
        [x2, y2],
        [x2 - 15 * Math.cos(angle - 0.42), y2 - 15 * Math.sin(angle - 0.42)],
        [x2 - 15 * Math.cos(angle + 0.42), y2 - 15 * Math.sin(angle + 0.42)],
      ], PAPER, color, lw);
    } else if (kind === "arrow") {
      /* Directed association: open arrowhead drawn as two strokes. */
      k.arrow(x2, y2, x2 - 11 * Math.cos(angle - 0.5), y2 - 11 * Math.sin(angle - 0.5), {
        color: color,
        lw: lw,
        head: 0.001,
      });
      k.arrow(x2, y2, x2 - 11 * Math.cos(angle + 0.5), y2 - 11 * Math.sin(angle + 0.5), {
        color: color,
        lw: lw,
        head: 0.001,
      });
    } else if (kind === "diamond" || kind === "fdiamond") {
      /* Aggregation (hollow) and composition (filled) diamonds. */
      var len = kind === "fdiamond" ? 15 : 17;
      var wid = 7.5;
      var bx = x2 - ux * len;
      var by = y2 - uy * len;
      var px = -uy * wid;
      var py = ux * wid;
      polygon(k, [
        [x2, y2],
        [bx + px, by + py],
        [bx + ux * 3, by + uy * 3],
        [bx - px, by - py],
      ], kind === "fdiamond" ? color : PAPER, color, lw);
    }

    if (opts.label) {
      var mx = (x1 + x2) / 2;
      var my = (y1 + y2) / 2;
      k.label(mx + (opts.labelDx || 0), my + (opts.labelDy || -9), opts.label, {
        align: "center",
        size: 11,
        mono: true,
        color: MUTED,
      });
    }
    if (opts.multiplicity) {
      k.label(x1 + ux * 16 + (opts.multiplicityDx || 0), y1 + uy * 16 + (opts.multiplicityDy || -12), opts.multiplicity, {
        size: 11,
        mono: true,
        color: INK,
      });
    }
    if (opts.multiplicityEnd) {
      k.label(ex - ux * 6 + (opts.multiplicityEndDx || 0), ey - uy * 6 + (opts.multiplicityEndDy || -12), opts.multiplicityEnd, {
        align: "right",
        size: 11,
        mono: true,
        color: INK,
      });
    }
  }

  function polygon(k, pts, fill, stroke, lw) {
    var ctx = k.ctx;
    if (!ctx) return;
    ctx.save();
    ctx.beginPath();
    pts.forEach(function (p, i) {
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw || 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  function note(k, x, y, w, lines, opts) {
    opts = opts || {};
    var h = lines.length * 16 + 16;
    k.box(x, y, w, h, { fill: "#fffdf5", stroke: "#f59e0b", lw: 1.4, r: 3 });
    k.arrow(x + 14, y, x + 26, y - 12, { color: "#f59e0b", lw: 1.2, head: 0.001 });
    lines.forEach(function (l, i) {
      k.label(x + 10, y + 17 + i * 16, l, { size: 11, mono: true, color: "#7c5b09" });
    });
    return h;
  }

  function frameTitle(k, w, text, sub) {
    k.label(18, 20, text, { size: 12, mono: true, color: INK });
    if (sub) k.label(w - 18, 20, sub, { align: "right", size: 11, color: MUTED });
  }

  /* ── Stepper 1: building a class diagram ───────────────────────
   * Mounted from the study page (#ix-uml-build) and, at smaller scale, from
   * the Foundations page (#ix-uml-build-m) where it illustrates the M1 level
   * of the model hierarchy. Both pages load this script; whichever host is
   * absent is simply skipped. */

  function initUmlStepper() {
    if (!document.getElementById("ix-uml-build") && !document.getElementById("ix-uml-build-m")) return;
    if (!window.Interactive) return;

    var W = 680;
    var H = 410;

    function base(k) {
      k.clear(PAPER);
      k.box(10, 10, W - 20, H - 20, { stroke: "rgba(129,140,248,0.35)", lw: 1.2, r: 10 });
    }

    var CFG = {
      title: "Building a class diagram, one modelling decision at a time",
      subtitle:
        "Six decisions turn a box into a model. Watch what each addition commits the design to.",
      height: H,
      frames: [
        {
          title: "1 — A classifier exists",
          caption:
            "The smallest possible model element: a named box. Nothing is claimed yet about what it holds or what it relates to.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "classifier");
            umlBox(k, w / 2 - 90, h / 2 - 26, 180, "Agent", [], []);
            k.label(w / 2, h - 46, "a name in a box is already a claim: this concept exists in the domain", {
              align: "center",
              size: 11,
              color: MUTED,
            });
          },
        },
        {
          title: "2 — Attributes and operations",
          caption:
            "The box gains compartments. Attributes are what an instance knows; operations are what it can be asked to do. Both are typed, because UML is a language with a metamodel, not a sketch.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "structure + behaviour");
            umlBox(k, w / 2 - 110, 78, 220, "Agent", ["- id: String", "- goal: String", "- confidence: Float"], ["+ perceive(): Evidence", "+ decide(): Action", "+ escalate(): Approval"]);
            note(k, w / 2 + 130, 96, 160, ["compartments:", "name / attributes /", "operations are", "separated by lines"]);
            k.label(w / 2, h - 40, "visibility:  -  private      +  public", {
              align: "center",
              size: 11,
              mono: true,
              color: MUTED,
            });
          },
        },
        {
          title: "3 — An association with multiplicity",
          caption:
            "A line between two classes asserts that instances are linked. Multiplicity states how many may participate. Read it at the far end: one Agent produces one or more Recommendations.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "association + multiplicity");
            var a = umlBox(k, 48, 128, 200, "Agent", ["- goal: String"], ["+ decide(): Action"]);
            var b = umlBox(k, 428, 128, 204, "Recommendation", ["- score: Float"], ["+ explain(): Text"]);
            umlRel(k, a.right, a.cy, b.x, b.cy, {
              kind: "association",
              label: "produces",
              multiplicity: "1",
              multiplicityEnd: "1..*",
              labelDy: -14,
            });
            k.label(w / 2, 108, "1                1..*", { align: "center", size: 11, mono: true, color: INK });
            k.label(w / 2, h - 44, "an unadorned line is honest; a wrong multiplicity is a defect", {
              align: "center",
              size: 11,
              color: MUTED,
            });
          },
        },
        {
          title: "4 — Aggregation: a hollow diamond",
          caption:
            "Aggregation says the whole groups its parts, but the parts can be shared and can outlive the whole. A Recommendation collects ProductOptions; deleting the recommendation does not delete the shoes.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "aggregation — shared parts");
            var a = umlBox(k, 48, 128, 200, "Recommendation", [], ["+ explain(): Text"]);
            var b = umlBox(k, 428, 128, 204, "ProductOption", ["- sku: String"], ["+ price(): Money"]);
            umlRel(k, b.x, b.cy, a.right, a.cy, {
              kind: "diamond",
              label: "groups",
              multiplicity: "1..*",
              labelDy: -16,
              multiplicityEndDy: 22,
            });
            k.label(w / 2, 104, "hollow diamond sits at the whole", { align: "center", size: 11, mono: true, color: MUTED });
            k.label(w / 2, h - 44, "part can be shared and can outlive the whole", {
              align: "center",
              size: 11,
              color: MUTED,
            });
          },
        },
        {
          title: "5 — Composition: a filled diamond",
          caption:
            "Composition strengthens the claim: the part is owned by the whole and shares its lifetime. Delete the FootScan and its Measurements have no reason to exist.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "composition — owned parts");
            var a = umlBox(k, 48, 128, 200, "FootScan", ["- takenAt: Date"], ["+ analyse(): Fit"]);
            var b = umlBox(k, 428, 128, 204, "Measurement", ["- lengthMm: Int"], ["+ confidence(): Float"]);
            umlRel(k, b.x, b.cy, a.right, a.cy, {
              kind: "fdiamond",
              label: "owns",
              multiplicity: "1..*",
              labelDy: -16,
              multiplicityEndDy: 22,
            });
            k.label(w / 2, 104, "filled diamond sits at the whole", { align: "center", size: 11, mono: true, color: MUTED });
            k.label(w / 2, h - 58, "lifetime is shared: no whole, no part", { align: "center", size: 11, color: MUTED });
            k.label(w / 2, h - 38, "this is the adornment that carries the strongest ownership claim", {
              align: "center",
              size: 11,
              color: MUTED,
            });
          },
        },
        {
          title: "6 — Generalisation: the hollow triangle",
          caption:
            "A hollow triangle pointing at the superclass means substitutability: every FitAnalysisAgent is an Agent and can be used wherever an Agent is expected. Read the arrow as 'is a kind of'.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "generalisation — is a kind of");
            var sup = umlBox(k, 240, 60, 200, "Agent", [], ["+ decide(): Action"]);
            var c1 = umlBox(k, 40, 220, 180, "FitAnalysisAgent", [], ["+ analyse(): Fit"]);
            var c2 = umlBox(k, 250, 220, 180, "InventoryAgent", [], ["+ check(): Stock"]);
            var c3 = umlBox(k, 460, 220, 180, "SupportAgent", [], ["+ reply(): Text"]);
            [c1, c2, c3].forEach(function (c) {
              umlRel(k, c.cx, c.y, sup.cx, sup.bottom, { kind: "triangle" });
            });
            k.label(w / 2, h - 34, "three subtypes, one supertype — the triangle is never filled", {
              align: "center",
              size: 11,
              color: MUTED,
            });
          },
        },
        {
          title: "7 — A stereotype binds the model to the project",
          caption:
            "«agent» is not decoration. A stereotype extends the metamodel: it declares that these classifiers obey the project's agent contract — perceive, decide, act, escalate. The model now says something no generic class diagram could.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "stereotype — extending the language");
            var sup = umlBox(k, 240, 74, 200, "Agent", [], ["+ decide(): Action"], {
              stereotype: "\u00ABagent\u00BB",
            });
            var c1 = umlBox(k, 40, 234, 180, "FitAnalysisAgent", [], ["+ analyse(): Fit"], {
              stereotype: "\u00ABagent\u00BB",
            });
            var c2 = umlBox(k, 250, 234, 180, "InventoryAgent", [], ["+ check(): Stock"], {
              stereotype: "\u00ABagent\u00BB",
            });
            var c3 = umlBox(k, 460, 234, 180, "SupportAgent", [], ["+ reply(): Text"], {
              stereotype: "\u00ABagent\u00BB",
            });
            [c1, c2, c3].forEach(function (c) {
              umlRel(k, c.cx, c.y, sup.cx, sup.bottom, { kind: "triangle" });
            });
            k.label(w / 2, 46, "\u00ABagent\u00BB  =  perceive \u00B7 decide \u00B7 act \u00B7 escalate", {
              align: "center",
              size: 12,
              mono: true,
              color: INK,
            });
          },
        },
        {
          title: "8 — Read the whole model",
          caption:
            "Every element on the canvas is a decision you can defend: the classifier names a domain concept, the compartments name what it knows and does, the adornments name how lifetimes and substitutability work, and the stereotype ties the model to the project's architecture.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "the model so far", "one diagram, four kinds of claim");
            var sup = umlBox(k, 260, 52, 180, "Agent", [], ["+ decide(): Action"], {
              stereotype: "\u00ABagent\u00BB",
            });
            var left = umlBox(k, 40, 232, 190, "FitAnalysisAgent", [], ["+ analyse(): Fit"]);
            var mid = umlBox(k, 254, 232, 190, "InventoryAgent", [], ["+ check(): Stock"]);
            var prod = umlBox(k, 500, 232, 160, "ProductOption", [], ["+ price(): Money"]);
            umlRel(k, left.cx, left.y, sup.cx - 30, sup.bottom, { kind: "triangle" });
            umlRel(k, mid.cx, mid.y, sup.cx + 30, sup.bottom, { kind: "triangle" });
            umlRel(k, mid.right, mid.cy, prod.x, prod.cy, {
              kind: "association",
              label: "checks",
              multiplicity: "1..*",
              labelDy: -14,
            });
            k.label(w / 2, h - 116, "generalisation + stereotype above, association with multiplicity below", {
              align: "center",
              size: 11,
              color: MUTED,
            });
            k.label(w / 2, h - 42, "the same picture is the component view's services layer, one level down", {
              align: "center",
              size: 11,
              color: MUTED,
            });
          },
        },
      ],
    };

    window.Interactive.stepper("ix-uml-build", CFG);
    window.Interactive.stepper("ix-uml-build-m", CFG);
  }

  /* ── Stepper 2: a state machine, built and then executed ───────
   * Mounted on the Foundations page (chapter1-math.html), which loads this
   * same script; the guard keeps the study page, which has no such host,
   * from doing any work. */

  function initStateStepper() {
    var host = document.getElementById("ix-state-machine");
    if (!host || !window.Interactive) return;

    var W = 680;
    var H = 340;

    function base(k) {
      k.clear(PAPER);
      k.box(10, 10, W - 20, H - 20, { stroke: "rgba(129,140,248,0.35)", lw: 1.2, r: 10 });
    }

    function rounded(k, x, y, w, h, fill) {
      k.box(x, y, w, h, { fill: fill || FILL, stroke: INK, lw: 2, r: 14 });
    }

    function initial(k, x, y) {
      k.dot(x, y, 9, { fill: "#1f2937", stroke: "#1f2937", lw: 1 });
    }

    function finalState(k, x, y) {
      k.dot(x, y, 11, { fill: PAPER, stroke: "#1f2937", lw: 2 });
      k.dot(x, y, 6.5, { fill: "#1f2937", stroke: "#1f2937" });
    }

    var PENDING = { x: 226, y: 108, w: 196, h: 50 };
    var RESERVED = { x: 474, y: 108, w: 172, h: 50 };
    var ESCALATED = { x: 226, y: 226, w: 196, h: 50 };
    var DONE = { x: 474, y: 226, w: 172, h: 50 };

    function states(k, opts) {
      opts = opts || {};
      rounded(k, PENDING.x, PENDING.y, PENDING.w, PENDING.h, opts.pending);
      k.label(PENDING.x + PENDING.w / 2, PENDING.y + PENDING.h / 2, "RecommendationPending", {
        align: "center",
        size: 12,
        mono: true,
        color: INK,
      });
      rounded(k, RESERVED.x, RESERVED.y, RESERVED.w, RESERVED.h, opts.reserved);
      k.label(RESERVED.x + RESERVED.w / 2, RESERVED.y + RESERVED.h / 2, "Reserved", {
        align: "center",
        size: 12,
        mono: true,
        color: INK,
      });
      rounded(k, ESCALATED.x, ESCALATED.y, ESCALATED.w, ESCALATED.h, opts.escalated);
      k.label(ESCALATED.x + ESCALATED.w / 2, ESCALATED.y + ESCALATED.h / 2, "Escalated", {
        align: "center",
        size: 12,
        mono: true,
        color: INK,
      });
      rounded(k, DONE.x, DONE.y, DONE.w, DONE.h, opts.done);
      k.label(DONE.x + DONE.w / 2, DONE.y + DONE.h / 2, "Completed", {
        align: "center",
        size: 12,
        mono: true,
        color: INK,
      });
    }

    function acceptTransition(k, label, guard, opts) {
      opts = opts || {};
      var x1 = PENDING.x + PENDING.w;
      var y1 = PENDING.y + PENDING.h / 2;
      var x2 = RESERVED.x;
      var y2 = RESERVED.y + RESERVED.h / 2;
      umlRel(k, x1, y1, x2, y2, { kind: "arrow", color: opts.color || INK, lw: 2 });
      k.label((x1 + x2) / 2, y1 - 26, label, { align: "center", size: 11, mono: true, color: TEXT });
      if (guard) {
        k.label((x1 + x2) / 2, y1 - 10, guard, { align: "center", size: 11, mono: true, color: "#b45309" });
      }
    }

    window.Interactive.stepper("ix-state-machine", {
      title: "A state machine for one entity: Recommendation",
      subtitle:
        "The same object, a different question. Instead of what it is, the diagram says what it can be and what moves it.",
      height: H,
      frames: [
        {
          title: "1 — An initial pseudostate",
          caption:
            "A state machine describes the life of one object. The filled circle is not a state: it is the pseudostate that says where the object's life begins.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "initial pseudostate");
            initial(k, 120, 138);
            k.label(120, 172, "creation", { align: "center", size: 11, mono: true, color: MUTED });
            k.arrow(132, 138, 214, 138, { color: INK, lw: 2 });
            k.label(w / 2 + 60, h - 44, "one object, many possible histories", {
              align: "center",
              size: 11,
              color: MUTED,
            });
          },
        },
        {
          title: "2 — The first state",
          caption:
            "A rounded rectangle is a state: a condition the object is in for a period of time, during which it satisfies some invariant and may respond to events differently.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "state");
            initial(k, 60, 138);
            k.arrow(72, 138, 138, 138, { color: INK, lw: 2 });
            rounded(k, 142, 110, 240, 56);
            k.label(262, 138, "RecommendationPending", { align: "center", size: 12, mono: true, color: INK });
            note(k, 420, 96, 210, ["rounded corners:", "a state is held", "over time"]);
          },
        },
        {
          title: "3 — A transition with trigger, guard and effect",
          caption:
            "The arrow carries three separate things: the trigger event that starts it, the guard condition in brackets that must hold, and the effect after the slash. All three are optional, and all three are claims.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "transition = trigger [guard] / effect");
            initial(k, 40, 138);
            k.arrow(52, 138, 108, 138, { color: INK, lw: 2 });
            rounded(k, 112, 113, 170, 50);
            k.label(197, 138, "Pending", { align: "center", size: 12, mono: true, color: INK });
            rounded(k, 452, 113, 170, 50);
            k.label(537, 138, "Reserved", { align: "center", size: 12, mono: true, color: INK });
            acceptTransition(k, "accept()", "[in stock] / reserve()", {});
            k.label(w / 2, 62, "trigger        guard        effect", { align: "center", size: 11, mono: true, color: MUTED });
            k.label(w / 2, h - 40, "the guard is what makes the model testable: no guard, no way to be wrong", {
              align: "center",
              size: 11,
              color: MUTED,
            });
          },
        },
        {
          title: "4 — Resolution: one trigger, two outcomes",
          caption:
            "The same event can lead to different states depending on the guard. When the stock check fails, the machine does not fail — it escalates, which is the model's way of saying the human founder owns that decision.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "guards split the path");
            initial(k, 60, 138);
            k.arrow(72, 138, 128, 138, { color: INK, lw: 2 });
            rounded(k, 132, 113, 172, 50);
            k.label(218, 138, "Pending", { align: "center", size: 12, mono: true, color: INK });
            rounded(k, 466, 62, 176, 50);
            k.label(554, 87, "Reserved", { align: "center", size: 12, mono: true, color: INK });
            rounded(k, 466, 214, 176, 50);
            k.label(554, 239, "Escalated", { align: "center", size: 12, mono: true, color: INK });

            umlRel(k, 304, 128, 466, 87, { kind: "arrow" });
            k.label(384, 88, "accept()", { align: "center", size: 11, mono: true, color: TEXT });
            k.label(384, 104, "[in stock]", { align: "center", size: 11, mono: true, color: "#b45309" });

            umlRel(k, 304, 148, 466, 239, { kind: "arrow" });
            k.label(384, 212, "accept()", { align: "center", size: 11, mono: true, color: TEXT });
            k.label(384, 228, "[low confidence]", { align: "center", size: 11, mono: true, color: "#b45309" });

            k.label(w / 2, h - 34, "a guard that fails is still a designed behaviour", {
              align: "center",
              size: 11,
              color: MUTED,
            });
          },
        },
        {
          title: "5 — The full machine, with a final state",
          caption:
            "Completed is a final state: the bullseye ends this object's life. Note what is deliberately absent — there is no transition out of Completed, because a completed recommendation is evidence, not a process.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "the whole machine");
            initial(k, 52, 60);
            k.arrow(64, 60, 210, 60, { color: INK, lw: 2 });
            k.label(96, 46, "create()", { size: 11, mono: true, color: MUTED });

            states(k, { pending: "#eef0fe" });

            umlRel(k, 422, 123, 474, 123, { kind: "arrow" });
            k.label(448, 106, "accept()", { align: "center", size: 10, mono: true, color: TEXT });
            k.label(448, 140, "[in stock]", { align: "center", size: 10, mono: true, color: "#b45309" });

            umlRel(k, 422, 148, 474, 241, { kind: "arrow" });
            k.label(448, 186, "accept()", { align: "center", size: 10, mono: true, color: TEXT });
            k.label(448, 202, "[no stock]", { align: "center", size: 10, mono: true, color: "#b45309" });

            umlRel(k, 560, 158, 560, 226, { kind: "arrow" });
            k.label(576, 192, "ship()", { size: 10, mono: true, color: TEXT, align: "left" });

            umlRel(k, 374, 251, 474, 251, { kind: "arrow" });
            k.label(424, 268, "resolve()", { align: "center", size: 10, mono: true, color: TEXT });

            finalState(k, 300, 300);
            k.label(322, 300, "Completed is final", { size: 11, color: MUTED });
          },
        },
        {
          title: "6 — Execute the machine on one order",
          caption:
            "Trace a single order: A-1042 is created, the customer accepts, the stock check passes, the pair ships and the order completes. Every arrow taken here is a path through the model, and the model is what makes the path checkable.",
          draw: function (ctx, w, h, k) {
            base(k);
            frameTitle(k, w, "one execution path", "A-1042, in stock");
            initial(k, 88, 96);
            k.arrow(100, 96, 200, 96, { color: INK, lw: 2 });
            k.label(126, 82, "create()", { size: 11, mono: true, color: MUTED });

            rounded(k, 204, 71, 200, 50);
            k.label(304, 96, "RecommendationPending", { align: "center", size: 12, mono: true, color: INK });

            rounded(k, 214, 200, 180, 50, "#eaf7f2");
            k.label(304, 225, "Reserved", { align: "center", size: 12, mono: true, color: "#047857" });

            umlRel(k, 304, 121, 304, 200, { kind: "arrow", color: "#047857" });
            k.label(316, 160, "accept() [in stock] / reserve()", { size: 10.5, mono: true, color: "#047857" });

            k.dot(300, 290, 10, { fill: "#047857", stroke: "#047857" });
            k.label(320, 290, "shipped() \u2192 Completed", { size: 11, color: MUTED });

            k.label(w - 30, h - 40, "the same event with a failing guard would have taken the Escalated path", {
              align: "right",
              size: 11,
              color: MUTED,
            });
          },
        },
      ],
    });
  }
})();
