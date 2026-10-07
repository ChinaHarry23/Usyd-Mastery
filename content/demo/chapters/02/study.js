/* Chapter 2 - Interactive Widgets
 *
 * Two imperative widgets live in this one file.
 *
 * 1. The config doctor. Every other widget on the page is a placeholder plus a
 *    JSON block. This script does the engine's job in reverse: it collects
 *    every placeholder, parses the config each one points at, checks the keys
 *    that widget type requires, checks the shape of every list item, and writes
 *    a short report into #ix-lint-report.
 *
 * 2. The canvas stepper. A stepper cannot be declarative, because its frames
 *    carry draw(ctx, w, h, k) FUNCTIONS and JSON cannot hold a function. It is
 *    mounted by hand into #ix-ch2-stepper:
 *
 *      Interactive.stepper("ix-ch2-stepper", { frames: [ ... ] })
 *
 *    To rebuild the same placeholder in place, call Interactive.destroy(id)
 *    first, then mount again - never empty the element by hand.
 *
 * Both follow the same four rules:
 *   1. find a mount point by id, and do nothing if it is absent;
 *   2. read the data you need from the document itself;
 *   3. build plain semantic elements, never markup strings;
 *   4. fail with a sentence a reader can act on.
 *
 * Only standard browser globals are used, so the report still renders on a page
 * that never loads the shared interactive bundle. The stepper is the one part
 * that needs window.Interactive, and it returns quietly when that is missing.
 */
(function () {
  "use strict";

  /* Required keys per widget type, mirroring the renderer in
     shared/interactive.js. `stepper` is absent by design: it has no JSON form. */
  var REQUIRED = {
    sequence: ["title", "steps"],
    matcher: ["title", "pairs"],
    timeline: ["title", "events"],
    hotspot: ["title", "points"],
    deck: ["title", "cards"],
    race: ["title", "max", "rows"],
    pipeline: ["title", "nodes"]
  };

  /* Keys whose value must be a non-empty list of records. */
  var LIST_KEYS = {
    steps: true,
    pairs: true,
    events: true,
    points: true,
    cards: true,
    rows: true,
    nodes: true
  };

  /* One item of a list, checked the way the renderer reads it.
     Each rule returns "" when the item is fine, or a sentence when it is not. */
  var ITEM_RULES = {
    steps: function (v) {
      return typeof v === "string" ? "" : "each step must be a plain string, not an object";
    },
    pairs: function (v) {
      return Array.isArray(v) && v.length === 2
        ? ""
        : "each pair must be a two-element array [left, right]";
    },
    events: function (v) {
      return v && v.label && v.title && v.detail ? "" : "each event needs label, title and detail";
    },
    points: function (v) {
      return v && typeof v.x === "number" && typeof v.y === "number" && v.label && v.detail
        ? ""
        : "each point needs numeric x and y, plus label and detail";
    },
    cards: function (v) {
      return v && v.front && v.back ? "" : "each card needs front and back";
    },
    rows: function (v) {
      return v && v.name && typeof v.value === "number"
        ? ""
        : "each row needs name and a numeric value";
    },
    nodes: function (v) {
      return v && v.label ? "" : "each node needs label";
    }
  };

  function element(tag, text) {
    var node = document.createElement(tag);
    if (text) node.textContent = text;
    return node;
  }

  /* Inspect one placeholder and return a plain result record. */
  function inspect(placeholder) {
    var type = placeholder.getAttribute("data-ix") || "(none)";
    var src = placeholder.getAttribute("data-ix-src") || "";
    var id = src.charAt(0) === "#" ? src.slice(1) : src;
    var result = { type: type, id: id, ok: false, note: "" };

    if (!id) {
      result.note = "placeholder has no data-ix-src reference";
      return result;
    }

    var holder = document.getElementById(id);
    if (!holder) {
      result.note = "no config block carries the id " + src;
      return result;
    }

    var config;
    try {
      config = JSON.parse(holder.textContent);
    } catch (err) {
      result.note = "config is not valid JSON: " + err.message;
      return result;
    }

    var required = REQUIRED[type];
    if (!required) {
      result.note = "unknown widget type, so there is no schema to check";
      return result;
    }

    var i;
    for (i = 0; i < required.length; i++) {
      var key = required[i];
      if (config[key] === undefined) {
        result.note = "missing required key: " + key;
        return result;
      }
      if (LIST_KEYS[key] && (!Array.isArray(config[key]) || config[key].length === 0)) {
        result.note = key + " must be a non-empty list";
        return result;
      }
    }

    /* A hotspot carries its drawing in exactly one of two keys, never both. */
    if (type === "hotspot") {
      var drawings = ["svg", "img"].filter(function (k) {
        return config[k] !== undefined;
      });
      if (drawings.length !== 1) {
        result.note = "needs exactly one of svg or img, found " + drawings.length;
        return result;
      }
    }

    /* A race scales every bar by max, so a string there draws nothing useful. */
    if (type === "race" && typeof config.max !== "number") {
      result.note = "max must be a number, because it scales every bar";
      return result;
    }

    var listKey = required[required.length - 1];
    var list = config[listKey];
    for (i = 0; i < list.length; i++) {
      var why = ITEM_RULES[listKey](list[i]);
      if (why) {
        result.note = listKey + "[" + i + "]: " + why;
        return result;
      }
    }

    result.ok = true;
    result.note = list.length + " entries in " + listKey;
    return result;
  }

  function render(host, results) {
    while (host.firstChild) host.removeChild(host.firstChild);

    var passed = 0;
    var i;
    for (i = 0; i < results.length; i++) {
      if (results[i].ok) passed++;
    }

    host.appendChild(element("h3", "Config doctor"));
    host.appendChild(
      element(
        "p",
        results.length +
          " declarative widget blocks on this page, " +
          passed +
          " with every required key and the right item shape."
      )
    );

    var list = element("ul");
    for (i = 0; i < results.length; i++) {
      var item = element("li");
      var name = element("strong", results[i].type);
      item.appendChild(name);
      item.appendChild(document.createTextNode(" \u2014 " + results[i].note));
      if (!results[i].ok) {
        item.appendChild(document.createTextNode(" "));
        var code = element("code", "#" + results[i].id);
        item.appendChild(code);
      }
      list.appendChild(item);
    }
    host.appendChild(list);

    host.appendChild(
      element(
        "p",
        "This is one of two imperative widgets on the page: chapters/02/study.js built this report " +
          "and the canvas stepper in the first section. The other five widgets were declared in JSON."
      )
    );
  }

  function mountReport() {
    var host = document.getElementById("ix-lint-report");
    if (!host) return;

    var placeholders = document.querySelectorAll("[data-ix]");
    var results = [];
    var i;
    for (i = 0; i < placeholders.length; i++) {
      results.push(inspect(placeholders[i]));
    }
    render(host, results);
  }

  /* ── The imperative stepper ───────────────────────────────────────
   * Seven frames, one per milestone from an empty folder to a validated
   * pack. Every frame paints the same scale and marks its own position on
   * it, so the drawing changes at a fixed size. The ratio is the one the
   * foundations page derives: fraction = value / max, with max = 6.
   */

  var SCALE_MAX = 6;

  var MILESTONES = [
    {
      label: "Empty folder",
      caption: "chapters/04 exists and holds nothing. Nothing else in the pack refers to it yet, which is the right starting state."
    },
    {
      label: "Registered in the manifest",
      caption: "course.json now lists the chapter. The hub home card can render a row for it even though the pages behind it are still missing."
    },
    {
      label: "Study page drafted",
      caption: "The teaching page has its hero, its sections and its anchors. Prose comes first because every other file quotes these anchors."
    },
    {
      label: "Foundations page drafted",
      caption: "The math page states the two or three results the study page leans on, with display maths for anything that needs a symbol."
    },
    {
      label: "Mind map sketched",
      caption: "Three or four branches group the finished sections. Every leaf points at an anchor that exists today, not one you plan to add."
    },
    {
      label: "Chapter script added",
      caption: "Only if the page needs behaviour the declarative widgets cannot express. Most chapters stop at the previous step and skip this one."
    },
    {
      label: "Validated",
      caption: "Manifest, widget blocks and mind map all parse, and every anchor referenced by the data files resolves. The chapter is finished."
    }
  ];

  /* One frame per milestone. The draw function is why this widget cannot be
     written as JSON: it is behaviour, not data. */
  function scaleFrame(index) {
    return {
      title: MILESTONES[index].label,
      caption: MILESTONES[index].caption + "  (" + index + " of " + SCALE_MAX + ")",
      draw: function (ctx, w, h, k) {
        k.clear();

        var pad = Math.max(28, Math.min(46, w * 0.06));
        var trackW = Math.max(120, w - pad * 2);
        var y = Math.round(h * 0.44);
        var i;
        var x;

        k.label(pad, y - 44, "fraction = value / max", {
          size: 11,
          mono: true,
          color: k.theme.dim
        });

        /* the scale itself: filled to the current milestone, empty after it */
        k.bar(pad, y - 7, trackW, 14, index, { max: SCALE_MAX, fill: k.theme.accent });

        for (i = 0; i <= SCALE_MAX; i++) {
          x = pad + (trackW * i) / SCALE_MAX;
          k.dot(x, y, i <= index ? 5.5 : 4, {
            fill: i <= index ? k.theme.accent : "#ffffff",
            stroke: i <= index ? k.theme.accent : k.theme.track,
            lw: 2
          });
          k.label(x, y + 22, String(i), {
            align: "center",
            size: 11,
            mono: true,
            color: i <= index ? k.theme.muted : k.theme.dim
          });
        }

        k.highlight(pad - 14, y - 26, trackW + 28, 52, {
          color: k.theme.accent,
          dash: [5, 4]
        });

        k.label(pad, y + 56, MILESTONES[index].label, {
          size: 15,
          weight: "700",
          color: k.theme.text
        });
        k.label(pad, y + 78, "value " + index + " / max " + SCALE_MAX + "  =  " + (index / SCALE_MAX).toFixed(3), {
          size: 12,
          mono: true,
          color: k.theme.muted
        });
      }
    };
  }

  function mountStepper() {
    if (!window.Interactive || typeof window.Interactive.stepper !== "function") return;
    if (!document.getElementById("ix-ch2-stepper")) return;

    /* Idempotent by construction: destroy() clears whatever was mounted
       before, so a language swap can call this again safely. */
    window.Interactive.destroy("ix-ch2-stepper");

    var frames = [];
    var i;
    for (i = 0; i < MILESTONES.length; i++) frames.push(scaleFrame(i));

    window.Interactive.stepper("ix-ch2-stepper", {
      title: "How complete is your chapter?",
      subtitle: "Seven milestones, from an empty folder to a validated pack.",
      height: 240,
      frames: frames
    });
  }

  function mount() {
    mountReport();
    mountStepper();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  /* A language swap replaces section markup, so both widgets are rebuilt. */
  window.addEventListener("langchange", mount);
})();
