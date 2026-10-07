(function () {
  "use strict";

  /* ELEC5620 — Week 3 (chapter 3) page behaviour.
   *
   * The declarative widgets (race, matcher, hotspot) are mounted from the JSON
   * config blocks in the pages by shared/interactive.js. This file owns the
   * animated canvas steppers — the diagrams that build up element by element —
   * plus the re-binding a language swap requires.
   */

  var CANVAS_INK = "#0e7490";
  var CANVAS_INK_SOFT = "#565d75";
  var CANVAS_LINE = "#94a3b8";
  var CANVAS_ACCENT = "#4f46e5";
  var CANVAS_PURPLE = "#7e22ce";
  var CANVAS_GREEN = "#059669";

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: a failure in the shared chrome must not stop the
     * page's own animations from mounting. */
    rebind();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every widget
   * container inside a translated section is a brand-new node. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    rebind();
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
        window.console.error("[ELEC5620 chapter 3] chapter chrome failed to initialise:", err);
      }
    }
  }

  function drawFeatureNode(k, x, y, bw, bh, text, isRoot) {
    k.box(x - bw / 2, y - bh / 2, bw, bh, {
      fill: isRoot ? "#e0e7ff" : "#ffffff",
      stroke: isRoot ? CANVAS_ACCENT : CANVAS_INK,
      lw: isRoot ? 2 : 1.6,
      r: 8
    });
    k.label(x, y, text, {
      align: "center",
      size: isRoot ? 12 : 11,
      baseline: "middle",
      color: isRoot ? CANVAS_ACCENT : CANVAS_INK
    });
  }

  /* Root feature plus the three mandatory capabilities, at normalised
   * coordinates so the diagram scales with the canvas width. */
  function featureBase(k, w) {
    var cx = w / 2;
    var by = 52;
    var cy = 122;
    var maxSpan = w / 2 - 92;
    var span = Math.min(w * 0.3, maxSpan);
    var kids = [
      { dx: -span, label: "Security Validation" },
      { dx: 0, label: "Violation Notification" },
      { dx: span, label: "Manual Control" }
    ];
    kids.forEach(function (kid) {
      k.arrow(cx, by + 15, cx + kid.dx, cy - 15, { color: CANVAS_LINE, lw: 1.6 });
      drawFeatureNode(k, cx + kid.dx, cy, 170, 30, kid.label, false);
    });
    drawFeatureNode(k, cx, by, 200, 30, "Secure Room Software", true);
    /* Mandatory refinement: filled circle just below the parent node. */
    kids.forEach(function (kid) {
      k.dot(cx + kid.dx * 0.24, by + 15 + 40 * 0.24, 5, { fill: CANVAS_ACCENT, stroke: CANVAS_ACCENT });
    });
    return { cx: cx, by: by, cy: cy, span: span, kids: kids };
  }

  function featureLegend(k, w, h, mandatoryText, optionalText) {
    k.dot(30, h - 44, 5, { fill: CANVAS_ACCENT, stroke: CANVAS_ACCENT });
    k.label(44, h - 44, mandatoryText, { size: 11, baseline: "middle", color: CANVAS_INK_SOFT });
    k.dot(30, h - 24, 5, { fill: "#ffffff", stroke: CANVAS_ACCENT, lw: 1.8 });
    k.label(44, h - 24, optionalText, { size: 11, baseline: "middle", color: CANVAS_INK_SOFT });
  }

  function initFeatureDiagram() {
    var host = document.getElementById("ix-feature-diagram");
    if (!host || !window.Interactive) return;
    if (host.firstElementChild && host.firstElementChild.tagName === "CANVAS") return;

    var MANDATORY = "mandatory: the child must be selected whenever the parent is";
    var OPTIONAL = "optional: the child may be selected or not";

    window.Interactive.stepper("ix-feature-diagram", {
      title: "Build the feature diagram for the secure room software",
      subtitle: "Frame by frame, the notation the tutorial expects you to draw.",
      height: 380,
      frames: [
        {
          title: "1. The root feature names the product line",
          caption: "A feature diagram is a set of nodes joined by refinement edges. The root is the concept being refined — here, everything the secure room software must be able to do.",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawFeatureNode(k, w / 2, 52, 200, 30, "Secure Room Software", true);
            k.label(w / 2, 104, "root feature", { align: "center", size: 11, mono: true, color: CANVAS_INK_SOFT });
            k.label(w / 2, 134, "the rest of the diagram refines this concept into selectable capabilities", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
          }
        },
        {
          title: "2. Mandatory sub-features: a filled circle on the edge",
          caption: "Each refinement edge carries a filled circle at the parent end when the child must be selected. All three of these are mandatory — a room with no validation, no notification and no manual control is not this product.",
          draw: function (ctx, w, h, k) {
            k.clear();
            featureBase(k, w);
            featureLegend(k, w, h, MANDATORY, OPTIONAL);
          }
        },
        {
          title: "3. Optional sub-features: a hollow circle",
          caption: "A hollow circle at the parent end means the child may or may not be selected. Fingerprint identification is the expected check, but a deployment that issues cards instead is still a valid member of the family.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var base = featureBase(k, w);
            var left = base.cx - base.span;
            var gy = 220;
            var dy = gy - 14;

            k.arrow(left, base.cy + 15, left - 62, dy, { color: CANVAS_LINE, lw: 1.6 });
            k.arrow(left, base.cy + 15, left + 62, dy, { color: CANVAS_LINE, lw: 1.6 });
            k.dot(left - 62 * 0.3, base.cy + 15 + (dy - base.cy - 15) * 0.3, 5, {
              fill: "#ffffff",
              stroke: CANVAS_ACCENT,
              lw: 1.8
            });
            k.dot(left + 62 * 0.3, base.cy + 15 + (dy - base.cy - 15) * 0.3, 5, {
              fill: CANVAS_ACCENT,
              stroke: CANVAS_ACCENT
            });
            drawFeatureNode(k, left - 62, gy, 150, 28, "Fingerprint ID", false);
            drawFeatureNode(k, left + 62, gy, 150, 28, "Audible Alarm", false);

            k.label(base.cx + base.span, gy, "no refinement yet", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
            featureLegend(k, w, h, MANDATORY, OPTIONAL);
          }
        },
        {
          title: "4. Groups: or, and alternative (xor)",
          caption: "A filled arc over sibling edges is an or-group — at least one must be selected. A hollow arc is an alternative group — exactly one. The two manual triggers are a choice, so exactly one of them is present in any product.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var base = featureBase(k, w);
            var right = base.cx + base.span;
            var gy = 220;
            var dy = gy - 14;

            k.arrow(right, base.cy + 15, right - 58, dy, { color: CANVAS_LINE, lw: 1.6 });
            k.arrow(right, base.cy + 15, right + 58, dy, { color: CANVAS_LINE, lw: 1.6 });
            drawFeatureNode(k, right - 58, gy, 148, 28, "Enable Button", false);
            drawFeatureNode(k, right + 58, gy, 148, 28, "Panic Button", false);

            /* Hollow arc across the two sibling edges: exactly one. */
            k.box(right - 58, 174, 116, 10, { stroke: CANVAS_PURPLE, lw: 2, r: 5 });
            k.label(right, 162, "alternative (xor) — exactly one", {
              align: "center",
              size: 11,
              color: CANVAS_PURPLE
            });
            k.label(base.cx - base.span, gy, "or-group: at least one", {
              align: "center",
              size: 11,
              color: CANVAS_PURPLE
            });

            k.label(30, h - 26, "or-group = filled arc    |    xor-group = hollow arc", {
              size: 11,
              mono: true,
              color: CANVAS_INK_SOFT
            });
          }
        },
        {
          title: "5. A cross-tree constraint",
          caption: "Constraints cross branches: a dashed arrow labelled with the condition. Any configuration that includes fingerprint identification must also include the audible alarm, because a missed scan and a forced door are indistinguishable without it.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var base = featureBase(k, w);
            var left = base.cx - base.span;
            var gy = 220;
            var dy = gy - 14;

            k.arrow(left, base.cy + 15, left - 62, dy, { color: CANVAS_LINE, lw: 1.6 });
            k.arrow(left, base.cy + 15, left + 62, dy, { color: CANVAS_LINE, lw: 1.6 });
            drawFeatureNode(k, left - 62, gy, 150, 28, "Fingerprint ID", false);
            drawFeatureNode(k, left + 62, gy, 150, 28, "Audible Alarm", false);

            k.arrow(left - 62, gy + 20, left + 62, gy + 20, { color: CANVAS_PURPLE, lw: 1.8, dash: [6, 4] });
            k.label(left, gy + 44, "if (Fingerprint ID) then Audible Alarm", {
              align: "center",
              size: 11,
              color: CANVAS_PURPLE
            });
            k.label(w / 2, h - 26, "static model: it says what may coexist, not in what order it happens", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
          }
        }
      ]
    });
  }

  /* ── Stepper: requirements engineering as a continuous process ── */

  function initReStepper() {
    var host = document.getElementById("ix-re");
    if (!host || !window.Interactive) return;
    if (host.firstElementChild && host.firstElementChild.tagName === "CANVAS") return;

    var stages = [
      {
        name: "Elicit",
        note: "What problems need to be solved? Where is the system boundary? Who are the stakeholders and what are their goals?"
      },
      { name: "Model", note: "Document what was captured in a form amenable to analysis: features, use cases, scenarios." },
      { name: "Communicate", note: "Give every stakeholder something they can read, question and reason about." },
      { name: "Agree", note: "Validate with stakeholders. A model nobody signed off is a draft, not a requirement." },
      { name: "Evolve", note: "Change is normal: extend, re-negotiate, and keep the trace to design and test intact." }
    ];

    window.Interactive.stepper("ix-re", {
      title: "Requirements engineering is a process, not a document",
      subtitle: "The deck's five activities, and the loop back from evolution to elicitation.",
      height: 320,
      frames: stages.map(function (stage, i) {
        return {
          title: "Step " + (i + 1) + ": " + stage.name,
          caption: stage.note,
          draw: function (ctx, w, h, k) {
            k.clear();
            var pad = 22;
            var y = 46;
            var bw = (w - pad * 2 - 4 * 14) / 5;
            var bh = 56;

            var order = stages.map(function (s) {
              return s.name;
            });

            order.forEach(function (name, j) {
              var x = pad + j * (bw + 14);
              var done = j < i;
              var active = j === i;
              k.box(x, y, bw, bh, {
                fill: active ? "#e0e7ff" : done ? "#ecfdf5" : "#ffffff",
                stroke: active ? CANVAS_ACCENT : done ? CANVAS_GREEN : CANVAS_LINE,
                lw: active ? 2.2 : 1.4,
                r: 10
              });
              k.label(x + bw / 2, y + bh / 2 - 6, name, {
                align: "center",
                size: 12,
                baseline: "middle",
                color: active ? CANVAS_ACCENT : CANVAS_INK
              });
              k.label(x + bw / 2, y + bh / 2 + 12, done ? "done" : active ? "current" : "pending", {
                align: "center",
                size: 10,
                mono: true,
                baseline: "middle",
                color: CANVAS_INK_SOFT
              });
              if (j < order.length - 1) {
                k.arrow(x + bw + 2, y + bh / 2, x + bw + 12, y + bh / 2, { color: CANVAS_LINE, lw: 1.6 });
              }
            });

            /* The loop back from Evolve to Elicit — requirements never freeze. */
            k.arrow(pad + 4.5 * (bw + 14) + bw / 2, y + bh + 6, pad + bw / 2, y + bh + 6, {
              color: CANVAS_PURPLE,
              lw: 1.8,
              dash: [6, 5]
            });
            k.label(w / 2, y + bh + 30, "evolution feeds the next round of elicitation", {
              align: "center",
              size: 11,
              color: CANVAS_PURPLE
            });

            k.label(pad, h - 40, "Modeling is one common technique in support of these objectives — but not the only one.", {
              size: 11,
              color: CANVAS_INK_SOFT
            });
            k.label(pad, h - 22, "(B. Nuseibeh, S. Easterbrook, quoted in the deck)", {
              size: 10,
              color: CANVAS_INK_SOFT
            });
          }
        };
      })
    });
  }

  /* ── Stepper: the use case diagram, built element by element ── */

  function initUseCaseBuildStepper() {
    var host = document.getElementById("ix-uc-build");
    if (!host || !window.Interactive) return;
    if (host.firstElementChild && host.firstElementChild.tagName === "CANVAS") return;

    /* Actor glyph: role name is what makes it an actor, so it sits under the figure. */
    function actor(k, x, y, name, color) {
      k.dot(x, y - 24, 8, { fill: "#ffffff", stroke: color, lw: 1.8 });
      k.arrow(x, y - 16, x, y + 2, { color: color, lw: 1.8 });
      k.arrow(x - 15, y - 10, x + 15, y - 10, { color: color, lw: 1.8 });
      k.arrow(x, y + 2, x - 14, y + 22, { color: color, lw: 1.8 });
      k.arrow(x, y + 2, x + 14, y + 22, { color: color, lw: 1.8 });
      if (name) k.label(x, y + 40, name, { align: "center", size: 11, color: color });
    }

    function useCase(k, x, y, label) {
      k.dot(x, y, 40, { fill: "#ffffff", stroke: CANVAS_INK, lw: 1.6 });
      k.label(x, y - 6, label[0] || label, { align: "center", size: 11, baseline: "middle", color: CANVAS_INK });
      if (label[1]) {
        k.label(x, y + 9, label[1], { align: "center", size: 11, baseline: "middle", color: CANVAS_INK });
      }
    }

    window.Interactive.stepper("ix-uc-build", {
      title: "Constructing a use case diagram",
      subtitle: "Boundary, actors, use cases, associations — added in the order the notation demands.",
      height: 400,
      frames: [
        {
          title: "1. Draw the system boundary first",
          caption: "The rectangle is the scope of the system under consideration, as defined by the requirements document. Everything inside is what you are building; everything outside is an actor or another system.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bx = w / 2 - 150;
            var by = 40;
            k.box(bx, by, 300, 210, { stroke: CANVAS_ACCENT, lw: 2, r: 12 });
            k.label(bx + 12, by + 22, "Secure Access System", { size: 12, color: CANVAS_ACCENT });
          }
        },
        {
          title: "2. Place the actors outside it",
          caption: "An actor is an entity — person or system — that interacts with the system to achieve one or more goals. It is named by a noun and lives outside the boundary.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bx = w / 2 - 150;
            var by = 40;
            k.box(bx, by, 300, 210, { stroke: CANVAS_ACCENT, lw: 2, r: 12 });
            k.label(bx + 12, by + 22, "Secure Access System", { size: 12, color: CANVAS_ACCENT });
            actor(k, bx - 66, 130, "Authorised User", CANVAS_ACCENT);
            actor(k, bx + 300 + 66, 130, "Police Station", CANVAS_PURPLE);
          }
        },
        {
          title: "3. Put the use cases inside, named verb + noun",
          caption: "Each ellipse is a collection of possible interactions relating to one or more goals. The tutorial's naming rule is verb + noun: Enter Secure Room, Identify by Fingerprint, Summon Police.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bx = w / 2 - 150;
            var by = 40;
            k.box(bx, by, 300, 210, { stroke: CANVAS_ACCENT, lw: 2, r: 12 });
            k.label(bx + 12, by + 22, "Secure Access System", { size: 12, color: CANVAS_ACCENT });
            actor(k, bx - 66, 130, "Authorised User", CANVAS_ACCENT);
            actor(k, bx + 300 + 66, 130, "Police Station", CANVAS_PURPLE);
            useCase(k, bx + 150, 108, ["Enter Secure", "Room"]);
            useCase(k, bx + 64, 206, ["Identify by", "Fingerprint"]);
          }
        },
        {
          title: "4. Join actor to use case with a solid association",
          caption: "Participation is shown by a solid link: the actor and the use case communicate with one another using messages. Every actor must be linked to at least one use case.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bx = w / 2 - 150;
            var by = 40;
            k.box(bx, by, 300, 210, { stroke: CANVAS_ACCENT, lw: 2, r: 12 });
            k.label(bx + 12, by + 22, "Secure Access System", { size: 12, color: CANVAS_ACCENT });
            actor(k, bx - 66, 130, "Authorised User", CANVAS_ACCENT);
            actor(k, bx + 300 + 66, 130, "Police Station", CANVAS_PURPLE);
            useCase(k, bx + 150, 108, ["Enter Secure", "Room"]);
            useCase(k, bx + 64, 206, ["Identify by", "Fingerprint"]);
            k.arrow(bx - 50, 120, bx + 116, 110, { color: CANVAS_LINE, lw: 1.8 });
            k.label(bx - 96, 176, "association", { size: 10, mono: true, color: CANVAS_INK_SOFT });
          }
        },
        {
          title: "5. Add «include» for the necessary sub-use case",
          caption: "A step of a scenario may represent a lower-level use case. The dashed arrow points at the included child, because Enter Secure Room cannot reach its goal without the identification step.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bx = w / 2 - 150;
            var by = 40;
            k.box(bx, by, 300, 210, { stroke: CANVAS_ACCENT, lw: 2, r: 12 });
            k.label(bx + 12, by + 22, "Secure Access System", { size: 12, color: CANVAS_ACCENT });
            actor(k, bx - 66, 130, "Authorised User", CANVAS_ACCENT);
            actor(k, bx + 300 + 66, 130, "Police Station", CANVAS_PURPLE);
            useCase(k, bx + 150, 108, ["Enter Secure", "Room"]);
            useCase(k, bx + 64, 206, ["Identify by", "Fingerprint"]);
            k.arrow(bx - 50, 120, bx + 116, 110, { color: CANVAS_LINE, lw: 1.8 });
            k.arrow(bx + 118, 136, bx + 84, 174, { color: CANVAS_INK, lw: 1.6, dash: [6, 4] });
            k.label(bx + 138, 160, "\u00ABinclude\u00BB", { size: 10, color: CANVAS_ACCENT });
          }
        },
        {
          title: "6. Add «extend» for the optional behaviour",
          caption: "The extending use case points at the base use case and carries a condition. Summon Police is woven into Enter Secure Room at the panic-button extension point — the base scenario is unchanged when it does not fire.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bx = w / 2 - 150;
            var by = 40;
            k.box(bx, by, 300, 210, { stroke: CANVAS_ACCENT, lw: 2, r: 12 });
            k.label(bx + 12, by + 22, "Secure Access System", { size: 12, color: CANVAS_ACCENT });
            actor(k, bx - 66, 130, "Authorised User", CANVAS_ACCENT);
            actor(k, bx + 300 + 66, 130, "Police Station", CANVAS_PURPLE);
            useCase(k, bx + 150, 108, ["Enter Secure", "Room"]);
            useCase(k, bx + 64, 206, ["Identify by", "Fingerprint"]);
            useCase(k, bx + 236, 206, ["Summon", "Police"]);
            k.arrow(bx - 50, 120, bx + 116, 110, { color: CANVAS_LINE, lw: 1.8 });
            k.arrow(bx + 118, 136, bx + 84, 174, { color: CANVAS_INK, lw: 1.6, dash: [6, 4] });
            k.label(bx + 138, 160, "\u00ABinclude\u00BB", { size: 10, color: CANVAS_ACCENT });
            k.arrow(bx + 236, 174, bx + 178, 148, { color: CANVAS_INK, lw: 1.6, dash: [6, 4] });
            k.label(bx + 268, 156, "\u00ABextend\u00BB", { size: 10, color: CANVAS_ACCENT });
            k.arrow(bx + 300 + 20, 130, bx + 276, 190, { color: CANVAS_LINE, lw: 1.6 });
            k.label(w / 2, h - 24, "extension point X1 = panic button pressed", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
          }
        }
      ]
    });
  }

  /* ── Stepper: the three use case relationships, side by side ── */

  function initRelationshipStepper() {
    var host = document.getElementById("ix-rel-stepper");
    if (!host || !window.Interactive) return;
    if (host.firstElementChild && host.firstElementChild.tagName === "CANVAS") return;

    function pair(k, x, y, bw, bh, top, bottom, accent) {
      k.box(x, y, bw, bh, { fill: "#ffffff", stroke: accent, lw: 1.6, r: 8 });
      k.label(x + bw / 2, y + bh / 2, top, { align: "center", size: 11, baseline: "middle", color: accent });
      k.box(x, y + bh + 56, bw, bh, { fill: "#ffffff", stroke: CANVAS_INK, lw: 1.6, r: 8 });
      k.label(x + bw / 2, y + bh + 56 + bh / 2, bottom, {
        align: "center",
        size: 11,
        baseline: "middle",
        color: CANVAS_INK
      });
    }

    window.Interactive.stepper("ix-rel-stepper", {
      title: "The three relationships, drawn",
      subtitle: "Same two use cases, three different meanings — and three different arrowheads.",
      height: 360,
      frames: [
        {
          title: "«include» — the base needs the child",
          caption: "Dashed arrow, open arrowhead, pointing at the included use case. The main use case includes actions from the child: withdrawing cash cannot complete without a login.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = 170;
            var bh = 40;
            var x = w / 2 - bw / 2;
            pair(k, x, 44, bw, bh, "Withdraw Cash", "Login", CANVAS_INK);
            k.arrow(x + bw / 2, 44 + bh + 6, x + bw / 2, 44 + bh + 46, {
              color: CANVAS_INK,
              lw: 1.8,
              dash: [7, 5]
            });
            k.label(x + bw / 2 + 12, 44 + bh + 26, "\u00ABinclude\u00BB", { size: 11, color: CANVAS_ACCENT });
            k.label(w / 2, h - 60, "tip points at the child use case", { align: "center", size: 11, color: CANVAS_INK_SOFT });
            k.label(w / 2, h - 40, "the base scenario cannot finish without the child's goal", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
          }
        },
        {
          title: "«extend» — the child may be woven into the base",
          caption: "Dashed arrow, open arrowhead, pointing at the base use case, labelled with the condition and the extension point. Delete it and the base use case spec is still complete.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = 190;
            var bh = 40;
            var x = w / 2 - bw / 2;
            pair(k, x, 44, bw, bh, "Update Branch Balance", "Withdraw Cash", CANVAS_PURPLE);
            k.arrow(x + bw / 2, 44 + bh + 6, x + bw / 2, 44 + bh + 46, {
              color: CANVAS_INK,
              lw: 1.8,
              dash: [7, 5]
            });
            k.label(x + bw / 2 + 12, 44 + bh + 26, "\u00ABextend\u00BB", { size: 11, color: CANVAS_ACCENT });
            k.label(w / 2, h - 60, "tip points at the base use case", { align: "center", size: 11, color: CANVAS_INK_SOFT });
            k.label(w / 2, h - 40, "condition [service successful]  ·  extension point X1", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
          }
        },
        {
          title: "Generalization — the child specialises the parent",
          caption: "Solid line with a hollow triangle at the parent end, and the child connected at the base of the arrow. The child is an enhancement of the parent and is used wherever the parent would be.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = 190;
            var bh = 40;
            var x = w / 2 - bw / 2;
            pair(k, x, 44, bw, bh, "Enter Secure Room using Fingerprint", "Enter Secure Room", CANVAS_GREEN);
            k.box(x + bw / 2 - 9, 44 + bh + 20, 18, 14, { fill: "#ffffff", stroke: CANVAS_INK, lw: 1.8 });
            k.arrow(x + bw / 2, 44 + bh + 6, x + bw / 2, 44 + bh + 20, { color: CANVAS_INK, lw: 1.8 });
            k.label(x + bw / 2 + 14, 44 + bh + 27, "hollow triangle, no stereotype", {
              size: 11,
              color: CANVAS_INK_SOFT
            });
            k.label(w / 2, h - 60, "tip points at the parent (general) use case", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
            k.label(w / 2, h - 40, "same goal, a different way of reaching it", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
          }
        },
        {
          title: "The three side by side",
          caption: "Memorise the arrowheads, not the pictures: include and extend are both dashed but point in opposite directions, and generalization is the only solid one.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cols = [
              { x: w * 0.18, title: "\u00ABinclude\u00BB", colour: CANVAS_INK, base: "Withdraw Cash", child: "Login" },
              { x: w * 0.5, title: "\u00ABextend\u00BB", colour: CANVAS_PURPLE, base: "Withdraw Cash", child: "Update Balance" },
              { x: w * 0.82, title: "generalization", colour: CANVAS_GREEN, base: "Enter Room", child: "Enter by Fingerprint" }
            ];
            cols.forEach(function (col) {
              k.label(col.x, 34, col.title, { align: "center", size: 12, mono: true, color: col.colour });
              k.box(col.x - 78, 52, 156, 34, { fill: "#ffffff", stroke: CANVAS_INK, lw: 1.5, r: 7 });
              k.label(col.x, 69, col.base, { align: "center", size: 10, baseline: "middle", color: CANVAS_INK });
              k.box(col.x - 78, 158, 156, 34, { fill: "#ffffff", stroke: col.colour, lw: 1.5, r: 7 });
              k.label(col.x, 175, col.child, { align: "center", size: 10, baseline: "middle", color: col.colour });
            });
            k.arrow(w * 0.18, 92, w * 0.18, 152, { color: CANVAS_INK, lw: 1.7, dash: [6, 4] });
            k.arrow(w * 0.5, 152, w * 0.5, 92, { color: CANVAS_PURPLE, lw: 1.7, dash: [6, 4] });
            k.arrow(w * 0.82, 152, w * 0.82, 98, { color: CANVAS_GREEN, lw: 1.7 });
            k.box(w * 0.82 - 8, 92, 16, 12, { fill: "#ffffff", stroke: CANVAS_GREEN, lw: 1.6 });
            k.label(w / 2, h - 34, "child \u2192 required   |   child \u2192 optional (base)   |   child \u2192 specialisation (parent)", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
          }
        }
      ]
    });
  }

  /* ── Stepper: one ATM scenario, step by step ────────────────── */

  function initAtmScenarioStepper() {
    var host = document.getElementById("ix-atm-scenario");
    if (!host || !window.Interactive) return;
    if (host.firstElementChild && host.firstElementChild.tagName === "CANVAS") return;

    var MAIN = [
      "User logs into ATM",
      "User selects withdrawal service",
      "User specifies amount",
      "ATM dispenses specified amount",
      "User logs out"
    ];

    function stepRow(k, x, bw, y, bh, labelText, state, prefix) {
      var active = state === "active";
      var done = state === "done";
      k.box(x, y, bw, bh, {
        fill: active ? "#e0e7ff" : done ? "#ecfdf5" : "#ffffff",
        stroke: active ? CANVAS_ACCENT : done ? CANVAS_GREEN : CANVAS_LINE,
        lw: active ? 2.2 : 1.4,
        r: 6
      });
      k.label(x + 9, y + bh / 2, prefix, {
        size: 10,
        mono: true,
        baseline: "middle",
        color: active ? CANVAS_ACCENT : CANVAS_INK_SOFT
      });
      k.label(x + 30, y + bh / 2, labelText, { size: 11, baseline: "middle", color: CANVAS_INK });
    }

    /* Shared geometry so the three frames line up exactly. */
    function layout(w) {
      var x = 104;
      var bh = 28;
      var gap = 12;
      var y0 = 42;
      var bw = Math.min(Math.max(w * 0.42, 240), 360);
      var stepR = x + bw;
      var rowY = function (i) {
        return y0 + i * (bh + gap);
      };
      var endY = rowY(MAIN.length);
      var exX = stepR + 30;
      var exW = Math.max(96, Math.min(158, w - exX - 16));
      return {
        x: x,
        bw: bw,
        bh: bh,
        y0: y0,
        stepR: stepR,
        rowY: rowY,
        endY: endY,
        exX: exX,
        exW: exW,
        exCx: exX + exW / 2
      };
    }

    function precondition(k, geo, w, h) {
      k.label(geo.x, 20, "{Use Case Precondition}  ·  User has ATM-readable card", {
        size: 11,
        color: CANVAS_INK_SOFT
      });
      k.label(geo.x, h - 16, "State that must hold before the trigger fires. The trigger itself is the insertion of the card.", {
        size: 11,
        color: CANVAS_INK_SOFT
      });
      k.label(w - 16, h - 16, "5 steps in the main success scenario", {
        align: "right",
        size: 11,
        mono: true,
        color: CANVAS_INK_SOFT
      });
    }

    var frames = MAIN.map(function (text, i) {
      return {
        title: "Main success scenario, step " + (i + 1) + " of " + MAIN.length,
        caption: text + ". In general every step can succeed or fail — the condition that leads to a failure heads the corresponding extension scenario and branches from the point of failure.",
        draw: function (ctx, w, h, k) {
          k.clear();
          var geo = layout(w);
          precondition(k, geo, w, h);
          MAIN.forEach(function (label, j) {
            stepRow(k, geo.x, geo.bw, geo.rowY(j), geo.bh, label, j === i ? "active" : j < i ? "done" : "todo", String(j + 1) + ".");
          });
          var markY = geo.rowY(i) + geo.bh / 2;
          k.arrow(geo.x - 78, markY, geo.x - 12, markY, { color: CANVAS_ACCENT, lw: 1.6 });
          k.label(geo.x - 84, markY, "can fail here", {
            align: "right",
            size: 10,
            baseline: "middle",
            color: CANVAS_INK_SOFT
          });
          k.box(geo.x, geo.endY + 8, geo.bw, 30, {
            fill: "#ecfdf5",
            stroke: CANVAS_GREEN,
            lw: 1.6,
            r: 8
          });
          k.label(geo.x + geo.bw / 2, geo.endY + 23, "{Goal achieved}  SUCCESS", {
            align: "center",
            size: 11,
            baseline: "middle",
            color: CANVAS_GREEN
          });
        }
      };
    });

    frames.push({
      title: "An extension scenario branches off step 4",
      caption: "{Insufficient cash on hand} holds at step 4, so control leaves the main scenario at that point and runs the extension: notify the user, then log them out. The extension must end in the goal being achieved or not achieved — here, not achieved.",
      draw: function (ctx, w, h, k) {
        k.clear();
        var geo = layout(w);
        precondition(k, geo, w, h);
        MAIN.forEach(function (label, j) {
          stepRow(k, geo.x, geo.bw, geo.rowY(j), geo.bh, label, j === 3 ? "active" : j < 3 ? "done" : "todo", String(j + 1) + ".");
        });

        var branchY = geo.rowY(3) + geo.bh / 2;
        k.arrow(geo.stepR + 4, branchY, geo.exX - 6, branchY, { color: CANVAS_PURPLE, lw: 1.8 });
        k.label(geo.stepR + 16, branchY - 26, "{Insufficient cash on hand}", {
          size: 10,
          color: CANVAS_PURPLE
        });
        k.label(geo.exX, branchY - 10, "\u00ABextend\u00BB / failure branch", {
          size: 10,
          mono: true,
          color: CANVAS_PURPLE
        });

        k.box(geo.exX, branchY - 4, geo.exW, 104, {
          fill: "#faf5ff",
          stroke: CANVAS_PURPLE,
          lw: 1.6,
          r: 8
        });
        k.label(geo.exCx, branchY + 16, "EXTENSION 4.a", {
          align: "center",
          size: 10,
          mono: true,
          color: CANVAS_PURPLE
        });
        k.label(geo.exCx, branchY + 38, "1. Notify user", { align: "center", size: 11, color: CANVAS_INK });
        k.label(geo.exCx, branchY + 56, "2. Log out user", { align: "center", size: 11, color: CANVAS_INK });
        k.label(geo.exCx, branchY + 80, "{Goal not achieved}", {
          align: "center",
          size: 10,
          color: CANVAS_INK_SOFT
        });
        k.label(geo.exCx, branchY + 96, "FAILURE", {
          align: "center",
          size: 11,
          weight: "700",
          color: CANVAS_PURPLE
        });

        k.box(geo.x, geo.endY + 8, geo.bw, 30, {
          fill: "#ffffff",
          stroke: CANVAS_LINE,
          lw: 1.4,
          r: 8
        });
        k.label(geo.x + geo.bw / 2, geo.endY + 23, "main scenario stops at step 4", {
          align: "center",
          size: 11,
          baseline: "middle",
          color: CANVAS_INK_SOFT
        });
      }
    });

    frames.push({
      title: "A step may itself be a nested use case",
      caption: "Step 1 is a use case at a lower level, with its own sub-goals and actors: {ATM card inserted}, then ask for the PIN, validate it, and so on. In the diagram it is attached to the base use case with «include».",
      draw: function (ctx, w, h, k) {
        k.clear();
        var geo = layout(w);
        precondition(k, geo, w, h);
        MAIN.forEach(function (label, j) {
          stepRow(k, geo.x, geo.bw, geo.rowY(j), geo.bh, label, j === 0 ? "active" : "todo", String(j + 1) + ".");
        });

        var fromY = geo.rowY(0) + geo.bh / 2;
        k.arrow(geo.stepR + 4, fromY, geo.exX - 6, fromY, { color: CANVAS_INK, lw: 1.8, dash: [6, 4] });
        k.label(geo.exX, fromY - 10, "\u00ABinclude\u00BB", { size: 10, mono: true, color: CANVAS_ACCENT });

        var boxH = 150;
        k.box(geo.exX, fromY - 28, geo.exW, boxH, { fill: "#ffffff", stroke: CANVAS_INK, lw: 1.6, r: 8 });
        k.label(geo.exCx, fromY - 10, "Login  (sub-use case)", {
          align: "center",
          size: 11,
          weight: "700",
          color: CANVAS_INK
        });
        k.label(geo.exCx, fromY + 12, "{ATM card inserted}", { align: "center", size: 10, color: CANVAS_ACCENT });
        k.label(geo.exCx, fromY + 34, "1. Ask user PIN", { align: "center", size: 10, color: CANVAS_INK });
        k.label(geo.exCx, fromY + 52, "2. User enters PIN", { align: "center", size: 10, color: CANVAS_INK });
        k.label(geo.exCx, fromY + 70, "3. Validate PIN", { align: "center", size: 10, color: CANVAS_INK });
        k.label(geo.exCx, fromY + 92, "4. …", { align: "center", size: 10, color: CANVAS_INK_SOFT });
        k.label(geo.exCx, fromY + 112, "own precondition,", { align: "center", size: 10, color: CANVAS_INK_SOFT });

        k.box(geo.x, geo.endY + 8, geo.bw, 30, {
          fill: "#ecfdf5",
          stroke: CANVAS_GREEN,
          lw: 1.6,
          r: 8
        });
        k.label(geo.x + geo.bw / 2, geo.endY + 23, "{Goal achieved}  SUCCESS", {
          align: "center",
          size: 11,
          baseline: "middle",
          color: CANVAS_GREEN
        });
      }
    });

    window.Interactive.stepper("ix-atm-scenario", {
      title: "Withdraw Cash from ATM — one scenario, then its branches",
      subtitle: "The deck's worked use case, walked through as the use case specification describes it.",
      height: 440,
      frames: frames
    });
  }

  /* ── Stepper: the traceability chain ────────────────────────── */

  function initTraceStepper() {
    var host = document.getElementById("ix-trace");
    if (!host || !window.Interactive) return;
    if (host.firstElementChild && host.firstElementChild.tagName === "CANVAS") return;

    var chain = [
      { label: "Stakeholder goal", note: "The purpose the software is intended to serve." },
      { label: "Use case", note: "A collection of interactions relating to that goal, with actors and a trigger." },
      { label: "Scenario step", note: "A single numbered interaction, each of which can succeed or fail." },
      { label: "Design element", note: "The component or interface that realises the step." },
      { label: "Test case", note: "The evidence that the step was implemented as specified." }
    ];

    window.Interactive.stepper("ix-trace", {
      title: "Why requirements must exist in electronic form",
      subtitle: "Each link in the chain is a query you can only run if the artefacts are models rather than prose.",
      height: 340,
      frames: chain.map(function (link, i) {
        return {
          title: "Link " + (i + 1) + ": " + link.label,
          caption: link.note,
          draw: function (ctx, w, h, k) {
            k.clear();
            var n = chain.length;
            var y = 52;
            var bh = 58;
            var gap = 16;
            var bw = (w - 48 - (n - 1) * gap) / n;

            chain.forEach(function (item, j) {
              var x = 24 + j * (bw + gap);
              var active = j === i;
              var done = j < i;
              k.box(x, y, bw, bh, {
                fill: active ? "#e0e7ff" : done ? "#ecfdf5" : "#ffffff",
                stroke: active ? CANVAS_ACCENT : done ? CANVAS_GREEN : CANVAS_LINE,
                lw: active ? 2.2 : 1.4,
                r: 9
              });
              k.label(x + bw / 2, y + bh / 2 - 7, item.label, {
                align: "center",
                size: 11,
                baseline: "middle",
                color: active ? CANVAS_ACCENT : CANVAS_INK
              });
              k.label(x + bw / 2, y + bh / 2 + 11, done ? "linked" : active ? "current" : "pending", {
                align: "center",
                size: 10,
                mono: true,
                baseline: "middle",
                color: CANVAS_INK_SOFT
              });
              if (j < n - 1) {
                k.arrow(x + bw + 3, y + bh / 2, x + bw + gap - 3, y + bh / 2, {
                  color: CANVAS_LINE,
                  lw: 1.6
                });
              }
            });

            /* The trace runs both ways: the deck's point is automated support. */
            k.arrow(24 + (n - 1) * (bw + gap) + bw / 2, y + bh + 8, 24 + bw / 2, y + bh + 8, {
              color: CANVAS_PURPLE,
              lw: 1.8,
              dash: [6, 5]
            });
            k.label(w / 2, y + bh + 26, "and back again: implementation \u2192 requirement, test \u2192 design", {
              align: "center",
              size: 11,
              color: CANVAS_PURPLE
            });

            k.label(w / 2, h - 52, "Informal prose makes all six of these questions hard to answer:", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
            k.label(w / 2, h - 34, "conflicts between requirements · interdependencies · coverage", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
            k.label(w / 2, h - 16, "implementation intent · traceability · a basis for comprehensive testing", {
              align: "center",
              size: 11,
              color: CANVAS_INK_SOFT
            });
          }
        };
      })
    });
  }

  /* ── Imperative matcher on the foundations page ─────────────── */

  function initFoundationsMatcher() {
    var host = document.getElementById("ix-m-match");
    if (!host || !window.Interactive) return;
    if (host.getAttribute("data-ix-mounted") === "1") return;
    host.setAttribute("data-ix-mounted", "1");

    window.Interactive.matcher("ix-m-match", {
      title: "Match the relationship to its constraint",
      subtitle: "The relationship is the one you would draw for the statement on the left.",
      pairs: [
        ["Every access attempt writes a door-log entry", "\u00ABinclude\u00BB: the base cannot reach its goal without the child"],
        ["A panic button press messages the police", "\u00ABextend\u00BB: optional behaviour at a named extension point"],
        ["Visitor entry by one-time code", "Generalization: a specialisation of the parent use case"],
        ["Fingerprint identification is required", "Mandatory sub-feature: filled circle on the refinement edge"],
        ["Exactly one security policy grade per product", "Alternative (xor) group: hollow arc over the sibling edges"],
        ["Credit-card payment forces high security", "Cross-tree constraint: a dashed dependency between branches"],
        ["The agent prepares a reply but does not send it", "Human checkpoint written into the main success scenario"]
      ]
    });
  }

  /* ── Widget re-binding ──────────────────────────────────────── */

  function rebind() {
    initReStepper();
    initFeatureDiagram();
    initUseCaseBuildStepper();
    initRelationshipStepper();
    initAtmScenarioStepper();
    initTraceStepper();
    initFoundationsMatcher();
  }

  window.ELEC5620Chapter3 = { rebind: rebind };
})();
