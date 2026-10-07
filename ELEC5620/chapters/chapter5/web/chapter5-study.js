(function () {
  "use strict";

  /* ELEC5620 — Week 5 page behaviour.
   *
   * The declarative widgets (sequence, matcher, timeline, pipeline, hotspot,
   * deck) are mounted by shared/interactive.js from the JSON config blocks in
   * the pages themselves. This file owns the three animated canvas steppers
   * that build UML diagrams element by element, plus the re-binding that a
   * language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initNotationBuilder();
    initObjectDiagram();
    initStructuredClass();
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
    initNotationBuilder();
    initObjectDiagram();
    initStructuredClass();
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
        window.console.error("[ELEC5620 chapter 5] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared drawing helpers ─────────────────────────────────────
   * Both diagrams are UML, so both need the same three primitives: a class box
   * with compartments, a lifted rounded-rectangle outline, and a label. */

  var INK = "#312e81";
  var LINE = "#4f46e5";
  var FILL = "#eef2ff";
  var NOTE = "#565d75";
  var ACCENT = "#0891b2";
  var MUTED = "#94a3b8";

  function outline(k, x, y, w, h, opts) {
    opts = opts || {};
    var pad = 4;
    k.box(x - pad, y - pad, w + pad * 2, h + pad * 2, {
      fill: "#ffffff",
      stroke: opts.color || MUTED,
      lw: 1.4,
      r: 10
    });
  }

  function classBox(k, x, y, w, h, spec) {
    spec = spec || {};
    var header = spec.header || 26;
    var fill = spec.fill || FILL;
    k.box(x, y, w, h, { fill: fill, stroke: LINE, lw: 2, r: 6 });
    k.label(x + w / 2, y + header / 2, spec.title || "", {
      align: "center",
      size: spec.titleSize || 13,
      weight: "700",
      mono: true,
      color: INK
    });
    if (spec.stereotype) {
      k.label(x + w / 2, y - 12, spec.stereotype, {
        align: "center",
        size: 11,
        weight: "600",
        mono: true,
        color: LINE
      });
    }
    var top = y + header;
    if (spec.attrs && spec.attrs.length) {
      k.box(x, top, w, 2, { fill: LINE, stroke: null, r: 0 });
      spec.attrs.forEach(function (line, i) {
        k.label(x + 10, top + 17 + i * 16, line, { size: 11, mono: true, color: INK });
      });
      top = top + 10 + spec.attrs.length * 16;
    }
    if (spec.ops && spec.ops.length) {
      k.box(x, top, w, 2, { fill: LINE, stroke: null, r: 0 });
      spec.ops.forEach(function (line, i) {
        k.label(x + 10, top + 17 + i * 16, line, { size: 11, mono: true, color: LINE });
      });
    }
    if (spec.constraint) {
      k.label(x + w / 2, y + h + 16, spec.constraint, {
        align: "center",
        size: 11,
        weight: "700",
        mono: true,
        color: ACCENT
      });
    }
  }

  /* ── Stepper 1: the class notation, layer by layer ───────────── */

  function initNotationBuilder() {
    var host = document.getElementById("ix-notation-builder");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-notation-builder", {
      title: "One class box, built adornment by adornment",
      subtitle: "Each step adds a layer of the notation. Nothing here is decoration: every symbol removes a class of misunderstanding.",
      height: 300,
      frames: [
        {
          title: "1. The name compartment",
          caption: "A class is a specification of a collection of object instances with the same features and behaviours. The name is a noun, and it is the only mandatory compartment.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = Math.min(300, w - 80);
            var x = (w - bw) / 2;
            classBox(k, x, 96, bw, 60, { title: "CorporateAccount", header: 34, titleSize: 14 });
            k.label(w / 2, 60, "A class box with one compartment", {
              align: "center",
              size: 12,
              color: NOTE
            });
            k.label(w / 2, 210, "attributes and operations are optional", {
              align: "center",
              size: 11,
              color: NOTE
            });
          }
        },
        {
          title: "2. Attributes with types",
          caption: "Attributes are structural features: they describe what objects of the class know. The type follows the colon, and attributes map onto member variables in code.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = Math.min(340, w - 60);
            var x = (w - bw) / 2;
            classBox(k, x, 58, bw, 112, {
              title: "CorporateAccount",
              header: 34,
              titleSize: 14,
              attrs: ["+owner : CorporateCustomer", "name : String [1..*]"]
            });
            outline(k, x, 92, bw, 52, { color: LINE });
            k.label(w / 2 + 0, 42, "the attribute compartment", {
              align: "center",
              size: 11,
              weight: "700",
              color: LINE
            });
            k.label(w / 2, 212, "the type is written after the colon", {
              align: "center",
              size: 11,
              color: NOTE
            });
            k.label(w / 2, 232, "[1..*] is a multiplicity on an attribute — collections are not an association-only idea", {
              align: "center",
              size: 11,
              color: ACCENT
            });
          }
        },
        {
          title: "3. Operations with signatures",
          caption: "Operations are behavioural features: they describe what objects of the class can do. Parameter types follow the parameter name, the return type follows the closing bracket, and operations map onto class methods.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = Math.min(360, w - 60);
            var x = (w - bw) / 2;
            classBox(k, x, 40, bw, 168, {
              title: "CorporateAccount",
              header: 34,
              titleSize: 14,
              attrs: ["+owner : CorporateCustomer"],
              ops: ["+credit (amount: Amount)", "+debit (amount) : Boolean"]
            });
            k.label(x + bw + 14, 118, "\u2190", { size: 16, color: LINE });
            k.label(x + bw + 26, 118, "operations", { size: 11, weight: "700", color: LINE });
            k.label(w / 2, 240, "visibility markers: + public, - private, # protected, ~ package", {
              align: "center",
              size: 11,
              color: NOTE
            });
          }
        },
        {
          title: "4. Visibility, defaults and property strings",
          caption: "The deck's own box: a private prefix with a default value, a property string marking it read-only, and a derived feature computed from other elements rather than stored.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = Math.min(420, w - 50);
            var x = (w - bw) / 2;
            classBox(k, x, 40, bw, 190, {
              title: "CorporateAccount",
              header: 34,
              titleSize: 14,
              attrs: [
                "+/customers : BankCustomer",
                "+owner : CorporateCustomer",
                "#bankPrefix : String = \u201C0613\u201D {readOnly}"
              ],
              ops: ["+credit (amount: Amount)", "+debit (amount) : Boolean"]
            });
            k.label(x + bw / 2, 246, "/ marks a derived feature; = gives a default; { } is a constraint written in line", {
              align: "center",
              size: 11,
              weight: "600",
              color: ACCENT
            });
          }
        },
        {
          title: "5. Stereotypes",
          caption: "A stereotype is a profile-defined keyword that extends the meaning of an element. The deck's own example is a signal reception, written as +«signal» alarm ().",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = Math.min(420, w - 50);
            var x = (w - bw) / 2;
            classBox(k, x, 52, bw, 190, {
              title: "CorporateAccount",
              header: 34,
              titleSize: 14,
              attrs: [
                "+/customers : BankCustomer",
                "+owner : CorporateCustomer",
                "#bankPrefix : String = \u201C0613\u201D {readOnly}"
              ],
              ops: ["+credit (amount: Amount)", "+debit (amount) : Boolean", "+«signal» alarm ()"]
            });
            outline(k, x, 116, bw, 100, { color: LINE });
            k.label(w / 2, 246, "«signal» signifies a reception — a profile keyword, not a new language", {
              align: "center",
              size: 11,
              weight: "600",
              color: LINE
            });
          }
        },
        {
          title: "6. Association ends owned by the classifier",
          caption: "The black dot signifies that the association end is owned by the classifier at that end. Owned ends with a 1 multiplicity can be shown inside the class box, which is the same model element drawn twice.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = Math.min(230, w / 2 - 40);
            var x = Math.max(24, w / 2 - bw - 70);
            classBox(k, x, 74, bw, 130, {
              title: "CorporateAccount",
              header: 32,
              titleSize: 13,
              attrs: ["+owner : CorporateCustomer"],
              ops: ["+credit (amount: Amount)", "+debit (amount) : Boolean"]
            });
            var bx = w / 2 + 70;
            classBox(k, bx, 96, bw, 86, {
              title: "BankBranch",
              header: 32,
              titleSize: 13,
              attrs: ["+sortCode : String"]
            });

            var y = 139;
            k.arrow(x + bw, y, bx, y, { color: LINE, lw: 2, head: 0.001 });
            k.label(x + bw + 8, y - 12, "branch", { size: 11, mono: true, color: INK });
            k.label(bx - 8, y + 16, "accounts", { size: 11, mono: true, color: INK, align: "right" });
            k.label(x + bw + 26, y + 16, "0..*", { size: 11, weight: "700", mono: true, color: ACCENT });
            k.label(bx - 26, y - 12, "1", { size: 11, weight: "700", mono: true, color: ACCENT, align: "right" });

            k.dot(x + bw + 6, y, 4.5, { fill: INK });
            k.label(w / 2, 42, "the black dot marks the end as owned by CorporateAccount", {
              align: "center",
              size: 11,
              weight: "600",
              color: INK
            });
            k.label(w / 2, 240, "obj2 : CorporateAccount holds obj1.id — the same link, seen from the instance level", {
              align: "center",
              size: 11,
              color: NOTE
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: one class diagram, many objects ──────────────── */

  function initObjectDiagram() {
    var host = document.getElementById("ix-object-diagram");
    if (!host || !window.Interactive) return;

    var P1 = { x: 18, y: 104, w: 82, h: 42 };
    var P2 = { x: 140, y: 104, w: 82, h: 42 };
    var P3 = { x: 262, y: 104, w: 82, h: 42 };
    var P4 = { x: 384, y: 104, w: 82, h: 42 };
    var P5 = { x: 490, y: 210, w: 82, h: 42 };

    function node(k, p, name, dashed) {
      k.box(p.x, p.y, p.w, p.h, {
        fill: "#ffffff",
        stroke: dashed ? MUTED : LINE,
        lw: 2,
        r: 5
      });
      k.label(p.x + p.w / 2, p.y + p.h / 2, name, {
        align: "center",
        size: 12,
        weight: "700",
        mono: true,
        color: dashed ? NOTE : INK
      });
    }

    /* One link, drawn as the pair of ends it actually is: an outgoing end at the
     * owning object and a 0..1 back-reference at the target. */
    function link(k, from, to, label, color) {
      var x1 = from.x + from.w;
      var y1 = from.y + from.h / 2;
      var x2 = to.x;
      var y2 = to.y + to.h / 2;
      var up = y2 < y1;
      var mid = (y1 + y2) / 2 + (up ? -16 : 16);
      k.arrow(x1, y1, x2 - 4, y2, { color: color || LINE, lw: 1.8, head: 8 });
      k.label((x1 + x2) / 2, mid - (up ? 12 : -6), label, {
        align: "center",
        size: 10,
        mono: true,
        color: color || LINE
      });
      k.label(x2 - 8, y2 + 14, "0..1", { align: "right", size: 9.5, mono: true, color: ACCENT });
    }

    function legend(k, w, lines) {
      lines.forEach(function (line, i) {
        k.label(20, 34 + i * 16, line, { size: 11, color: NOTE });
      });
    }

    window.Interactive.stepper("ix-object-diagram", {
      title: "How many run-time configurations does this class diagram describe?",
      subtitle: "The deck's questionnaire, answered with the object diagrams that make the point visible.",
      height: 320,
      frames: [
        {
          title: "The class diagram",
          caption: "Node has two optional ends, left and right, each 0..1. Ask the deck's question: how many different run-time configurations are described by this diagram?",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = 260;
            var x = (w - bw) / 2;
            classBox(k, x, 96, bw, 92, {
              title: "Node",
              header: 32,
              titleSize: 14,
              attrs: ["+left : Node [0..1]", "+right : Node [0..1]"]
            });
            k.label(w / 2, 240, "Answer: no finite number. One pair, two pairs, three pairs \u2026 and every arrangement between them.", {
              align: "center",
              size: 11.5,
              weight: "600",
              color: ACCENT
            });
          }
        },
        {
          title: "Configuration (1): four linked objects at time T",
          caption: "An object diagram is a snapshot of a specific system at a point in time. N1.right = N2, N2.right = N3, N3.right = N4 — a valid chain, and the back-references N2.left, N3.left, N4.left are the same links seen from the other end.",
          draw: function (ctx, w, h, k) {
            k.clear();
            node(k, P1, "N1:Node");
            node(k, P2, "N2:Node");
            node(k, P3, "N3:Node");
            node(k, P4, "N4:Node");
            link(k, P1, P2, "right");
            link(k, P2, P3, "right");
            link(k, P3, P4, "right");
            k.label(w / 2, 250, "one snapshot — it is an example, not a specification", {
              align: "center",
              size: 11,
              color: NOTE
            });
          }
        },
        {
          title: "The same diagram, a different system",
          caption: "Two nodes in a ring satisfies exactly the same class diagram. N1.right = N2 and N2.right = N1 is a legal instance of Node with two 0..1 ends, which is why the class diagram cannot show you a run.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var a = { x: 150, y: 100, w: 96, h: 44 };
            var b = { x: 400, y: 100, w: 96, h: 44 };
            node(k, a, "N1:Node");
            node(k, b, "N2:Node");
            k.arrow(a.x + a.w, a.y + 14, b.x, b.y + 14, { color: LINE, lw: 1.8 });
            k.label((a.x + a.w + b.x) / 2, a.y - 2, "right", { align: "center", size: 10, mono: true, color: LINE });
            k.arrow(b.x, b.y + 30, a.x + a.w, a.y + 30, { color: ACCENT, lw: 1.8 });
            k.label((a.x + a.w + b.x) / 2, b.y + 50, "right", { align: "center", size: 10, mono: true, color: ACCENT });
            k.label(w / 2, 210, "same class diagram, different run-time structure", {
              align: "center",
              size: 11.5,
              weight: "600",
              color: ACCENT
            });
          }
        },
        {
          title: "Transition: a fifth object is created",
          caption: "At T+1 the system has grown. N5 exists with both ends unset — the 0..1 lower bound of each end is what makes a newly created, unconnected node legal.",
          draw: function (ctx, w, h, k) {
            k.clear();
            node(k, P1, "N1:Node");
            node(k, P2, "N2:Node");
            node(k, P3, "N3:Node");
            node(k, P4, "N4:Node");
            node(k, P5, "N5:Node", true);
            link(k, P1, P2, "right");
            link(k, P2, P3, "right");
            link(k, P3, P4, "right");
            k.label(P5.x + P5.w / 2, P5.y + P5.h + 18, "left = null, right = null", {
              align: "center",
              size: 10,
              mono: true,
              color: NOTE
            });
            k.label(w / 2, 60, "an object may exist with no links at all", {
              align: "center",
              size: 11,
              color: NOTE
            });
          }
        },
        {
          title: "Transition resolved: N3.right is repointed to N5",
          caption: "Setting N3.right = N5 satisfies both ends: N5's left now references N3 through the same link. N4 is no longer reachable from the chain and is not deleted — composition, not association, is what would have removed it.",
          draw: function (ctx, w, h, k) {
            k.clear();
            node(k, P1, "N1:Node");
            node(k, P2, "N2:Node");
            node(k, P3, "N3:Node");
            node(k, P4, "N4:Node");
            node(k, P5, "N5:Node");
            link(k, P1, P2, "right");
            link(k, P2, P3, "right");
            k.arrow(P3.x + P3.w, P3.y + P3.h / 2 + 8, P5.x, P5.y + P5.h / 2, { color: ACCENT, lw: 2.2, head: 9 });
            k.label((P3.x + P3.w + P5.x) / 2, 196, "right", { align: "center", size: 10, mono: true, color: ACCENT });
            k.highlight(P4.x - 4, P4.y - 4, P4.w + 8, P4.h + 8, { color: MUTED, dash: [5, 4] });
            k.label(P4.x + P4.w / 2, P4.y + P4.h + 20, "still exists", { align: "center", size: 10, color: NOTE });
            k.label(w / 2, 286, "A repointed link is not a deletion: the class diagram constrains links, not existence.", {
              align: "center",
              size: 11,
              color: NOTE
            });
          }
        },
        {
          title: "Why an object diagram cannot replace the class diagram",
          caption: "Each snapshot fixes the number of objects and every link between them. The class diagram is what all of them have in common — which is exactly what makes it a specification, and what makes it silent about any particular run.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var rows = [
              ["1 pair", "N1 \u21C4 N2"],
              ["2 pairs", "N1 \u2192 N2, N2 \u2192 N3"],
              ["4 linked", "N1 \u2192 N2 \u2192 N3 \u2192 N4"],
              ["ring", "N1 \u21C4 N2, N3 \u21C4 N4"],
              ["\u2026", "no upper bound"]
            ];
            k.box(20, 30, w - 40, 34, { fill: FILL, stroke: LINE, lw: 1.6, r: 8 });
            k.label(34, 47, "configuration", { size: 11, weight: "700", mono: true, color: INK });
            k.label(200, 47, "example the diagram admits", { size: 11, weight: "700", mono: true, color: INK });
            rows.forEach(function (row, i) {
              var y = 76 + i * 30;
              k.box(20, y, w - 40, 26, { fill: "#ffffff", stroke: "#e2e8f0", lw: 1.2, r: 6 });
              k.label(34, y + 13, row[0], { size: 11, mono: true, color: ACCENT });
              k.label(200, y + 13, row[1], { size: 11, mono: true, color: INK });
            });
            k.label(w / 2, 250, "Object diagrams serve as examples unless a profile makes them specifications.", {
              align: "center",
              size: 11,
              color: NOTE
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: a structured class in four layers ────────────── */

  function initStructuredClass() {
    var host = document.getElementById("ix-structured-class");
    if (!host || !window.Interactive) return;

    function shell(k, x, y, w, h, title) {
      k.box(x, y, w, h, { fill: "#fbfbff", stroke: LINE, lw: 2.2, r: 10 });
      k.label(x + w - 14, y + h - 16, title, {
        align: "right",
        size: 12.5,
        weight: "700",
        mono: true,
        color: INK
      });
    }

    function port(k, x, y, label, iface, align) {
      k.box(x - 5, y - 15, 10, 30, { fill: "#ffffff", stroke: LINE, lw: 2, r: 2 });
      k.label(x + (align === "right" ? 14 : -14), y, label, {
        align: align === "right" ? "left" : "right",
        size: 10.5,
        mono: true,
        color: INK
      });
      k.label(x + (align === "right" ? 14 : -14), y + 15, iface, {
        align: align === "right" ? "left" : "right",
        size: 10,
        mono: true,
        color: ACCENT
      });
    }

    function part(k, x, y, w, h, labelLeft, typeLine) {
      k.box(x, y, w, h, { fill: "#ffffff", stroke: LINE, lw: 1.6, r: 5 });
      k.label(x + w / 2, y + 15, labelLeft, {
        align: "center",
        size: 11,
        weight: "700",
        mono: true,
        color: INK
      });
      k.label(x + w / 2, y + 32, typeLine, {
        align: "center",
        size: 10,
        mono: true,
        color: NOTE
      });
    }

    var BOX = { x: 108, y: 40, w: 424, h: 232 };
    var LEFT_PORT = { x: BOX.x, y: 96 };
    var RIGHT_PORT = { x: BOX.x + BOX.w, y: 96 };
    var REASONER = { x: 176, y: 74, w: 148, h: 48 };
    var HANDLER = { x: 348, y: 74, w: 148, h: 48 };
    var BELIEF = { x: 192, y: 186, w: 148, h: 48 };
    var GOAL = { x: 348, y: 186, w: 148, h: 48 };

    window.Interactive.stepper("ix-structured-class", {
      title: "Opening up a class: ports, parts and connectors",
      subtitle: "A structured class has an external structure (ports) and an internal collaboration structure (parts and connectors). The deck's HealthcareAgent, built in four layers.",
      height: 340,
      frames: [
        {
          title: "1. The class, closed",
          caption: "Start with the class as a black box. Everything the earlier sections taught still applies to it: it is a classifier, it can be specialised, and its features carry visibility. The structured view simply refuses to stop at the boundary.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var bw = 300;
            var x = (w - bw) / 2;
            classBox(k, x, 88, bw, 104, {
              title: "HealthcareAgent",
              header: 34,
              titleSize: 14,
              attrs: ["\u2014 no features shown \u2014"],
              ops: ["+handle(goal) : Outcome"]
            });
            k.label(w / 2, 240, "think of it as opening a class up and showing how its components are wired together at runtime", {
              align: "center",
              size: 11,
              color: NOTE
            });
          }
        },
        {
          title: "2. External structure: the ports",
          caption: "Ports are distinct interaction points for multiple, possibly simultaneous collaborations. They let the object tell its collaborators apart without coupling directly to them — one basic purpose of ports is the separation of roles.",
          draw: function (ctx, w, h, k) {
            k.clear();
            shell(k, BOX.x, BOX.y, BOX.w, BOX.h, "HealthcareAgent");
            port(k, LEFT_PORT.x, LEFT_PORT.y, "PatientCommPort", "provides Input", "left");
            port(k, RIGHT_PORT.x, RIGHT_PORT.y, "HospitalAPIPort", "requires CallAPI", "right");
            k.label(w / 2, 300, "provided and required interfaces on dedicated ports \u2014 never two interfaces on one port", {
              align: "center",
              size: 11,
              color: ACCENT
            });
          }
        },
        {
          title: "3. Internal structure: the parts",
          caption: "A structured class contains parts that are usages of other structured or basic classes. Each part is drawn inside the boundary as name : Type, and the deck's agent has one per capability: reasoning, intention, belief and desire.",
          draw: function (ctx, w, h, k) {
            k.clear();
            shell(k, BOX.x, BOX.y, BOX.w, BOX.h, "HealthcareAgent");
            port(k, LEFT_PORT.x, LEFT_PORT.y, "PatientCommPort", "provides Input", "left");
            port(k, RIGHT_PORT.x, RIGHT_PORT.y, "HospitalAPIPort", "requires CallAPI", "right");
            part(k, REASONER.x, REASONER.y, REASONER.w, REASONER.h, "reasoner", ": DecisionEngine");
            part(k, HANDLER.x, HANDLER.y, HANDLER.w, HANDLER.h, "intentionHandler", ": PlanExecutor");
            part(k, BELIEF.x, BELIEF.y, BELIEF.w, BELIEF.h, "beliefBase", ": KnowledgeStore");
            part(k, GOAL.x, GOAL.y, GOAL.w, GOAL.h, "goalManager", ": DesireManager");
            k.label(w / 2, 300, "should every attribute become a part? Only components with interaction points earn one.", {
              align: "center",
              size: 11,
              color: NOTE
            });
          }
        },
        {
          title: "4. Connectors between the parts",
          caption: "Connectors wire the parts: the belief base supplies beliefs to the reasoner, the goal manager supplies goals, and the reasoner drives the intention handler. These are the internal collaboration structure, not associations in a class diagram.",
          draw: function (ctx, w, h, k) {
            k.clear();
            shell(k, BOX.x, BOX.y, BOX.w, BOX.h, "HealthcareAgent");
            port(k, LEFT_PORT.x, LEFT_PORT.y, "PatientCommPort", "provides Input", "left");
            port(k, RIGHT_PORT.x, RIGHT_PORT.y, "HospitalAPIPort", "requires CallAPI", "right");
            part(k, REASONER.x, REASONER.y, REASONER.w, REASONER.h, "reasoner", ": DecisionEngine");
            part(k, HANDLER.x, HANDLER.y, HANDLER.w, HANDLER.h, "intentionHandler", ": PlanExecutor");
            part(k, BELIEF.x, BELIEF.y, BELIEF.w, BELIEF.h, "beliefBase", ": KnowledgeStore");
            part(k, GOAL.x, GOAL.y, GOAL.w, GOAL.h, "goalManager", ": DesireManager");

            k.arrow(BELIEF.x + 74, BELIEF.y, REASONER.x + 40, REASONER.y + REASONER.h, {
              color: ACCENT,
              lw: 1.8,
              head: 8
            });
            k.label(BELIEF.x + 8, BELIEF.y - 14, "Belief", { size: 10, mono: true, color: ACCENT });
            k.arrow(GOAL.x + 74, GOAL.y, REASONER.x + 112, REASONER.y + REASONER.h, {
              color: ACCENT,
              lw: 1.8,
              head: 8
            });
            k.label(GOAL.x + 40, GOAL.y - 14, "Goal", { size: 10, mono: true, color: ACCENT });
            k.arrow(REASONER.x + REASONER.w, REASONER.y + 24, HANDLER.x, HANDLER.y + 24, {
              color: ACCENT,
              lw: 1.8,
              head: 8
            });
            k.label((REASONER.x + REASONER.w + HANDLER.x) / 2, REASONER.y + 12, "Reasoning", {
              align: "center",
              size: 10,
              mono: true,
              color: ACCENT
            });
          }
        },
        {
          title: "5. Delegation connectors, and why the whole is the unit",
          caption: "A delegation connector joins a boundary port to the part that handles it. The structured class can then be created and destroyed as a unit, which is exactly what the deck's FaxCall shows with its sendCtrl and receiveCtrl ports.",
          draw: function (ctx, w, h, k) {
            k.clear();
            shell(k, BOX.x, BOX.y, BOX.w, BOX.h, "HealthcareAgent");
            port(k, LEFT_PORT.x, LEFT_PORT.y, "PatientCommPort", "provides Input", "left");
            port(k, RIGHT_PORT.x, RIGHT_PORT.y, "HospitalAPIPort", "requires CallAPI", "right");
            part(k, REASONER.x, REASONER.y, REASONER.w, REASONER.h, "reasoner", ": DecisionEngine");
            part(k, HANDLER.x, HANDLER.y, HANDLER.w, HANDLER.h, "intentionHandler", ": PlanExecutor");
            part(k, BELIEF.x, BELIEF.y, BELIEF.w, BELIEF.h, "beliefBase", ": KnowledgeStore");
            part(k, GOAL.x, GOAL.y, GOAL.w, GOAL.h, "goalManager", ": DesireManager");

            k.arrow(BELIEF.x + 74, BELIEF.y, REASONER.x + 40, REASONER.y + REASONER.h, { color: ACCENT, lw: 1.8, head: 8 });
            k.arrow(GOAL.x + 74, GOAL.y, REASONER.x + 112, REASONER.y + REASONER.h, { color: ACCENT, lw: 1.8, head: 8 });
            k.arrow(REASONER.x + REASONER.w, REASONER.y + 24, HANDLER.x, HANDLER.y + 24, { color: ACCENT, lw: 1.8, head: 8 });

            k.arrow(LEFT_PORT.x + 6, LEFT_PORT.y, REASONER.x, REASONER.y + 24, {
              color: LINE,
              lw: 2,
              dash: [6, 4],
              head: 8
            });
            k.label(LEFT_PORT.x + 96, LEFT_PORT.y + 44, "delegation", { size: 10, mono: true, color: LINE });
            k.arrow(RIGHT_PORT.x - 6, RIGHT_PORT.y, HANDLER.x + HANDLER.w, HANDLER.y + 24, {
              color: LINE,
              lw: 2,
              dash: [6, 4],
              head: 8
            });
            k.label(RIGHT_PORT.x - 60, RIGHT_PORT.y + 44, "delegation", {
              align: "right",
              size: 10,
              mono: true,
              color: LINE
            });

            k.label(w / 2, 300, "Ports, parts and connectors together \u2014 the structure that can be created and destroyed as a unit.", {
              align: "center",
              size: 11,
              weight: "600",
              color: INK
            });
          }
        }
      ]
    });
  }
})();
