/* ================================================================
   interactive.js — Shared interactive + animated learning widgets
   ================================================================

   Canonical location: /shared/interactive.js
   Styles:            /shared/interactive.css (imported by study-base.css)

   Load it once per chapter page, after progress-tracker.js:

     <script defer src="../../../../shared/interactive.js"></script>

   ── Declarative use (no JS authoring needed) ─────────────────────
   Drop a placeholder and a JSON config next to it:

     <div data-ix="sequence" data-ix-src="#ix-seq-1"></div>
     <script type="application/json" id="ix-seq-1">
       { "title": "...", "steps": ["first", "second", "third"] }
     </script>

   Supported declarative types:
     sequence  steps[]                       order the steps
     matcher   pairs[[left, right], ...]     match the pairs
     timeline  events[{label,title,detail}]  event timeline player
     hotspot   points[{x,y,label,detail}]    annotated diagram
     deck      cards[{front,back,hint}]      flip-card deck
     race      rows[{name,value,display}]    animated comparison bars
     pipeline  nodes[{label,note}]           animated process pipeline

   Anything with a `zh` twin key gets the Chinese variant when the
   language toggle is set to 中文 (see LABELS below for built-ins).

   ── Imperative use (canvas animation) ────────────────────────────
     var api = Interactive.stepper("mount-id", {
       title: "Binary search",
       height: 240,
       frames: [
         { title: "Start", caption: "lo=0, hi=n-1",
           draw: function (ctx, w, h, c) { ...; c.label(x, y, "lo"); } }
       ]
     });
     api.play(); api.go(2); api.pause();

   `draw` receives (ctx, width, height, ctxKit) where ctxKit has
   helpers: clear(), box(), label(), arrow(), bar(), dot(), highlight().

   All widgets respect prefers-reduced-motion and re-render labels on
   the language toggle's `langchange` event.
   ================================================================ */

(function () {
  "use strict";

  var REDUCED =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var LABELS = {
    play: { en: "Play", zh: "\u64ad\u653e" },
    pause: { en: "Pause", zh: "\u6682\u505c" },
    step: { en: "Step", zh: "\u5355\u6b65" },
    prev: { en: "Back", zh: "\u4e0a\u4e00\u6b65" },
    next: { en: "Next", zh: "\u4e0b\u4e00\u6b65" },
    reset: { en: "Reset", zh: "\u91cd\u7f6e" },
    check: { en: "Check", zh: "\u68c0\u67e5" },
    retry: { en: "Try again", zh: "\u91cd\u8bd5" },
    shuffle: { en: "Shuffle", zh: "\u6253\u4e71" },
    frame: { en: "Frame", zh: "\u5e27" },
    poolEmpty: {
      en: "All steps placed \u2014 now check the order.",
      zh: "\u6240\u6709\u6b65\u9aa4\u5df2\u653e\u7f6e\u2014\u2014\u73b0\u5728\u68c0\u67e5\u987a\u5e8f\u3002",
    },
    pickFirst: {
      en: "Select an item on the left, then its partner on the right.",
      zh: "\u5148\u9009\u62e9\u5de6\u4fa7\u9879\uff0c\u518d\u9009\u62e9\u53f3\u4fa7\u7684\u5339\u914d\u9879\u3002",
    },
    pairedAll: { en: "All pairs matched.", zh: "\u5168\u90e8\u5339\u914d\u5b8c\u6210\u3002" },
    notPaired: { en: "Not a match \u2014 try again.", zh: "\u4e0d\u5339\u914d\u2014\u2014\u518d\u8bd5\u4e00\u6b21\u3002" },
    orderGood: {
      en: "Perfect \u2014 that is the correct order.",
      zh: "\u5b8c\u7f8e\u2014\u2014\u987a\u5e8f\u5b8c\u5168\u6b63\u786e\u3002",
    },
    orderBad: {
      en: "Not quite \u2014 the highlighted steps are out of place.",
      zh: "\u8fd8\u4e0d\u5bf9\u2014\u2014\u9ad8\u4eae\u7684\u6b65\u9aa4\u4f4d\u7f6e\u6709\u8bef\u3002",
    },
    orderIncomplete: {
      en: "Place every step before checking.",
      zh: "\u8bf7\u5148\u653e\u7f6e\u6240\u6709\u6b65\u9aa4\u518d\u68c0\u67e5\u3002",
    },
    clickMarker: {
      en: "Click a marker to inspect it.",
      zh: "\u70b9\u51fb\u6807\u8bb0\u4ee5\u67e5\u770b\u8be6\u60c5\u3002",
    },
    flipHint: { en: "Click to flip", zh: "\u70b9\u51fb\u7ffb\u9762" },
  };

  function lang() {
    try {
      if (typeof window.getLang === "function") return window.getLang();
    } catch (e) {
      /* ignore */
    }
    return "en";
  }

  function t(key, override) {
    if (override) return override;
    var entry = LABELS[key];
    if (!entry) return key;
    return lang() === "zh" ? entry.zh : entry.en;
  }

  /**
   * Read a translatable field.
   *
   * Resolution order when the UI is in Chinese:
   *   1. the inline `<field>Zh` twin in the widget config
   *   2. `window.IX_ZH[<english string>]` — a page-level lookup table, so
   *      canvas widgets whose labels live in JS can still be translated
   *      without duplicating every config object
   *   3. the English string
   *
   * The map is loaded from the hub's shared/translations.js, which every
   * chapter page already includes.
   */
  function pick(obj, base) {
    if (!obj) return undefined;
    var value = obj[base];
    if (lang() !== "zh" || value == null) return value;
    if (obj[base + "Zh"] != null) return obj[base + "Zh"];
    var map = typeof window !== "undefined" ? window.IX_ZH : null;
    if (map && typeof value === "string" && Object.prototype.hasOwnProperty.call(map, value)) {
      return map[value];
    }
    return value;
  }

  function resolve(mount) {
    if (typeof mount === "string") return document.getElementById(mount);
    return mount;
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /* ── Canvas helpers ─────────────────────────────────────────── */

  function makeCtxKit(ctx, w, h, theme) {
    return {
      w: w,
      h: h,
      theme: theme,
      clear: function (fill) {
        ctx.clearRect(0, 0, w, h);
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fillRect(0, 0, w, h);
        }
      },
      box: function (x, y, bw, bh, opts) {
        opts = opts || {};
        ctx.save();
        if (opts.fill) {
          ctx.fillStyle = opts.fill;
          roundRect(ctx, x, y, bw, bh, opts.r == null ? 8 : opts.r);
          ctx.fill();
        }
        if (opts.stroke) {
          ctx.strokeStyle = opts.stroke;
          ctx.lineWidth = opts.lw || 1.5;
          roundRect(ctx, x, y, bw, bh, opts.r == null ? 8 : opts.r);
          ctx.stroke();
        }
        ctx.restore();
      },
      label: function (x, y, text, opts) {
        opts = opts || {};
        ctx.save();
        ctx.fillStyle = opts.color || theme.text;
        ctx.font =
          (opts.weight || "600") +
          " " +
          (opts.size || 13) +
          "px " +
          (opts.mono ? theme.mono : theme.font);
        ctx.textAlign = opts.align || "left";
        ctx.textBaseline = opts.baseline || "middle";
        ctx.fillText(String(text), x, y);
        ctx.restore();
      },
      dot: function (x, y, r, opts) {
        opts = opts || {};
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = opts.fill || theme.accent;
        ctx.fill();
        if (opts.stroke) {
          ctx.strokeStyle = opts.stroke;
          ctx.lineWidth = opts.lw || 2;
          ctx.stroke();
        }
        ctx.restore();
      },
      bar: function (x, y, bw, bh, value, opts) {
        opts = opts || {};
        var max = opts.max || 1;
        var ratio = Math.max(0, Math.min(1, value / max));
        ctx.save();
        ctx.fillStyle = opts.track || theme.track;
        roundRect(ctx, x, y, bw, bh, bh / 2);
        ctx.fill();
        if (ratio > 0) {
          ctx.fillStyle = opts.fill || theme.accent;
          roundRect(ctx, x, y, Math.max(bh, bw * ratio), bh, bh / 2);
          ctx.fill();
        }
        ctx.restore();
      },
      arrow: function (x1, y1, x2, y2, opts) {
        opts = opts || {};
        ctx.save();
        ctx.strokeStyle = opts.color || theme.dim;
        ctx.lineWidth = opts.lw || 1.6;
        if (opts.dash) ctx.setLineDash(opts.dash);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        var angle = Math.atan2(y2 - y1, x2 - x1);
        var head = opts.head || 7;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - head * Math.cos(angle - 0.4), y2 - head * Math.sin(angle - 0.4));
        ctx.lineTo(x2 - head * Math.cos(angle + 0.4), y2 - head * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fillStyle = opts.color || theme.dim;
        ctx.fill();
        ctx.restore();
      },
      highlight: function (x, y, bw, bh, opts) {
        opts = opts || {};
        ctx.save();
        ctx.strokeStyle = opts.color || theme.accent;
        ctx.lineWidth = opts.lw || 2;
        ctx.setLineDash(opts.dash || [5, 4]);
        roundRect(ctx, x, y, bw, bh, opts.r == null ? 9 : opts.r);
        ctx.stroke();
        ctx.restore();
      },
      code: function (x, y, lines, opts) {
        opts = opts || {};
        var size = opts.size || 12.5;
        var lh = opts.lh || size * 1.55;
        ctx.save();
        ctx.font = "500 " + size + "px " + theme.mono;
        ctx.textBaseline = "middle";
        lines.forEach(function (line, i) {
          ctx.fillStyle =
            typeof line === "string" ? opts.color || theme.text : line.color || theme.text;
          ctx.fillText(typeof line === "string" ? line : line.text, x, y + i * lh);
        });
        ctx.restore();
      },
    };
  }

  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function readTheme(host) {
    var cs = window.getComputedStyle(host || document.documentElement);
    function v(name, fallback) {
      var got = cs.getPropertyValue(name);
      return (got && got.trim()) || fallback;
    }
    return {
      accent: v("--accent", "#6366f1"),
      accentSoft: v("--accent-glow", "rgba(99,102,241,0.14)"),
      text: v("--text", "#1a1632"),
      dim: v("--text-dim", "#8580a0"),
      muted: v("--text-muted", "#5e5878"),
      track: v("--border", "rgba(0,0,0,0.12)"),
      font: v("--font", "system-ui, sans-serif"),
      mono: v("--font-mono", "ui-monospace, monospace"),
      green: v("--green", "#34d399"),
      red: v("--red", "#f87171"),
    };
  }

  /* ── Widget shell ───────────────────────────────────────────── */

  function shell(host, cfg) {
    clear(host);
    host.classList.add("ix");

    var head = el("div", "ix-head");
    var copy = el("div");
    if (cfg.title) copy.appendChild(el("h3", null, pick(cfg, "title")));
    if (cfg.subtitle) copy.appendChild(el("p", "ix-sub", pick(cfg, "subtitle")));
    head.appendChild(copy);
    if (cfg.badge) head.appendChild(el("span", "ix-badge", pick(cfg, "badge")));
    host.appendChild(head);

    return { head: head, body: el("div", "ix-body") };
  }

  function feedbackLine(host) {
    var line = el("div", "ix-feedback");
    line.setAttribute("role", "status");
    line.setAttribute("aria-live", "polite");
    host.appendChild(line);
    return line;
  }

  function say(line, text, kind) {
    line.textContent = text || "";
    line.className = "ix-feedback" + (kind ? " " + kind : "");
  }

  /* ── 1. Stepper (animated canvas frames) ────────────────────── */

  function stepper(mount, cfg) {
    var host = resolve(mount);
    if (!host) return null;
    cfg = cfg || {};
    var frames = cfg.frames || [];
    if (!frames.length) return null;

    var parts = shell(host, cfg);
    var stage = el("div", "ix-stage");
    var canvas = el("canvas");
    var height = cfg.height || 240;
    canvas.style.height = height + "px";
    stage.appendChild(canvas);
    host.appendChild(parts.body);
    parts.body.appendChild(stage);

    var caption = el("div", "ix-caption");
    parts.body.appendChild(caption);

    var transport = el("div", "ix-transport");
    var btnPrev = el("button", "ix-btn", "\u25C0");
    var btnPlay = el("button", "ix-btn ix-primary", t("play"));
    var btnNext = el("button", "ix-btn", "\u25B6");
    var scrub = el("input", "ix-scrub");
    scrub.type = "range";
    scrub.min = "0";
    scrub.max = String(frames.length - 1);
    scrub.value = "0";
    scrub.setAttribute("aria-label", t("step"));
    var count = el("span", "ix-count");
    transport.appendChild(btnPrev);
    transport.appendChild(btnPlay);
    transport.appendChild(btnNext);
    transport.appendChild(scrub);
    transport.appendChild(count);
    parts.body.appendChild(transport);

    var dots = el("div", "ix-dots");
    frames.forEach(function (_, i) {
      var dot = el("button", "ix-dot");
      dot.type = "button";
      dot.setAttribute("aria-label", t("frame") + " " + (i + 1));
      dot.addEventListener("click", function () {
        pause();
        go(i);
      });
      dots.appendChild(dot);
    });
    parts.body.appendChild(dots);

    var index = 0;
    var timer = null;

    function theme() {
      return readTheme(host);
    }

    function paint() {
      var dpr = window.devicePixelRatio || 1;
      var w = canvas.clientWidth || stage.clientWidth || 640;
      var h = height;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      var ctx = canvas.getContext("2d");
      if (!ctx) return; // headless / unsupported canvas — captions still work
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var th = theme();
      var kit = makeCtxKit(ctx, w, h, th);
      kit.clear();
      var frame = frames[index];
      try {
        if (frame.draw) frame.draw(ctx, w, h, kit);
      } catch (e) {
        kit.label(12, 24, "draw error: " + e.message, { color: th.red, size: 12 });
      }
    }

    function syncUi() {
      var frame = frames[index];
      var title = pick(frame, "title");
      var text = pick(frame, "caption");
      caption.innerHTML = "";
      if (title) {
        var strong = el("strong", null, title);
        caption.appendChild(strong);
        caption.appendChild(document.createTextNode(text ? " \u2014 " + text : ""));
      } else {
        caption.textContent = text || "";
      }
      scrub.value = String(index);
      count.textContent = index + 1 + " / " + frames.length;
      btnPrev.disabled = index === 0;
      btnNext.disabled = index === frames.length - 1;
      Array.prototype.forEach.call(dots.children, function (dot, i) {
        dot.classList.toggle("active", i === index);
        dot.classList.toggle("done", i < index);
      });
      paint();
    }

    function go(i) {
      index = Math.max(0, Math.min(frames.length - 1, i));
      syncUi();
    }

    function play() {
      if (timer || REDUCED) return;
      btnPlay.textContent = t("pause");
      timer = window.setInterval(function () {
        if (index >= frames.length - 1) {
          pause();
          return;
        }
        go(index + 1);
      }, cfg.intervalMs || 1800);
    }

    function pause() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      btnPlay.textContent = t("play");
    }

    btnPrev.addEventListener("click", function () {
      pause();
      go(index - 1);
    });
    btnNext.addEventListener("click", function () {
      pause();
      go(index + 1);
    });
    btnPlay.addEventListener("click", function () {
      if (timer) pause();
      else play();
    });
    scrub.addEventListener("input", function () {
      pause();
      go(parseInt(scrub.value, 10) || 0);
    });
    function onResize() {
      paint();
    }
    window.addEventListener("resize", onResize);

    var api = {
      go: go,
      play: play,
      pause: pause,
      redraw: syncUi,
      index: function () {
        return index;
      },
      el: host,
    };

    syncUi();
    if (cfg.autoplay && !REDUCED) play();

    host._ixRefresh = function () {
      btnPlay.textContent = timer ? t("pause") : t("play");
      syncUi();
    };
    host._ixTeardown = function () {
      pause();
      window.removeEventListener("resize", onResize);
    };

    return api;
  }

  /* ── 2. Sequence (order the steps) ──────────────────────────── */

  function sequence(mount, cfg) {
    var host = resolve(mount);
    if (!host) return null;
    cfg = cfg || {};
    var steps = (cfg.steps || []).slice();
    if (!steps.length) return null;

    var parts = shell(host, cfg);
    host.appendChild(parts.body);

    var order = steps.map(function (_, i) {
      return i;
    });
    // Deterministic-but-shuffled starting pool (avoids always-in-order).
    var seed = cfg.seed == null ? 7 : cfg.seed;
    var shuffled = order.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      var j = seed % (i + 1);
      var tmp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = tmp;
    }
    var placed = new Array(steps.length).fill(null);
    var pool = shuffled.slice();

    var poolEl = el("div", "ix-pool");
    var slotsEl = el("div", "ix-slots");
    var transport = el("div", "ix-transport");
    var btnCheck = el("button", "ix-btn ix-primary", t("check"));
    var btnReset = el("button", "ix-btn", t("reset"));
    var btnShuffle = el("button", "ix-btn", t("shuffle"));
    transport.appendChild(btnCheck);
    transport.appendChild(btnShuffle);
    transport.appendChild(btnReset);

    parts.body.appendChild(poolEl);
    parts.body.appendChild(slotsEl);
    parts.body.appendChild(transport);
    var line = feedbackLine(parts.body);

    function render() {
      clear(poolEl);
      poolEl.setAttribute("data-empty", t("poolEmpty"));
      pool.forEach(function (stepIndex) {
        var chip = el("button", "ix-chip", steps[stepIndex]);
        chip.type = "button";
        chip.addEventListener("click", function () {
          var slot = placed.indexOf(null);
          if (slot === -1) return;
          placed[slot] = stepIndex;
          pool.splice(pool.indexOf(stepIndex), 1);
          say(line, "");
          render();
        });
        poolEl.appendChild(chip);
      });

      clear(slotsEl);
      placed.forEach(function (stepIndex, slot) {
        var row = el("div", "ix-slot" + (stepIndex == null ? "" : " filled"));
        if (stepIndex == null) {
          row.appendChild(el("span", null, "\u2014"));
        } else {
          var chip = el("button", "ix-chip placed", steps[stepIndex]);
          chip.type = "button";
          chip.addEventListener("click", function () {
            pool.push(stepIndex);
            placed[slot] = null;
            say(line, "");
            render();
          });
          row.appendChild(chip);
        }
        slotsEl.appendChild(row);
      });
    }

    btnCheck.addEventListener("click", function () {
      if (placed.indexOf(null) !== -1) {
        say(line, t("orderIncomplete"), "bad");
        return;
      }
      var allRight = true;
      Array.prototype.forEach.call(slotsEl.children, function (row, slot) {
        var ok = placed[slot] === slot;
        row.classList.remove("right", "wrong");
        row.classList.add(ok ? "right" : "wrong");
        var chip = row.querySelector(".ix-chip");
        if (chip) {
          chip.classList.remove("right", "wrong");
          chip.classList.add(ok ? "right" : "wrong");
        }
        if (!ok) allRight = false;
      });
      say(line, allRight ? t("orderGood") : t("orderBad"), allRight ? "good" : "bad");
    });

    btnReset.addEventListener("click", function () {
      placed = new Array(steps.length).fill(null);
      pool = shuffled.slice();
      say(line, "");
      render();
    });

    btnShuffle.addEventListener("click", function () {
      pool = pool.concat(
        placed.filter(function (x) {
          return x != null;
        })
      );
      placed = new Array(steps.length).fill(null);
      for (var k = pool.length - 1; k > 0; k--) {
        var r = Math.floor(Math.random() * (k + 1));
        var tmp = pool[k];
        pool[k] = pool[r];
        pool[r] = tmp;
      }
      say(line, "");
      render();
    });

    render();
    host._ixRefresh = function () {
      btnCheck.textContent = t("check");
      btnReset.textContent = t("reset");
      btnShuffle.textContent = t("shuffle");
      render();
    };
    return { el: host };
  }

  /* ── 3. Matcher (pair up) ───────────────────────────────────── */

  function matcher(mount, cfg) {
    var host = resolve(mount);
    if (!host) return null;
    cfg = cfg || {};
    var pairs = cfg.pairs || [];
    if (!pairs.length) return null;

    var parts = shell(host, cfg);
    host.appendChild(parts.body);

    var grid = el("div", "ix-match-grid");
    var colL = el("div", "ix-match-col");
    var colR = el("div", "ix-match-col");
    grid.appendChild(colL);
    grid.appendChild(colR);
    parts.body.appendChild(grid);
    var line = feedbackLine(parts.body);
    say(line, t("pickFirst"));

    var rightOrder = pairs.map(function (_, i) {
      return i;
    });
    for (var k = rightOrder.length - 1; k > 0; k--) {
      var r = Math.floor(Math.random() * (k + 1));
      var tmp = rightOrder[k];
      rightOrder[k] = rightOrder[r];
      rightOrder[r] = tmp;
    }

    var selectedLeft = null;
    var matched = 0;

    function makeItem(text, side, index) {
      var btn = el("button", "ix-match-item", text);
      btn.type = "button";
      btn.dataset.side = side;
      btn.dataset.pair = String(index);
      btn.addEventListener("click", function () {
        if (btn.classList.contains("paired")) return;
        if (side === "l") {
          Array.prototype.forEach.call(colL.children, function (n) {
            n.classList.remove("selected");
          });
          selectedLeft = btn;
          btn.classList.add("selected");
          return;
        }
        if (!selectedLeft) {
          say(line, t("pickFirst"));
          return;
        }
        if (selectedLeft.dataset.pair === btn.dataset.pair) {
          selectedLeft.classList.remove("selected");
          selectedLeft.classList.add("paired");
          btn.classList.add("paired");
          selectedLeft = null;
          matched += 1;
          say(line, matched === pairs.length ? t("pairedAll") : "", "good");
        } else {
          btn.classList.add("wrong");
          var wrong = btn;
          window.setTimeout(function () {
            wrong.classList.remove("wrong");
          }, 420);
          say(line, t("notPaired"), "bad");
        }
      });
      return btn;
    }

    pairs.forEach(function (pair, i) {
      colL.appendChild(makeItem(pair[0], "l", i));
    });
    rightOrder.forEach(function (i) {
      colR.appendChild(makeItem(pairs[i][1], "r", i));
    });

    host._ixRefresh = function () {
      say(line, matched === pairs.length ? t("pairedAll") : t("pickFirst"));
    };
    return { el: host };
  }

  /* ── 4. Timeline ────────────────────────────────────────────── */

  function timeline(mount, cfg) {
    var host = resolve(mount);
    if (!host) return null;
    cfg = cfg || {};
    var events = cfg.events || [];
    if (!events.length) return null;

    var parts = shell(host, cfg);
    host.appendChild(parts.body);

    var track = el("div", "ix-track");
    var line = el("div", "ix-track-line");
    var fill = el("div", "ix-track-fill");
    track.appendChild(line);
    track.appendChild(fill);
    parts.body.appendChild(track);

    var marks = [];
    events.forEach(function (ev, i) {
      var mark = el("button", "ix-mark");
      mark.type = "button";
      mark.style.left = events.length === 1 ? "50%" : (i / (events.length - 1)) * 100 + "%";
      mark.appendChild(el("span", "ix-mark-dot"));
      mark.appendChild(el("span", "ix-mark-label", ev.label || String(i + 1)));
      mark.addEventListener("click", function () {
        stop();
        go(i);
      });
      track.appendChild(mark);
      marks.push(mark);
    });

    var caption = el("div", "ix-caption");
    parts.body.appendChild(caption);

    var transport = el("div", "ix-transport");
    var btnPrev = el("button", "ix-btn", "\u25C0");
    var btnPlay = el("button", "ix-btn ix-primary", t("play"));
    var btnNext = el("button", "ix-btn", "\u25B6");
    var btnReset = el("button", "ix-btn", t("reset"));
    transport.appendChild(btnPrev);
    transport.appendChild(btnPlay);
    transport.appendChild(btnNext);
    transport.appendChild(btnReset);
    parts.body.appendChild(transport);

    var index = 0;
    var timer = null;

    function syncUi() {
      var ev = events[index];
      caption.innerHTML = "";
      if (ev.title) caption.appendChild(el("strong", null, pick(ev, "title")));
      if (ev.detail) {
        if (ev.title) caption.appendChild(document.createTextNode(" \u2014 "));
        caption.appendChild(document.createTextNode(pick(ev, "detail")));
      }
      fill.style.width =
        events.length === 1 ? "100%" : (index / (events.length - 1)) * 100 + "%";
      marks.forEach(function (m, i) {
        m.classList.toggle("active", i === index);
        m.classList.toggle("done", i < index);
      });
      btnPrev.disabled = index === 0;
      btnNext.disabled = index === events.length - 1;
    }

    function go(i) {
      index = Math.max(0, Math.min(events.length - 1, i));
      syncUi();
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      btnPlay.textContent = t("play");
    }

    function play() {
      if (timer || REDUCED) return;
      btnPlay.textContent = t("pause");
      timer = window.setInterval(function () {
        if (index >= events.length - 1) {
          stop();
          return;
        }
        go(index + 1);
      }, cfg.intervalMs || 2200);
    }

    btnPrev.addEventListener("click", function () {
      stop();
      go(index - 1);
    });
    btnNext.addEventListener("click", function () {
      stop();
      go(index + 1);
    });
    btnReset.addEventListener("click", function () {
      stop();
      go(0);
    });
    btnPlay.addEventListener("click", function () {
      if (timer) stop();
      else play();
    });

    syncUi();
    if (cfg.autoplay && !REDUCED) play();

    host._ixRefresh = function () {
      btnPlay.textContent = timer ? t("pause") : t("play");
      btnPrev.textContent = "\u25C0";
      btnNext.textContent = "\u25B6";
      btnReset.textContent = t("reset");
      syncUi();
    };
    host._ixTeardown = stop;
    return { go: go, play: play, pause: stop, el: host };
  }

  /* ── 5. Hotspots ────────────────────────────────────────────── */

  function hotspot(mount, cfg) {
    var host = resolve(mount);
    if (!host) return null;
    cfg = cfg || {};
    var points = cfg.points || [];
    if (!points.length) return null;

    var parts = shell(host, cfg);
    host.appendChild(parts.body);

    var wrap = el("div", "ix-hotspot-wrap");
    if (cfg.img) {
      var img = el("img");
      img.src = cfg.img;
      img.alt = pick(cfg, "imgAlt") || "";
      wrap.appendChild(img);
    } else if (cfg.svg) {
      wrap.innerHTML = cfg.svg;
    }
    parts.body.appendChild(wrap);

    var caption = el("div", "ix-caption", t("clickMarker"));
    parts.body.appendChild(caption);

    points.forEach(function (pt, i) {
      var btn = el("button", "ix-hotspot", String(i + 1));
      btn.type = "button";
      btn.style.left = pt.x + "%";
      btn.style.top = pt.y + "%";
      btn.setAttribute("aria-label", pt.label || "point " + (i + 1));
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(wrap.querySelectorAll(".ix-hotspot"), function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        caption.innerHTML = "";
        if (pt.label) caption.appendChild(el("strong", null, pick(pt, "label")));
        if (pt.detail) {
          if (pt.label) caption.appendChild(document.createTextNode(" \u2014 "));
          caption.appendChild(document.createTextNode(pick(pt, "detail")));
        }
      });
      wrap.appendChild(btn);
    });

    host._ixRefresh = function () {
      if (!caption.querySelector("strong")) caption.textContent = t("clickMarker");
    };
    return { el: host };
  }

  /* ── 6. Flip-card deck ──────────────────────────────────────── */

  function deck(mount, cfg) {
    var host = resolve(mount);
    if (!host) return null;
    cfg = cfg || {};
    var cards = cfg.cards || [];
    if (!cards.length) return null;

    var parts = shell(host, cfg);
    host.appendChild(parts.body);

    var grid = el("div", "ix-deck-grid");
    cards.forEach(function (card) {
      var flip = el("button", "ix-flip");
      flip.type = "button";
      var inner = el("div", "ix-flip-inner");

      var front = el("div", "ix-flip-face ix-flip-front");
      front.appendChild(el("h4", null, pick(card, "front")));
      front.appendChild(el("span", "ix-flip-hint", pick(card, "hint") || t("flipHint")));

      var back = el("div", "ix-flip-face ix-flip-back");
      back.appendChild(el("p", null, pick(card, "back")));

      inner.appendChild(front);
      inner.appendChild(back);
      flip.appendChild(inner);
      flip.addEventListener("click", function () {
        flip.classList.toggle("flipped");
        flip.setAttribute("aria-pressed", flip.classList.contains("flipped") ? "true" : "false");
      });
      grid.appendChild(flip);
    });
    parts.body.appendChild(grid);

    host._ixRefresh = function () {
      Array.prototype.forEach.call(grid.querySelectorAll(".ix-flip-hint"), function (hint) {
        if (hint.dataset.custom !== "1") hint.textContent = t("flipHint");
      });
    };
    return { el: host };
  }

  /* ── 7. Race / comparison bars ──────────────────────────────── */

  function race(mount, cfg) {
    var host = resolve(mount);
    if (!host) return null;
    cfg = cfg || {};
    var rows = cfg.rows || [];
    if (!rows.length) return null;

    var parts = shell(host, cfg);
    host.appendChild(parts.body);

    var list = el("div", "ix-race");
    parts.body.appendChild(list);

    var fills = [];
    var values = [];

    rows.forEach(function (row) {
      var wrap = el("div", "ix-race-row");
      wrap.appendChild(el("span", "ix-race-name", pick(row, "name")));
      var track = el("div", "ix-race-track");
      var f = el("div", "ix-race-fill");
      track.appendChild(f);
      wrap.appendChild(track);
      var val = el("span", "ix-race-val", row.display != null ? row.display : "");
      wrap.appendChild(val);
      list.appendChild(wrap);
      fills.push(f);
      values.push(Number(row.value) || 0);
    });

    function apply(vals) {
      var max = Math.max.apply(
        Math,
        vals.concat([cfg.max == null ? 0 : cfg.max])
      );
      if (!max) max = 1;
      var leader = vals.indexOf(Math.max.apply(Math, vals));
      vals.forEach(function (v, i) {
        fills[i].style.width = Math.max(0, Math.min(100, (v / max) * 100)) + "%";
        fills[i].parentNode.parentNode.classList.toggle("leader", i === leader);
      });
    }

    window.requestAnimationFrame(function () {
      apply(values);
    });

    host._ixRefresh = function () {
      apply(values);
    };

    return {
      el: host,
      set: function (vals) {
        values = vals.slice();
        apply(values);
      },
    };
  }

  /* ── 8. Pipeline ────────────────────────────────────────────── */

  function pipeline(mount, cfg) {
    var host = resolve(mount);
    if (!host) return null;
    cfg = cfg || {};
    var nodes = cfg.nodes || [];
    if (!nodes.length) return null;

    var parts = shell(host, cfg);
    host.appendChild(parts.body);

    var pipe = el("div", "ix-pipe");
    var nodeEls = nodes.map(function (n) {
      var node = el("div", "ix-pipe-node");
      node.appendChild(document.createTextNode(pick(n, "label")));
      if (n.note) node.appendChild(el("small", null, pick(n, "note")));
      pipe.appendChild(node);
      return node;
    });
    var spark = el("span", "ix-pipe-spark");
    pipe.appendChild(spark);
    parts.body.appendChild(pipe);

    var caption = el("div", "ix-caption");
    parts.body.appendChild(caption);

    var transport = el("div", "ix-transport");
    var btnPrev = el("button", "ix-btn", "\u25C0");
    var btnPlay = el("button", "ix-btn ix-primary", t("play"));
    var btnNext = el("button", "ix-btn", "\u25B6");
    var btnReset = el("button", "ix-btn", t("reset"));
    transport.appendChild(btnPrev);
    transport.appendChild(btnPlay);
    transport.appendChild(btnNext);
    transport.appendChild(btnReset);
    parts.body.appendChild(transport);

    var index = -1;
    var timer = null;

    function syncUi() {
      nodeEls.forEach(function (n, i) {
        n.classList.toggle("live", i === index);
        n.classList.toggle("done", i < index);
      });
      var n = nodes[index];
      caption.innerHTML = "";
      if (n) {
        if (n.label) caption.appendChild(el("strong", null, pick(n, "label")));
        if (n.note) {
          if (n.label) caption.appendChild(document.createTextNode(" \u2014 "));
          caption.appendChild(document.createTextNode(pick(n, "note")));
        }
      }
      btnPrev.disabled = index <= 0;
      btnNext.disabled = index >= nodes.length - 1;
    }

    function flow() {
      if (REDUCED) return;
      spark.classList.remove("run");
      void spark.offsetWidth;
      spark.classList.add("run");
    }

    function go(i) {
      index = Math.max(0, Math.min(nodes.length - 1, i));
      syncUi();
      flow();
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      btnPlay.textContent = t("play");
    }

    function play() {
      if (timer || REDUCED) return;
      btnPlay.textContent = t("pause");
      if (index < 0) go(0);
      timer = window.setInterval(function () {
        if (index >= nodes.length - 1) {
          stop();
          return;
        }
        go(index + 1);
      }, cfg.intervalMs || 1700);
    }

    btnPrev.addEventListener("click", function () {
      stop();
      go(index - 1);
    });
    btnNext.addEventListener("click", function () {
      stop();
      go(index + 1);
    });
    btnReset.addEventListener("click", function () {
      stop();
      index = -1;
      syncUi();
    });
    btnPlay.addEventListener("click", function () {
      if (timer) stop();
      else play();
    });

    syncUi();
    if (cfg.autoplay && !REDUCED) play();

    host._ixRefresh = function () {
      btnPlay.textContent = timer ? t("pause") : t("play");
      syncUi();
    };
    host._ixTeardown = stop;
    return { go: go, play: play, pause: stop, el: host };
  }

  /* ── Declarative mounting ───────────────────────────────────── */

  var TYPES = {
    stepper: stepper,
    sequence: sequence,
    matcher: matcher,
    timeline: timeline,
    hotspot: hotspot,
    deck: deck,
    race: race,
    pipeline: pipeline,
  };

  function readConfig(node) {
    var src = node.getAttribute("data-ix-src");
    var holder = src ? document.querySelector(src) : node.nextElementSibling;
    if (!holder) return null;
    var text = holder.tagName === "SCRIPT" ? holder.textContent : holder.getAttribute("data-ix-json");
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      if (window.console) window.console.warn("[interactive] bad config for", node, e.message);
      return null;
    }
  }

  /**
   * Tear a widget down so the same element can be mounted again.
   *
   * Widgets are intentionally idempotent — `mount()` skips an element that
   * already carries `data-ix-mounted`. That is the right default, but a page
   * that swaps its content on `langchange` needs to rebuild the widget so its
   * built-in chrome (Play/Pause, Reset, the gate labels) re-renders in the new
   * language. Calling this from page code avoids reaching into the library's
   * internal marker attributes.
   *
   * Returns true when something was actually destroyed.
   */
  function destroy(mount2) {
    var host = resolve(mount2);
    if (!host) return false;
    if (typeof host._ixTeardown === "function") {
      try {
        host._ixTeardown();
      } catch (e) {
        /* teardown must never throw into page code */
      }
    }
    host._ixTeardown = null;
    host._ixRefresh = null;
    delete host.dataset.ixMounted;
    delete host.dataset.ixBound;
    delete host.dataset.ixEnhanced;
    clear(host);
    host.classList.remove("ix");
    return true;
  }

  function mount(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-ix]");
    Array.prototype.forEach.call(nodes, function (node) {
      if (node.dataset.ixMounted === "1") return;
      var type = node.getAttribute("data-ix");
      var fn = TYPES[type];
      if (!fn) return;
      var cfg = readConfig(node);
      if (!cfg) return;
      node.dataset.ixMounted = "1";
      fn(node, cfg);
    });
  }

  function refreshAll() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-ix]"), function (node) {
      if (typeof node._ixRefresh === "function") node._ixRefresh();
    });
  }

  function boot() {
    mount(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Chapter pages inject content (and swap languages) after first paint.
  document.addEventListener("langchange", refreshAll);
  window.addEventListener("langchange", refreshAll);

  window.Interactive = {
    stepper: stepper,
    sequence: sequence,
    matcher: matcher,
    timeline: timeline,
    hotspot: hotspot,
    deck: deck,
    race: race,
    pipeline: pipeline,
    mount: mount,
    destroy: destroy,
    refresh: refreshAll,
    labels: LABELS,
    reducedMotion: REDUCED,
    makeCtxKit: makeCtxKit,
  };
})();
