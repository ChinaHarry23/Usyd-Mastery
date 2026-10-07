(function () {
  "use strict";

  /* ELEC5620 — Week 2 page behaviour.
   *
   * The declarative widgets (deck, hotspot, matcher, pipeline, timeline, race,
   * sequence) are mounted by shared/interactive.js from the JSON config blocks
   * embedded in the page. This file owns the two animated canvas steppers that
   * build a UML class diagram and resolve a state-machine transition, plus the
   * re-binding that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initUmlBuildStepper();
    initStateMachineStepper();
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
    initUmlBuildStepper();
    initStateMachineStepper();
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
        window.console.error("[ELEC5620 chapter 2] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared geometry for the class-diagram stepper ───────────── */

  var BOX_W = 214;
  var BOX_H = 158;
  var NAME_H = 44;
  var ATTR_H = 56;
  var GUTTER = 34;

  function classBox(k, x, y, parts, opts) {
    opts = opts || {};
    var accent = opts.accent || "#4f46e5";
    k.box(x, y, BOX_W, BOX_H, { fill: "#ffffff", stroke: accent, lw: 1.8, r: 6 });
    k.box(x, y, BOX_W, NAME_H, { fill: opts.nameFill || "#eef0fe", stroke: accent, lw: 1.8, r: 6 });
    k.box(x, y + NAME_H - 8, BOX_W, 8, { fill: opts.nameFill || "#eef0fe" });
    k.box(x, y + NAME_H, BOX_W, 1.6, { fill: accent });
    k.box(x, y + NAME_H + ATTR_H, BOX_W, 1.6, { fill: accent });

    if (parts.stereotype) {
      k.label(x + 12, y + 15, parts.stereotype, { size: 10.5, color: accent, mono: false });
    }
    k.label(x + 12, y + 34, parts.name, { size: 12.5, weight: "700" });
    (parts.attrs || []).forEach(function (line, i) {
      k.label(x + 12, y + NAME_H + 18 + i * 19, line, { size: 10.5, mono: true, color: "#3f4661" });
    });
    (parts.ops || []).forEach(function (line, i) {
      k.label(x + 12, y + NAME_H + ATTR_H + 20 + i * 19, line, { size: 10.5, mono: true, color: "#3f4661" });
    });
  }

  /* ── Stepper 1: build the UML model element by element ───────── */

  function initUmlBuildStepper() {
    var host = document.getElementById("ix-uml-build");
    if (!host || !window.Interactive) return;

    var producer = {
      name: "a1 : Producer",
      attrs: ["start : sc_in<bool>", "out1 : sc_outmaster<int>"],
      ops: ["generate_data()"]
    };
    var consumer = {
      name: "b1 : Consumer",
      attrs: ["in1 : sc_inslave<int>", "sum : int"],
      ops: ["accumulate()"]
    };

    function geometry(w) {
      return {
        ax: GUTTER,
        bx: w - GUTTER - BOX_W,
        y: Math.round((276 - BOX_H) / 2) + 6
      };
    }

    window.Interactive.stepper("ix-uml-build", {
      title: "Model the SC_MODULE program: notation, one element at a time",
      subtitle: "Each frame adds exactly one UML element to the same diagram.",
      height: 276,
      frames: [
        {
          title: "1. A class is a rectangle with three compartments",
          caption:
            "Name, attributes and operations. Nothing else is drawn yet — the diagram starts from the smallest thing that carries meaning.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = geometry(w);
            k.box(g.ax, g.y, BOX_W, BOX_H, { fill: "#ffffff", stroke: "#c7cbe0", lw: 1.6, r: 6 });
            k.box(g.ax, g.y + NAME_H, BOX_W, 1.4, { fill: "#c7cbe0" });
            k.box(g.ax, g.y + NAME_H + ATTR_H, BOX_W, 1.4, { fill: "#c7cbe0" });
            k.label(g.ax + 12, g.y + 22, "name", { size: 11, color: "#7b829a" });
            k.label(g.ax + 12, g.y + NAME_H + 20, "attributes", { size: 11, color: "#7b829a" });
            k.label(g.ax + 12, g.y + NAME_H + ATTR_H + 22, "operations", { size: 11, color: "#7b829a" });
            k.label(w / 2, 22, "a UML class", { align: "center", size: 12, color: "#565d75" });
          }
        },
        {
          title: "2. Name the class and list its attributes",
          caption:
            "The instance name and its class are written a1 : Producer. Attributes carry the ports the object exposes.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = geometry(w);
            classBox(k, g.ax, g.y, producer);
            k.highlight(g.ax - 5, g.y - 5, BOX_W + 10, NAME_H + ATTR_H + 10, {});
            k.label(w / 2, 22, "name and attributes", { align: "center", size: 12, color: "#4f46e5" });
          }
        },
        {
          title: "3. Add the operations",
          caption:
            "Behaviour belongs to the class. generate_data() is what this object can be asked to do.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = geometry(w);
            classBox(k, g.ax, g.y, producer);
            k.highlight(g.ax - 5, g.y + NAME_H + ATTR_H - 5, BOX_W + 10, BOX_H - NAME_H - ATTR_H + 10, {});
            k.label(w / 2, 22, "operations added", { align: "center", size: 12, color: "#4f46e5" });
          }
        },
        {
          title: "4. Model the other end",
          caption:
            "The consumer is a second class with its own ports and state. Two classes and no relationship is not yet a system.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = geometry(w);
            classBox(k, g.ax, g.y, producer);
            classBox(k, g.bx, g.y, consumer);
            k.label(w / 2, 22, "two classes, not yet connected", { align: "center", size: 12, color: "#565d75" });
          }
        },
        {
          title: "5. Add the association",
          caption:
            "A line between the classes says instances are linked. The end names out1 and in1 are the ports that carry the link, and 1 … 1 is the multiplicity of each end.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = geometry(w);
            var midY = g.y + NAME_H + 24;
            classBox(k, g.ax, g.y, producer);
            classBox(k, g.bx, g.y, consumer);
            k.box(g.ax + BOX_W, midY - 1, g.bx - g.ax - BOX_W, 2, { fill: "#4f46e5" });
            k.label(g.ax + BOX_W + 18, midY - 12, "out1", { size: 10.5, mono: true, color: "#059669" });
            k.label(g.bx - 18, midY - 12, "in1", { size: 10.5, mono: true, color: "#059669", align: "right" });
            k.label(g.ax + BOX_W + 6, midY + 16, "1", { size: 11, color: "#565d75" });
            k.label(g.bx - 6, midY + 16, "1", { size: 11, color: "#565d75", align: "right" });
            k.highlight(g.ax + BOX_W + 2, midY - 26, g.bx - g.ax - BOX_W - 4, 52, {});
            k.label(w / 2, 22, "association + end names + multiplicity", { align: "center", size: 12, color: "#4f46e5" });
          }
        },
        {
          title: "6. Apply the stereotypes",
          caption:
            "«sc_method» and «sc_slave» add domain meaning the modelling language does not have built in. The structure of the classes does not change — the metamodel gains a vocabulary.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = geometry(w);
            var midY = g.y + NAME_H + 24;
            classBox(k, g.ax, g.y, {
              name: producer.name,
              stereotype: "\u00ABsc_method\u00BB",
              attrs: producer.attrs,
              ops: producer.ops
            });
            classBox(k, g.bx, g.y, {
              name: consumer.name,
              stereotype: "\u00ABsc_slave\u00BB",
              attrs: consumer.attrs,
              ops: consumer.ops
            });
            k.box(g.ax + BOX_W, midY - 1, g.bx - g.ax - BOX_W, 2, { fill: "#4f46e5" });
            k.label(g.ax + BOX_W + 18, midY - 12, "out1", { size: 10.5, mono: true, color: "#059669" });
            k.label(g.bx - 18, midY - 12, "in1", { size: 10.5, mono: true, color: "#059669", align: "right" });
            k.highlight(g.ax - 5, g.y - 5, BOX_W + 10, NAME_H + 10, { color: "#a855f7" });
            k.highlight(g.bx - 5, g.y - 5, BOX_W + 10, NAME_H + 10, { color: "#a855f7" });
            k.label(w / 2, 22, "stereotypes applied", { align: "center", size: 12, color: "#a855f7" });
          }
        },
        {
          title: "7. The link itself is a model element",
          caption:
            "«sc_link_mp» link1 sits on the association as an association class: the connection has an identity of its own. The C++ macros, the scheduler and the port types are gone — that is the abstraction, not an omission.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var g = geometry(w);
            var midY = g.y + NAME_H + 24;
            var cx = (g.ax + BOX_W + g.bx) / 2;
            classBox(k, g.ax, g.y, {
              name: producer.name,
              stereotype: "\u00ABsc_method\u00BB",
              attrs: producer.attrs,
              ops: producer.ops
            });
            classBox(k, g.bx, g.y, {
              name: consumer.name,
              stereotype: "\u00ABsc_slave\u00BB",
              attrs: consumer.attrs,
              ops: consumer.ops
            });
            k.box(g.ax + BOX_W, midY - 1, cx - 56 - g.ax - BOX_W, 2, { fill: "#4f46e5" });
            k.box(cx + 56, midY - 1, g.bx - cx - 56, 2, { fill: "#4f46e5" });
            k.box(cx - 56, midY - 32, 112, 64, { fill: "#f5f3ff", stroke: "#a855f7", lw: 1.8, r: 6 });
            k.label(cx, midY - 12, "\u00ABsc_link_mp\u00BB", { align: "center", size: 10, color: "#a855f7" });
            k.label(cx, midY + 10, "link1", { align: "center", size: 12, weight: "700" });
            k.label(w / 2, 22, "the completed model", { align: "center", size: 12, color: "#565d75" });
            k.label(w / 2, h - 10, "model = the parts of the program that matter for this concern", {
              align: "center",
              size: 10.5,
              color: "#7b829a"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: resolving a state-machine transition ─────────── */

  function initStateMachineStepper() {
    var host = document.getElementById("ix-statemachine");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-statemachine", {
      title: "Executing the model: resolving one transition",
      subtitle:
        "A state machine has states, an event and an action. Executing the model means resolving the transition and settling in a new state.",
      height: 286,
      frames: [
        {
          title: "The model: two states, one transition",
          caption:
            "NotStarted and Started, with the transition annotated event / action: start / generate_data(). This is the whole behaviour model of the producer.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 6;
            drawStates(k, w, cy, { active: null, armed: false, event: false });
          }
        },
        {
          title: "Executing: the event start arrives",
          caption:
            "The machine is in NotStarted. The event start is offered to the current state; the model says the transition is enabled and it becomes the one to resolve.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 6;
            drawStates(k, w, cy, { active: "not", armed: true, event: true });
            k.label(w / 2, 22, "current state: NotStarted \u2192 event: start", {
              align: "center",
              size: 11.5,
              color: "#4f46e5"
            });
          }
        },
        {
          title: "The action runs",
          caption:
            "generate_data() executes against the object: out1 = i for i in 0..9. The action is part of the transition, not of either state.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 6;
            drawStates(k, w, cy, { active: "not", armed: true, event: true });
            k.box(w / 2 - 150, h - 74, 300, 54, { fill: "#ecfdf5", stroke: "#059669", lw: 1.6, r: 8 });
            k.label(w / 2, h - 56, "action: generate_data()", { align: "center", size: 11.5, color: "#059669", mono: true });
            k.label(w / 2, h - 36, "for (int i = 0; i < 10; i++) out1 = i;", {
              align: "center",
              size: 10.5,
              mono: true,
              color: "#3f4661"
            });
          }
        },
        {
          title: "The machine settles in Started",
          caption:
            "Resolving a transition = read the current state, accept the event, run the action, enter the target state. The model now has a new configuration, and that configuration is observable.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = h / 2 - 6;
            drawStates(k, w, cy, { active: "started", armed: false, event: false });
            k.label(w / 2, 22, "configuration after the step: Started", {
              align: "center",
              size: 11.5,
              color: "#059669"
            });
          }
        },
        {
          title: "Refining the same model into the implementation",
          caption:
            "Models can be refined continuously until the application is fully specified. The deck's claim is stronger than code generation: the model becomes the system it was modelling.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cy = 66;
            drawStates(k, w, cy, { active: null, armed: false, event: false, noReset: true });
            k.arrow(w / 2, 104, w / 2, 132, { color: "#94a3b8", lw: 1.6 });
            k.label(w / 2 + 12, 118, "refine", { size: 10.5, color: "#7b829a" });
            k.code(
              24,
              154,
              [
                { text: "switch (state) {", color: "#3f4661" },
                { text: "  case 1: generate_data(); newState(2); break;", color: "#4f46e5" },
                { text: "  case 2: accumulate();    newState(1); break; }", color: "#4f46e5" }
              ],
              { size: 11.5, lh: 20 }
            );
          }
        },
        {
          title: "What model execution buys you",
          caption:
            "Controllability: start, stop, slow down, speed up, drive the execution. Observability: read the state in model form, not in a debugger dump. Partial execution: run an abstract or incomplete model before it is finished.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var items = [
              ["Controllability", "start / stop / slow / speed up / drive"],
              ["Observability", "execution and state visible in model form"],
              ["Partial execution", "abstract and incomplete models still run"]
            ];
            var boxW = Math.min(280, (w - 64) / 3 - 12);
            items.forEach(function (item, i) {
              var x = 32 + i * (boxW + 12);
              k.box(x, 60, boxW, 116, { fill: "#f8fafc", stroke: "#c7cbe0", lw: 1.6, r: 10 });
              k.label(x + 16, 92, item[0], { size: 12.5, weight: "700", color: "#4f46e5" });
              wrapLabel(k, x + 16, 118, boxW - 32, item[1], { size: 10.5, color: "#565d75" });
            });
            k.label(w / 2, 210, "\u201CModels that are not executable are like cars without engines.\u201D", {
              align: "center",
              size: 12,
              color: "#141826"
            });
            k.label(w / 2, 232, "D. Harel, quoted in the Week 2 deck", { align: "center", size: 10.5, color: "#7b829a" });
          }
        }
      ]
    });
  }

  function drawStates(k, w, cy, st) {
    var rw = 176;
    var rh = 62;
    var leftX = w / 2 - 240;
    var rightX = w / 2 + 64;
    var notFill = st.active === "not" ? "#e0e7ff" : "#f8fafc";
    var startedFill = st.active === "started" ? "#d1fae5" : "#f8fafc";
    var notStroke = st.active === "not" ? "#4f46e5" : "#94a3b8";
    var startedStroke = st.active === "started" ? "#059669" : "#94a3b8";

    k.box(leftX, cy - rh / 2, rw, rh, { fill: notFill, stroke: notStroke, lw: st.active === "not" ? 2.4 : 1.6, r: 12 });
    k.label(leftX + rw / 2, cy, "NotStarted", { align: "center", size: 12.5, weight: "700", color: notStroke });

    k.box(rightX, cy - rh / 2, rw, rh, { fill: startedFill, stroke: startedStroke, lw: st.active === "started" ? 2.4 : 1.6, r: 12 });
    k.label(rightX + rw / 2, cy, "Started", { align: "center", size: 12.5, weight: "700", color: startedStroke });

    k.dot(leftX - 22, cy, 8, { fill: "#141826" });
    k.arrow(leftX - 14, cy, leftX - 2, cy, { color: "#141826", lw: 1.6 });

    k.arrow(leftX + rw, cy, rightX, cy, {
      color: st.armed ? "#4f46e5" : "#94a3b8",
      lw: st.armed ? 2.4 : 1.6,
      dash: st.armed ? null : [5, 4]
    });
    k.label((leftX + rw + rightX) / 2, cy - 22, "start / generate_data()", {
      align: "center",
      size: 11,
      color: st.armed ? "#4f46e5" : "#565d75"
    });
    if (st.event) {
      k.highlight((leftX + rw + rightX) / 2 - 74, cy - 32, 148, 26, { color: "#a855f7" });
    }
    if (st.noReset) return;

    /* reset transition: routed below the states so it never crosses them */
    var loopY = cy + rh / 2 + 34;
    k.box(rightX + rw / 2, cy + rh / 2, 1.4, loopY - cy - rh / 2, { fill: "#c7cbe0" });
    k.box(leftX + rw / 2, loopY, rightX - leftX, 1.4, { fill: "#c7cbe0" });
    k.arrow(leftX + rw / 2, loopY, leftX + rw / 2, cy + rh / 2 + 2, { color: "#c7cbe0", lw: 1.4, dash: [4, 5] });
    k.label(w / 2, loopY + 14, "reset", { align: "center", size: 10, color: "#a8adc2" });
  }

  function wrapLabel(k, x, y, maxWidth, text, opts) {
    var words = String(text).split(" ");
    var line = "";
    var row = 0;
    words.forEach(function (word) {
      var next = line ? line + " " + word : word;
      if (next.length * 5.6 > maxWidth && line) {
        k.label(x, y + row * 16, line, opts);
        line = word;
        row += 1;
        return;
      }
      line = next;
    });
    if (line) k.label(x, y + row * 16, line, opts);
  }
})();
