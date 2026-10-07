(function () {
  "use strict";

  /* INFO5995 — Week 8 (Software and System Security) page behaviour.
   *
   * The declarative widgets (timeline, sequence, race, matcher, pipeline,
   * hotspot, deck) are mounted by shared/interactive.js from the JSON config
   * blocks embedded in chapter8-study.html. This file owns the three animated
   * canvas steppers that need real drawing code, plus the re-binding that a
   * language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initInjectionStepper();
    initXssStepper();
    initDetectionStepper();
    initChrome();
    lastChromeLang = currentLang();
  });

  /* The language toggle replaces whole section innerHTML, so every stepper host
   * and every quick-check inside a translated section is a brand-new node.
   * Re-mount the steppers and re-run the chrome bindings; the sidebar toggle
   * lives outside any section, so its old listener is dropped first to avoid
   * double-binding. */
  window.addEventListener("langchange", function () {
    if (window.Interactive && window.Interactive.mount) {
      window.Interactive.mount(document);
    }
    initInjectionStepper();
    initXssStepper();
    initDetectionStepper();
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
        window.console.error("[INFO5995 chapter 8] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Canvas helpers shared by the three steppers ─────────────── */

  /* A rounded box with a centred caption. */
  function chip(k, x, y, w, h, text, opts) {
    opts = opts || {};
    k.box(x, y, w, h, {
      fill: opts.fill || "#ffffff",
      stroke: opts.stroke || "#94a3b8",
      lw: opts.lw || 1.4,
      r: opts.r == null ? 8 : opts.r
    });
    k.label(x + w / 2, y + h / 2, text, {
      align: "center",
      size: opts.size || 11.5,
      mono: opts.mono,
      color: opts.color || "#334155",
      weight: opts.weight
    });
  }

  /* A sentence made of token boxes, scaled down to fit the available width.
   * Returns the end x and every box it drew, so a frame can highlight a token. */
  function tokenRow(k, x, y, w, items, opts) {
    opts = opts || {};
    var gap = opts.gap == null ? 6 : opts.gap;
    var h = opts.h || 32;
    var base = opts.size || 12.5;
    var i;
    var total = 0;

    for (i = 0; i < items.length; i++) {
      var s0 = items[i].size || base;
      total += 16 + String(items[i].text).length * s0 * 0.62 + gap;
    }
    total -= gap;

    var avail = Math.max(120, w - x - 24);
    var scale = total > avail ? avail / total : 1;
    var boxes = [];
    var cx = x;

    for (i = 0; i < items.length; i++) {
      var it = items[i];
      var size = (it.size || base) * scale;
      var tw = 16 * scale + String(it.text).length * size * 0.62;
      var th = h * scale;
      k.box(cx, y, tw, th, {
        fill: it.fill || "#ffffff",
        stroke: it.stroke || "#94a3b8",
        lw: 1.4,
        r: 7
      });
      k.label(cx + tw / 2, y + th / 2, it.text, {
        align: "center",
        size: size,
        mono: true,
        color: it.color || "#334155"
      });
      boxes.push({ x: cx, w: tw, h: th, item: it });
      cx += tw + gap;
    }

    return { end: cx, boxes: boxes, scale: scale };
  }

  /* Three labelled columns with arrows between them. */
  function threeColumns(k, w, y, h, labels, arrows) {
    var bw = Math.min(180, (w - 96) / 3);
    var xs = [24, (w - bw) / 2, w - 24 - bw];
    var i;

    for (i = 0; i < 3; i++) {
      chip(k, xs[i], y, bw, h, labels[i].title, {
        fill: labels[i].fill || "#ffffff",
        stroke: labels[i].stroke || "#94a3b8",
        color: labels[i].color || "#334155",
        size: 12,
        weight: "700"
      });
      if (labels[i].sub) {
        k.label(xs[i] + bw / 2, y + h + 16, labels[i].sub, {
          align: "center",
          size: 10.5,
          color: "#565d75"
        });
      }
    }

    for (i = 0; i < arrows.length; i++) {
      var a = arrows[i];
      k.arrow(xs[a.from] + bw, y + h / 2, xs[a.to], y + h / 2, {
        color: a.color || "#94a3b8",
        lw: 1.8,
        dash: a.dash
      });
      if (a.label) {
        k.label((xs[a.from] + bw + xs[a.to]) / 2, y + h / 2 - 14, a.label, {
          align: "center",
          size: 10.5,
          color: a.color || "#565d75"
        });
      }
    }

    return { xs: xs, bw: bw };
  }

  /* ── Stepper 1: how input becomes SQL syntax ─────────────────── */

  function initInjectionStepper() {
    var host = document.getElementById("ix-injection");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-injection", {
      title: "One statement, two outcomes",
      subtitle: "The difference between concatenation and parameter binding, drawn as the statement's structure.",
      height: 300,
      frames: [
        {
          title: "1 — The statement is a template",
          caption: "The application writes the SQL grammar first. The only variable part is the placeholder: a data slot, not a piece of syntax.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "STEP 1 — the statement the code builds", {
              size: 12,
              mono: true,
              color: "#047857"
            });
            k.label(24, 46, "Structure is decided here, before any user data exists.", {
              size: 11,
              color: "#565d75"
            });

            var row = tokenRow(k, 24, 64, w, [
              { text: "SELECT * FROM users" },
              { text: "WHERE username =" },
              { text: "?", fill: "#e6f6f0", stroke: "#059669", color: "#047857" }
            ], { h: 34 });

            k.highlight(row.boxes[2].x - 4, 60, row.boxes[2].w + 8, 42, {});
            k.label(row.boxes[2].x + row.boxes[2].w / 2, 122, "the data slot", {
              align: "center",
              size: 10.5,
              color: "#047857"
            });

            chip(k, 24, 152, Math.min(w - 48, 300), 46, "value supplied at run time", {
              fill: "#eef4ff",
              stroke: "#2563eb",
              color: "#1d4ed8",
              size: 11.5
            });
            k.arrow(24 + Math.min(w - 48, 300) / 2, 150, row.boxes[2].x + row.boxes[2].w / 2, 102, {
              color: "#2563eb",
              lw: 1.6,
              dash: [5, 4]
            });
            k.label(24, 226, "The value never appears inside the SQL text — it travels beside it.", {
              size: 11.5,
              color: "#334155"
            });
            k.label(24, 248, "That separation is the whole defence; the rest of this animation shows what removes it.", {
              size: 11.5,
              color: "#565d75"
            });
          }
        },
        {
          title: "2 — A normal value is bound into the slot",
          caption: "The database receives a constant statement plus one value. The value is used as data, so it can only ever match or not match a row.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "STEP 2 — normal input", { size: 12, mono: true, color: "#047857" });
            k.label(24, 46, "The user types a username. Nothing about the statement changes.", {
              size: 11,
              color: "#565d75"
            });

            var row = tokenRow(k, 24, 64, w, [
              { text: "SELECT * FROM users" },
              { text: "WHERE username =" },
              { text: "?", fill: "#e6f6f0", stroke: "#059669", color: "#047857" }
            ], { h: 34 });

            var slot = row.boxes[2];
            chip(k, 24, 130, 150, 40, "value: alice", {
              fill: "#eef4ff",
              stroke: "#2563eb",
              color: "#1d4ed8",
              size: 11.5,
              mono: true
            });
            k.arrow(174, 150, slot.x - 6, 88, { color: "#2563eb", lw: 1.6, dash: [5, 4] });
            k.label(200, 138, "bound as a parameter", { size: 11, color: "#1d4ed8" });

            chip(k, w - 24 - 210, 130, 210, 40, "result: one matching row", {
              fill: "#e6f6f0",
              stroke: "#059669",
              color: "#047857",
              size: 11.5
            });

            k.label(24, 208, "The statement text the database parsed is identical to step 1.", {
              size: 11.5,
              color: "#334155"
            });
            k.label(24, 230, "Only the bound value differed — which is exactly what data is for.", {
              size: 11.5,
              color: "#565d75"
            });
          }
        },
        {
          title: "3 — Concatenation lets the value become syntax",
          caption: "If the application pastes the value into the statement text, the value can close the literal and add grammar of its own. The attacker did not change the database — they changed the statement.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "STEP 3 — string concatenation", { size: 12, mono: true, color: "#dc2626" });
            k.label(24, 46, "The value is merged into the command, so it is parsed as part of the command.", {
              size: 11,
              color: "#565d75"
            });

            var row = tokenRow(k, 24, 64, w, [
              { text: "SELECT * FROM users WHERE username =" },
              { text: "'alice'", fill: "#eef4ff", stroke: "#2563eb", color: "#1d4ed8" },
              { text: "OR", fill: "#fee2e2", stroke: "#dc2626", color: "#b91c1c" },
              { text: "a condition that is always true", fill: "#fee2e2", stroke: "#dc2626", color: "#b91c1c" }
            ], { h: 34, size: 12 });

            var first = row.boxes[2];
            var last = row.boxes[3];
            k.highlight(first.x - 4, 60, last.x + last.w - first.x + 8, 42, {
              color: "#dc2626"
            });
            k.label(24, 122, "input became grammar", { size: 11.5, color: "#b91c1c" });

            chip(k, 24, 148, Math.min(w - 48, 340), 42, "the WHERE clause is now true for every row", {
              fill: "#fee2e2",
              stroke: "#dc2626",
              color: "#b91c1c",
              size: 11.5
            });
            chip(k, 24, 200, Math.min(w - 48, 340), 42, "result: rows the caller was never entitled to", {
              fill: "#ffffff",
              stroke: "#94a3b8",
              color: "#334155",
              size: 11.5
            });

            k.label(24, 264, "Validation would have to catch this particular encoding — and every other route to the same query builder.", {
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "4 — Binding keeps the structure fixed",
          caption: "With a prepared statement the SQL text is final before the value arrives. A hostile value stays a value: it can match nothing, or it can match exactly one row, and it can never add SQL.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "STEP 4 — prepared statement, bound parameter", {
              size: 12,
              mono: true,
              color: "#047857"
            });
            k.label(24, 46, "The statement is a constant. Only the parameter varies, and parameters carry data, never structure.", {
              size: 11,
              color: "#565d75"
            });

            var row = tokenRow(k, 24, 64, w, [
              { text: "SELECT * FROM users" },
              { text: "WHERE username =" },
              { text: "?", fill: "#e6f6f0", stroke: "#059669", color: "#047857" }
            ], { h: 34 });

            k.highlight(row.boxes[2].x - 4, 60, row.boxes[2].w + 8, 42, {});

            chip(k, 24, 130, Math.min(w - 48, 300), 46, "value: alice' OR <always true>", {
              fill: "#eef4ff",
              stroke: "#2563eb",
              color: "#1d4ed8",
              size: 11,
              mono: true
            });
            k.label(24, 192, "transferred as data — the database never parses it as SQL", {
              size: 11,
              color: "#1d4ed8"
            });
            k.arrow(Math.min(w - 48, 300) / 2 + 24, 128, row.boxes[2].x + row.boxes[2].w / 2, 102, {
              color: "#2563eb",
              lw: 1.6,
              dash: [5, 4]
            });

            chip(k, w - 24 - 230, 130, 230, 46, "result: one row or none", {
              fill: "#e6f6f0",
              stroke: "#059669",
              color: "#047857",
              size: 11.5
            });

            k.label(24, 226, "Same hostile input as step 3 — no effect on the grammar.", {
              size: 11.5,
              color: "#334155"
            });
            k.label(24, 248, "The injection class is removed, not filtered.", { size: 11.5, color: "#565d75" });
          }
        },
        {
          title: "5 — The layers around the structural fix",
          caption: "Binding removes the class. The other controls limit what any surviving defect can reach — and logging is what tells you the fix is being tested.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "STEP 5 — defence in depth", { size: 12, mono: true, color: "#047857" });
            k.label(24, 46, "Only the first item is structural; the rest are the deck's supporting controls.", {
              size: 11,
              color: "#565d75"
            });

            var items = [
              { label: "Prepared statements", note: "removes the class" },
              { label: "Input validation", note: "constrains the field" },
              { label: "Least privilege", note: "limits the blast radius" },
              { label: "Safe ORM query APIs", note: "used correctly, no raw fragments" },
              { label: "Logging and monitoring", note: "shows the fix is being tested" }
            ];

            var bw = (w - 48 - 4 * 10) / 5;
            for (var i = 0; i < items.length; i++) {
              var x = 24 + i * (bw + 10);
              chip(k, x, 80, bw, 74, items[i].label, {
                fill: i === 0 ? "#e6f6f0" : "#ffffff",
                stroke: i === 0 ? "#059669" : "#94a3b8",
                color: i === 0 ? "#047857" : "#334155",
                size: 11
              });
              k.label(x + bw / 2, 168, items[i].note, {
                align: "center",
                size: 9.5,
                color: "#565d75"
              });
            }

            k.highlight(20, 76, bw + 8, 82, {});
            k.label(24, 206, "Structure fixed, values bound, privileges minimal, and every query logged.", {
              size: 11.5,
              color: "#334155"
            });
            k.label(24, 228, "The same rule covers XSS one interpreter later: keep data out of the grammar.", {
              size: 11.5,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: cross-site scripting and whose trust is abused ─ */

  function initXssStepper() {
    var host = document.getElementById("ix-xss");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-xss", {
      title: "Cross-site scripting: whose trust is abused?",
      subtitle: "The deck's three-step flow, then the two things a defender controls.",
      height: 290,
      frames: [
        {
          title: "1 — The site delivers attacker-controlled content",
          caption: "The attacker does not need an account on the victim's machine. They only need a field the site stores or reflects.",
          draw: function (ctx, w, h, k) {
            k.clear();
            threeColumns(k, w, 74, 56, [
              { title: "Attacker", fill: "#fee2e2", stroke: "#dc2626", color: "#b91c1c" },
              { title: "Vulnerable site", fill: "#eef4ff", stroke: "#2563eb", color: "#1d4ed8" },
              { title: "Victim's browser", fill: "#e6f6f0", stroke: "#059669", color: "#047857" }
            ], [
              { from: 0, to: 1, label: "injects content" },
              { from: 1, to: 2, label: "page + script" }
            ]);

            k.label(24, 176, "The site stores the content (stored XSS) or copies it from the request", {
              size: 11,
              color: "#334155"
            });
            k.label(24, 196, "straight into the response (reflected XSS). Either way, the browser", {
              size: 11,
              color: "#334155"
            });
            k.label(24, 216, "receives it as part of a page it has every reason to trust.", {
              size: 11,
              color: "#334155"
            });
            k.label(24, 248, "The vulnerability is in the application, not in the browser.", {
              size: 11.5,
              color: "#565d75"
            });
          }
        },
        {
          title: "2 — The code runs in the site's origin",
          caption: "The browser trusts the website, not the attacker. If the website serves malicious code, the browser executes it anyway — with the site's cookies, storage and permissions.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cols = threeColumns(k, w, 96, 56, [
              { title: "Attacker", fill: "#ffffff", stroke: "#cbd5e1", color: "#565d75" },
              { title: "Vulnerable site", fill: "#eef4ff", stroke: "#2563eb", color: "#1d4ed8" },
              { title: "Victim's browser", fill: "#e6f6f0", stroke: "#059669", color: "#047857" }
            ], [{ from: 1, to: 2, label: "page + script" }]);

            var x0 = cols.xs[2] - 18;
            var x1 = w - 12;
            k.box(x0, 44, x1 - x0, 150, {
              fill: "rgba(5,150,105,0.06)",
              stroke: "#059669",
              lw: 1.6,
              r: 12
            });
            k.label((x0 + x1) / 2, 60, "origin: the site's security context", {
              align: "center",
              size: 10.5,
              mono: true,
              color: "#047857"
            });
            k.label((x0 + x1) / 2, 214, "the script runs with the victim's session", {
              align: "center",
              size: 11,
              color: "#047857"
            });

            k.label(24, 226, "No browser is hacked here: the application handed over code and", {
              size: 11,
              color: "#334155"
            });
            k.label(24, 246, "the browser treated it exactly as the site's own.", { size: 11, color: "#334155" });
          }
        },
        {
          title: "3 — What the attacker gets",
          caption: "Four consequences from the deck. All of them are possible because the code executes as the site, not as the attacker.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "Why XSS is dangerous", { size: 12, mono: true, color: "#047857" });

            var items = [
              ["Session theft", "steal tokens, impersonate the user"],
              ["Unauthorised actions", "submit requests as the victim"],
              ["Phishing", "replace trusted content with deceptive UI"],
              ["Data exfiltration", "read and transmit accessible page data"]
            ];
            var bw = (w - 48 - 12) / 2;
            for (var i = 0; i < items.length; i++) {
              var x = 24 + (i % 2) * (bw + 12);
              var y = 52 + Math.floor(i / 2) * 80;
              chip(k, x, y, bw, 44, items[i][0], {
                fill: "#ffffff",
                stroke: "#94a3b8",
                color: "#334155",
                size: 11.5,
                weight: "700"
              });
              k.label(x + bw / 2, y + 62, items[i][1], {
                align: "center",
                size: 10.5,
                color: "#565d75"
              });
            }

            k.label(24, 226, "Each of these is an ordinary action in the site's own origin.", {
              size: 11.5,
              color: "#334155"
            });
            k.label(24, 248, "That is why XSS is an application defect with a user-facing consequence.", {
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "4 — Four controls, in the deck's order",
          caption: "Validate input, encode output, keep data separate from code. The first control is structural; the others reduce what slips through.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "Preventing XSS", { size: 12, mono: true, color: "#047857" });
            k.label(24, 46, "Encoding is context-sensitive: HTML body, attribute, URL and script are different grammars.", {
              size: 11,
              color: "#565d75"
            });

            var items = [
              ["1. Encode output", "convert < > & quotes to safe equivalents"],
              ["2. Sanitise allowed HTML", "proven library, strict allowlist"],
              ["3. Safe frameworks", "auto-escaping templates, no unsafe DOM APIs"],
              ["4. Browser safeguards", "Content Security Policy as an extra layer"]
            ];
            var bw = (w - 48 - 30) / 4;
            for (var i = 0; i < items.length; i++) {
              var x = 24 + i * (bw + 10);
              chip(k, x, 84, bw, 66, items[i][0], {
                fill: i === 0 ? "#e6f6f0" : "#ffffff",
                stroke: i === 0 ? "#059669" : "#94a3b8",
                color: i === 0 ? "#047857" : "#334155",
                size: 11
              });
              k.label(x + bw / 2, 168, items[i][1], { align: "center", size: 9.5, color: "#565d75" });
            }

            k.highlight(20, 80, bw + 8, 74, {});
            k.label(24, 214, "Validate input. Encode output. Keep data separate from code.", {
              size: 12,
              weight: "700",
              color: "#047857"
            });
            k.label(24, 238, "The same sentence explained SQL injection, one interpreter earlier.", {
              size: 11,
              color: "#565d75"
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 3: brute force, IDS and IPS ─────────────────────── */

  function initDetectionStepper() {
    var host = document.getElementById("ix-detect");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-detect", {
      title: "Brute force: what changes when the control is inline?",
      subtitle: "The deck's scenario — thousands of password guesses against one web application.",
      height: 320,
      frames: [
        {
          title: "1 — Thousands of attempts",
          caption: "Repeated login attempts target the same application, or many accounts at once when credentials have been leaked elsewhere.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "The attack", { size: 12, mono: true, color: "#b91c1c" });

            chip(k, 24, 92, 150, 56, "Attacker", {
              fill: "#fee2e2",
              stroke: "#dc2626",
              color: "#b91c1c",
              size: 12,
              weight: "700"
            });
            var serverX = w - 24 - Math.min(210, w * 0.34);
            chip(k, serverX, 76, Math.min(210, w * 0.34), 72, "Web server", {
              fill: "#eef4ff",
              stroke: "#2563eb",
              color: "#1d4ed8",
              size: 12,
              weight: "700"
            });
            k.label(serverX + Math.min(210, w * 0.34) / 2, 162, "login endpoint", {
              align: "center",
              size: 10.5,
              color: "#565d75"
            });

            for (var i = 0; i < 4; i++) {
              var y = 92 + i * 14;
              k.arrow(180, y, serverX - 6, y, {
                color: "rgba(220,38,38,0.75)",
                lw: 1.6,
                dash: i === 3 ? [5, 4] : null
              });
            }
            k.label((180 + serverX) / 2, 70, "1,000s of attempts", {
              align: "center",
              size: 11,
              color: "#b91c1c"
            });

            k.label(24, 216, "What is at stake: one correct guess is an account takeover, and the", {
              size: 11,
              color: "#334155"
            });
            k.label(24, 236, "attempts are cheap because they are automated.", { size: 11, color: "#334155" });
            k.label(24, 262, "Discuss: would an IDS alone stop this attack?", { size: 11.5, color: "#565d75" });
          }
        },
        {
          title: "2 — IDS: detect and alert",
          caption: "On a monitoring path the IDS sees the failures and raises an alert. It is passive by design: it does not automatically stop the attack, so the attempts keep arriving.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "IDS — security camera", { size: 12, mono: true, color: "#1d4ed8" });

            chip(k, 24, 70, 130, 50, "Attacker", {
              fill: "#fee2e2",
              stroke: "#dc2626",
              color: "#b91c1c",
              size: 11.5
            });
            var serverX = w - 24 - Math.min(190, w * 0.3);
            chip(k, serverX, 70, Math.min(190, w * 0.3), 50, "Web server", {
              fill: "#eef4ff",
              stroke: "#2563eb",
              color: "#1d4ed8",
              size: 11.5
            });

            for (var i = 0; i < 3; i++) {
              var y = 84 + i * 14;
              k.arrow(158, y, serverX - 6, y, { color: "rgba(220,38,38,0.8)", lw: 1.6 });
            }

            var idsW = Math.min(180, w - 48);
            var idsX = w / 2 - idsW / 2;
            chip(k, idsX, 158, idsW, 46, "IDS", {
              fill: "#eef4ff",
              stroke: "#2563eb",
              color: "#1d4ed8",
              size: 12,
              weight: "700"
            });
            k.label(idsX + idsW + 12, 181, "monitoring path, not inline", {
              size: 10.5,
              color: "#565d75"
            });
            k.arrow(w / 2, 132, w / 2, 156, {
              color: "#2563eb",
              lw: 1.5,
              dash: [5, 4]
            });

            chip(k, w / 2 - 100, 232, 200, 42, "Security team is alerted", {
              fill: "#ffffff",
              stroke: "#f59e0b",
              color: "#b45309",
              size: 11.5
            });
            k.arrow(w / 2, 206, w / 2, 230, { color: "#f59e0b", lw: 1.6 });

            k.label(24, 296, "Detects and alerts. The attack continues while the team reads the alert.", {
              size: 11,
              color: "#334155"
            });
          }
        },
        {
          title: "3 — IPS: inspect, decide, act",
          caption: "Inline, the IPS can drop packets, reset connections and block sources in real time. The trade-off is that it is in the path: a false positive becomes an outage, so rules must be tuned.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "IPS — security guard", { size: 12, mono: true, color: "#047857" });

            chip(k, 24, 84, 120, 50, "Attacker", {
              fill: "#fee2e2",
              stroke: "#dc2626",
              color: "#b91c1c",
              size: 11.5
            });
            var ipsX = w / 2 - 70;
            chip(k, ipsX, 84, 140, 50, "IPS", {
              fill: "#e6f6f0",
              stroke: "#059669",
              color: "#047857",
              size: 12,
              weight: "700"
            });
            var serverX = w - 24 - Math.min(170, w * 0.26);
            chip(k, serverX, 84, Math.min(170, w * 0.26), 50, "Protected system", {
              fill: "#eef4ff",
              stroke: "#2563eb",
              color: "#1d4ed8",
              size: 11
            });

            k.arrow(144, 100, ipsX - 6, 100, { color: "rgba(220,38,38,0.85)", lw: 1.7 });
            k.arrow(ipsX + 140, 130, serverX - 6, 130, { color: "#94a3b8", lw: 1.5, dash: [5, 4] });

            k.label(ipsX + 70, 156, "inspect -> decide -> act", {
              align: "center",
              size: 10.5,
              mono: true,
              color: "#047857"
            });

            var acts = ["block source", "drop packets", "reset connections", "quarantine host"];
            var bw = (w - 48 - 30) / 4;
            for (var i = 0; i < acts.length; i++) {
              chip(k, 24 + i * (bw + 10), 190, bw, 42, acts[i], {
                fill: "#ffffff",
                stroke: "#059669",
                color: "#047857",
                size: 10.5
              });
            }

            k.label(24, 262, "Active response — and the reason an inline control needs tuning before it needs trust.", {
              size: 11,
              color: "#565d75"
            });
          }
        },
        {
          title: "4 — Prevention on the authentication path",
          caption: "An IPS blocks what it recognises. Raising the cost of guessing is what protects the accounts when the sources rotate or the pattern is new.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(24, 22, "Defence in depth on the login path", { size: 12, mono: true, color: "#047857" });

            var items = [
              ["Rate limiting", "per account, source and subnet"],
              ["Lockout with backoff", "not a permanent lock that blocks the owner"],
              ["MFA", "a correct guess is not sufficient"],
              ["Breached-credential checks", "reject passwords already exposed"]
            ];
            var bw = (w - 48 - 30) / 4;
            for (var i = 0; i < items.length; i++) {
              var x = 24 + i * (bw + 10);
              chip(k, x, 60, bw, 74, items[i][0], {
                fill: i === 2 ? "#e6f6f0" : "#ffffff",
                stroke: i === 2 ? "#059669" : "#94a3b8",
                color: i === 2 ? "#047857" : "#334155",
                size: 11
              });
              k.label(x + bw / 2, 148, items[i][1], { align: "center", size: 9.5, color: "#565d75" });
            }

            k.label(24, 192, "Detection still matters: failed-login rate, distinct accounts per source,", {
              size: 11,
              color: "#334155"
            });
            k.label(24, 212, "and a success immediately after a burst of failures.", {
              size: 11,
              color: "#334155"
            });
            k.label(24, 244, "Where should the next control go to reduce risk most effectively?", {
              size: 11.5,
              color: "#047857"
            });
          }
        }
      ]
    });
  }
})();
