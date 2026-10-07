(function () {
  "use strict";

  /* COMP5618 — Week 5 page behaviour.
   *
   * The declarative widgets (pipeline, sequence, matcher, timeline, hotspot,
   * race, deck) are mounted by shared/interactive.js from the JSON config
   * blocks in the page. This file owns the three animated canvas steppers and
   * the re-binding that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initScanWalk();
    initProxyWalk();
    initAuthWalk();
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
    initScanWalk();
    initProxyWalk();
    initAuthWalk();
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
    if (!window.initCOMP5618ChapterUI) return;
    try {
      window.initCOMP5618ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[COMP5618 chapter 5] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared drawing helpers ─────────────────────────────────── */

  var INK = "#be123c"; /* accent: the scanner / attacker side   */
  var BLUE = "#2563eb"; /* the proxy and transport              */
  var GREEN = "#059669"; /* confirmed / authenticated           */
  var AMBER = "#f59e0b"; /* suspicion / evidence                */
  var SLATE = "#94a3b8"; /* neutral plumbing                    */
  var MUTED = "#565d75";
  var FAINT = "#7b829a";

  function chip(k, x, y, w, h, text, opts) {
    opts = opts || {};
    k.box(x, y, w, h, {
      fill: opts.fill || "#ffffff",
      stroke: opts.stroke || SLATE,
      lw: opts.lw || 1.6,
      r: opts.r == null ? 8 : opts.r
    });
    k.label(x + w / 2, y + h / 2, text, {
      align: "center",
      size: opts.size || 11.5,
      mono: opts.mono !== false,
      weight: opts.weight || "600",
      color: opts.color || "#141826"
    });
  }

  function column(k, x, y, w, h, title, lines, opts) {
    opts = opts || {};
    k.box(x, y, w, h, {
      fill: opts.fill || "#ffffff",
      stroke: opts.stroke || SLATE,
      lw: opts.lw || 1.8,
      r: 12
    });
    k.label(x + w / 2, y + 20, title, {
      align: "center",
      size: 12,
      mono: true,
      color: opts.color || INK
    });
    (lines || []).forEach(function (line, i) {
      k.label(x + w / 2, y + 42 + i * 16, line, {
        align: "center",
        size: 10.5,
        color: MUTED
      });
    });
  }

  function packet(k, x, y, label, opts) {
    opts = opts || {};
    k.dot(x, y, 9, { fill: opts.fill || AMBER, stroke: opts.stroke || "#ffffff", lw: 2 });
    if (label) {
      k.label(x, y - 18, label, {
        align: "center",
        size: 10,
        mono: true,
        color: opts.color || INK
      });
    }
  }

  function footer(k, w, h, text) {
    k.label(w / 2, h - 14, text, { align: "center", size: 10.5, color: FAINT });
  }

  /* ── Stepper 1: one scan cycle, frame by frame ──────────────── */

  function initScanWalk() {
    var host = document.getElementById("ix-scan-walk");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-scan-walk", {
      title: "One scan cycle, frame by frame",
      subtitle: "Crawl, probe, analyse, report — the same four stages for every scanner in the tutorial.",
      height: 280,
      frames: [
        {
          title: "1 · Crawl: map the surface",
          caption:
            "The crawler starts from a seed URL and follows links, forms and API routes, building the site model that every later stage depends on. A route the crawler never finds can never be probed.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x0 = 26;
            var l1 = w * 0.34;
            var l2 = w * 0.64;

            chip(k, x0, h / 2 - 20, 118, 40, "seed URL", {
              fill: "#fde8ee",
              stroke: INK,
              color: "#881337"
            });

            var pages = ["/", "/login", "/search?q="];
            var leaves = ["/api/items", "/admin", "form: id", "form: user", "link: /setup"];

            pages.forEach(function (p, i) {
              var y = 36 + i * 52;
              k.arrow(x0 + 118, h / 2, l1 - 6, y + 17, { color: SLATE, lw: 1.4, dash: [4, 4] });
              chip(k, l1, y, 132, 34, p, { fill: "#ffffff", stroke: BLUE, color: "#1e3a8a" });
            });

            leaves.forEach(function (p, i) {
              var y = 22 + i * 44;
              k.arrow(l1 + 132, 52 + (i % 3) * 52, l2 - 6, y + 14, {
                color: "rgba(148,163,184,0.7)",
                lw: 1.1,
                dash: [3, 5]
              });
              chip(k, l2, y, 128, 28, p, {
                fill: "#f8fafc",
                stroke: SLATE,
                color: MUTED,
                size: 10.5,
                lw: 1.2
              });
            });

            k.label(w - 16, h - 30, "site map: routes + parameters + forms", {
              align: "right",
              size: 10.5,
              mono: true,
              color: INK
            });
            footer(k, w, h, "Missing routes here become false negatives later — this is where coverage is won or lost.");
          }
        },
        {
          title: "2 · Model: turn pages into parameter slots",
          caption:
            "Each discovered request becomes a template. Method, path, query, headers, cookie and body are slots, and the prober will vary exactly one of them per request so that any change stays attributable.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = 30;
            var boxW = w - 60;
            k.box(x, 40, boxW, 150, { fill: "#ffffff", stroke: INK, lw: 1.8, r: 14 });
            k.label(x + 16, 62, "request template", { size: 12, mono: true, color: INK });

            var slots = ["method", "path", "query", "headers", "cookie", "body"];
            var sw = (boxW - 32 - 5 * 8) / 6;
            slots.forEach(function (s, i) {
              var sx = x + 16 + i * (sw + 8);
              chip(k, sx, 82, sw, 38, s, {
                fill: i === 2 ? "#fff7ed" : "#f8fafc",
                stroke: i === 2 ? AMBER : SLATE,
                color: i === 2 ? "#92400e" : MUTED,
                size: 10.5,
                lw: i === 2 ? 2 : 1.2
              });
            });
            k.highlight(x + 16 + 2 * (sw + 8) - 4, 78, sw + 8, 46, { color: AMBER, lw: 2, dash: [5, 4] });
            k.label(x + 16 + 2 * (sw + 8) + sw / 2, 138, "one slot per request", {
              align: "center",
              size: 10.5,
              mono: true,
              color: "#92400e"
            });

            k.label(x + 16, 172, "Baseline request is stored first: the same template with a benign value.", {
              size: 11,
              color: MUTED
            });
            footer(k, w, h, "Authenticated scans add the session cookie as a fixed slot rather than a varied one.");
          }
        },
        {
          title: "3 · Probe: baseline, then exactly one change",
          caption:
            "Fuzzing supplies invalid, unexpected or random data as input. The scanner keeps both exchanges: the benign baseline and the test request, with one slot modified.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var rows = [
              {
                y: 40,
                tag: "baseline",
                req: "id=1  (benign)",
                res: "200 OK · 4 812 B · 1 row",
                stroke: GREEN,
                fill: "#ecfdf5",
                resColor: "#065f46"
              },
              {
                y: 132,
                tag: "probe",
                req: "id=<test string>",
                res: "500 · 1 290 B · database error",
                stroke: AMBER,
                fill: "#fff7ed",
                resColor: "#92400e"
              }
            ];

            rows.forEach(function (r) {
              chip(k, 30, r.y, 108, 34, r.tag, {
                fill: r.fill,
                stroke: r.stroke,
                color: r.resColor,
                size: 11
              });
              chip(k, 150, r.y, Math.min(240, w * 0.34), 34, r.req, {
                fill: "#ffffff",
                stroke: SLATE,
                color: "#141826",
                size: 11
              });
              k.arrow(150 + Math.min(240, w * 0.34) + 6, r.y + 17, w * 0.62, r.y + 17, {
                color: SLATE,
                lw: 1.5
              });
              chip(k, w * 0.62 + 6, r.y, w - (w * 0.62 + 36), 34, r.res, {
                fill: r.fill,
                stroke: r.stroke,
                color: r.resColor,
                size: 10.5
              });
            });

            k.highlight(24, 126, w - 48, 46, { color: AMBER, lw: 2, dash: [6, 4] });
            k.label(30, 196, "safe tests: no destructive writes, no account lockouts, one variable at a time", {
              size: 10.5,
              mono: true,
              color: INK
            });
            footer(k, w, h, "Two stored responses are the whole point: without the baseline there is nothing to compare against.");
          }
        },
        {
          title: "4 · Analyse: match responses to risk indicators",
          caption:
            "The analyser diffs the probe against the baseline. One indicator is a hint; two independent indicators are a finding worth a human's time.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var rows = [
              ["status code", "200", "500", true],
              ["response length", "4 812 B", "1 290 B", true],
              ["response time", "42 ms", "1 905 ms", true],
              ["error signature", "none", "SQL syntax near", true],
              ["reflected marker", "absent", "absent", false]
            ];

            k.label(30, 32, "signal", { size: 10.5, mono: true, color: FAINT });
            k.label(w * 0.42, 32, "baseline", { size: 10.5, mono: true, color: FAINT, align: "center" });
            k.label(w * 0.62, 32, "probe", { size: 10.5, mono: true, color: FAINT, align: "center" });
            k.label(w - 30, 32, "indicator", { size: 10.5, mono: true, color: FAINT, align: "right" });

            rows.forEach(function (r, i) {
              var y = 56 + i * 32;
              k.box(24, y - 13, w - 48, 26, {
                fill: r[3] ? "rgba(245,158,11,0.10)" : "rgba(148,163,184,0.08)",
                stroke: "transparent",
                r: 6
              });
              k.label(32, y, r[0], { size: 11, mono: true, color: "#141826" });
              k.label(w * 0.42, y, r[1], { size: 11, mono: true, color: MUTED, align: "center" });
              k.label(w * 0.62, y, r[2], {
                size: 11,
                mono: true,
                color: r[3] ? "#92400e" : MUTED,
                align: "center"
              });
              k.label(w - 32, y, r[3] ? "match" : "no change", {
                size: 10.5,
                mono: true,
                color: r[3] ? AMBER : FAINT,
                align: "right"
              });
            });

            k.label(30, h - 34, "confidence = how many independent indicators agree", {
              size: 11,
              mono: true,
              color: INK
            });
            footer(k, w, h, "Signature matching cannot judge business logic, which is why every match is a candidate, not a verdict.");
          }
        },
        {
          title: "5 · Report: evidence, severity, owner",
          caption:
            "What leaves the scanner is a request/response pair with a severity estimate and a suggested fix. Scanner output still needs validation, ownership and remediation tracking.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(30, 26, w - 60, 148, { fill: "#ffffff", stroke: INK, lw: 1.8, r: 14 });
            k.label(46, 50, "FINDING · injection candidate on /search", {
              size: 12,
              mono: true,
              color: INK
            });
            k.label(46, 74, "evidence: baseline + probe pair, status 200 → 500, error signature", {
              size: 10.5,
              color: MUTED
            });
            k.label(46, 96, "severity: ", { size: 11, color: MUTED });
            k.bar(104, 88, Math.min(180, w * 0.28), 14, 9.8, { max: 10, fill: INK, track: "#f1d5dd" });
            k.label(296, 96, "9.8 · critical", { size: 10.5, mono: true, color: INK });

            k.label(46, 124, "owner: platform team   ·   remediation: parameterised queries", {
              size: 10.5,
              color: MUTED
            });
            k.label(46, 148, "next action: reproduce manually before anyone patches", {
              size: 10.5,
              mono: true,
              color: AMBER
            });

            k.box(30, 190, w - 60, 40, { fill: "#fdf7f9", stroke: INK, lw: 1.4, r: 10 });
            k.label(w / 2, 210, "validate → own → track → verify", {
              align: "center",
              size: 12,
              mono: true,
              color: INK
            });
            footer(k, w, h, "A report nobody validates, owns or retests is documentation, not a control.");
          }
        }
      ]
    });
  }

  /* ── Stepper 2: one request through an intercepting proxy ───── */

  function initProxyWalk() {
    var host = document.getElementById("ix-proxy-walk");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-proxy-walk", {
      title: "One request through an intercepting proxy",
      subtitle: "The tutorial's Burp Suite setup, drawn as a message walk between browser, proxy and lab server.",
      height: 250,
      frames: [
        {
          title: "1 · The browser sends the request",
          caption:
            "A logged-in lab session issues a GET for a protected page. The session cookie travels in the request header — that is what makes it authenticated.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cw = Math.min(150, w * 0.2);
            var bx = 24;
            var px = w / 2 - cw / 2;
            var sx = w - 24 - cw;
            var cy = 46;
            var ch = 96;

            column(k, bx, cy, cw, ch, "browser", ["lab session", "logged in"], {
              stroke: SLATE,
              color: MUTED
            });
            column(k, px, cy, cw, ch, "proxy", ["intercept", "site map"], { stroke: BLUE, color: "#1e3a8a" });
            column(k, sx, cy, cw, ch, "web server", ["DVWA app", "port 80"], { stroke: INK, color: INK });

            k.arrow(bx + cw, cy + ch / 2 - 10, sx, cy + ch / 2 - 10, { color: SLATE, lw: 1.6 });
            k.arrow(sx, cy + ch / 2 + 10, bx + cw, cy + ch / 2 + 10, { color: SLATE, lw: 1.6, dash: [4, 4] });
            packet(k, bx + cw + 22, cy + ch / 2 - 10, "GET + Cookie");

            k.label(24, cy + ch + 34, "GET /dvwa/vulnerabilities/brute/ HTTP/1.1", {
              size: 10.5,
              mono: true,
              color: "#141826"
            });
            k.label(24, cy + ch + 52, "Cookie: PHPSESSID=<lab session>; security=low", {
              size: 10.5,
              mono: true,
              color: MUTED
            });
            footer(k, w, h, "Nothing has been inspected yet: the request is in flight with the session attached.");
          }
        },
        {
          title: "2 · The proxy holds it",
          caption:
            "With interception on, the request pauses inside the proxy before it reaches the server. This is where a tester reads the parameters, the headers and the cookie.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cw = Math.min(150, w * 0.2);
            var bx = 24;
            var px = w / 2 - cw / 2;
            var sx = w - 24 - cw;
            var cy = 46;
            var ch = 96;

            column(k, bx, cy, cw, ch, "browser", ["waiting"], { stroke: SLATE, color: MUTED });
            column(k, px, cy, cw, ch, "proxy", ["HOLDING", "editable"], { stroke: BLUE, color: "#1e3a8a" });
            column(k, sx, cy, cw, ch, "web server", ["idle"], { stroke: SLATE, color: MUTED });

            k.arrow(bx + cw, cy + ch / 2 - 10, sx, cy + ch / 2 - 10, { color: "rgba(148,163,184,0.5)", lw: 1.4, dash: [4, 5] });
            packet(k, px + cw / 2, cy + ch / 2 + 32, "held");
            k.highlight(px - 6, cy - 6, cw + 12, ch + 12, { color: AMBER, lw: 2.2, dash: [6, 4] });

            k.label(24, cy + ch + 34, "read: method · path · query · headers · cookie · body", {
              size: 10.5,
              mono: true,
              color: "#141826"
            });
            k.label(24, cy + ch + 52, "edit: one value at a time, then forward", {
              size: 10.5,
              mono: true,
              color: AMBER
            });
            footer(k, w, h, "Interception is what turns a browser into a testing tool: you see the raw request before the app does.");
          }
        },
        {
          title: "3 · The edited request is forwarded",
          caption:
            "The tester changes one parameter and forwards it. The proxy recalculates the message length, so the server receives a well-formed request carrying the modified value.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cw = Math.min(150, w * 0.2);
            var bx = 24;
            var px = w / 2 - cw / 2;
            var sx = w - 24 - cw;
            var cy = 46;
            var ch = 96;

            column(k, bx, cy, cw, ch, "browser", ["waiting"], { stroke: SLATE, color: MUTED });
            column(k, px, cy, cw, ch, "proxy", ["forwarded", "after edit"], { stroke: BLUE, color: "#1e3a8a" });
            column(k, sx, cy, cw, ch, "web server", ["processing"], { stroke: INK, color: INK });

            k.arrow(bx + cw, cy + ch / 2 - 10, sx, cy + ch / 2 - 10, { color: "rgba(148,163,184,0.55)", lw: 1.4, dash: [4, 5] });
            k.arrow(px + cw, cy + ch / 2 - 10, sx, cy + ch / 2 - 10, { color: AMBER, lw: 2 });
            packet(k, px + cw + (sx - px - cw) * 0.55, cy + ch / 2 - 10, "modified value");

            k.label(24, cy + ch + 34, "Content-Length recalculated automatically", {
              size: 10.5,
              mono: true,
              color: "#141826"
            });
            k.label(24, cy + ch + 52, "one slot changed → any difference is attributable", {
              size: 10.5,
              mono: true,
              color: MUTED
            });
            footer(k, w, h, "This is the probe stage of a scanner, performed by hand before it is performed by a tool.");
          }
        },
        {
          title: "4 · The response comes back through the proxy",
          caption:
            "The server answers, and the response passes back the same way. Status code, length, timing and body are all recorded against the request that produced them.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var cw = Math.min(150, w * 0.2);
            var bx = 24;
            var px = w / 2 - cw / 2;
            var sx = w - 24 - cw;
            var cy = 46;
            var ch = 96;

            column(k, bx, cy, cw, ch, "browser", ["receiving"], { stroke: SLATE, color: MUTED });
            column(k, px, cy, cw, ch, "proxy", ["recording"], { stroke: BLUE, color: "#1e3a8a" });
            column(k, sx, cy, cw, ch, "web server", ["answered"], { stroke: GREEN, color: GREEN });

            k.arrow(px + cw, cy + ch / 2 + 32, bx + cw, cy + ch / 2 + 32, { color: GREEN, lw: 2 });
            packet(k, bx + cw + (px - bx - cw) * 0.45, cy + ch / 2 + 32, "200 OK", {
              fill: GREEN,
              color: GREEN
            });

            k.label(24, cy + ch + 34, "status 200 · the protected page is returned, not a redirect", {
              size: 10.5,
              mono: true,
              color: "#065f46"
            });
            k.label(24, cy + ch + 52, "a 302 to login.php instead would mean the session was not accepted", {
              size: 10.5,
              mono: true,
              color: MUTED
            });
            footer(k, w, h, "The redirect-versus-200 check is the cheapest way to prove an authenticated scan will work.");
          }
        },
        {
          title: "5 · The exchange becomes evidence",
          caption:
            "The pair is stored in the site map: endpoint, parameters, session state, response. Replaying it with the session cookie is how an automated scan repeats what the tester just did.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(24, 30, w * 0.44, 128, { fill: "#ffffff", stroke: BLUE, lw: 1.8, r: 12 });
            k.label(40, 54, "site map entry", { size: 12, mono: true, color: "#1e3a8a" });
            ["endpoint + method", "parameters and forms", "session used", "response fingerprint"].forEach(
              function (t, i) {
                k.label(40, 78 + i * 20, "· " + t, { size: 11, color: MUTED });
              }
            );

            k.box(w * 0.52, 30, w * 0.44, 128, { fill: "#fdf7f9", stroke: INK, lw: 1.8, r: 12 });
            k.label(w * 0.52 + 16, 54, "replay with the cookie", { size: 12, mono: true, color: INK });
            ["same endpoint, varied slot", "same session cookie", "baseline stored first", "diff recorded as evidence"].forEach(
              function (t, i) {
                k.label(w * 0.52 + 16, 78 + i * 20, "· " + t, { size: 11, color: MUTED });
              }
            );

            k.arrow(w * 0.44 + 30, 94, w * 0.52 - 6, 94, { color: INK, lw: 2 });
            footer(k, w, h, "Automation is the manual exchange, repeated at scale and with the baseline kept.");
          }
        }
      ]
    });
  }

  /* ── Stepper 3: authenticated scanning ──────────────────────── */

  function initAuthWalk() {
    var host = document.getElementById("ix-auth-walk");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-auth-walk", {
      title: "Authenticated scanning: before and after the cookie",
      subtitle: "The same crawler, the same application — the session cookie is the only difference.",
      height: 260,
      frames: [
        {
          title: "1 · Unauthenticated: the request is bounced",
          caption:
            "Without a valid cookie the application cannot authenticate the browser, so the protected request is answered with a redirect to the login page.",
          draw: function (ctx, w, h, k) {
            k.clear();
            chip(k, 30, 40, 120, 34, "scanner", { fill: "#fde8ee", stroke: INK, color: "#881337" });
            chip(k, 30, 84, 120, 34, "no cookie", {
              fill: "#ffffff",
              stroke: SLATE,
              color: MUTED,
              size: 11
            });
            k.arrow(156, 57, w * 0.56, 57, { color: SLATE, lw: 1.6 });
            packet(k, w * 0.42, 57, "GET /brute/", { fill: SLATE });
            chip(k, w * 0.58, 40, w * 0.36, 34, "302 Found → login.php", {
              fill: "#fff7ed",
              stroke: AMBER,
              color: "#92400e",
              size: 11
            });

            k.label(30, 146, "site model", { size: 10.5, mono: true, color: FAINT });
            k.bar(30, 160, w - 60, 16, 0.18, { max: 1, fill: SLATE, track: "#e8ecf3" });
            k.label(w - 30, 196, "coverage 18% — public routes only", {
              align: "right",
              size: 10.5,
              mono: true,
              color: MUTED
            });
            footer(k, w, h, "Every protected route looks identical from here: a redirect whose body is the login form.");
          }
        },
        {
          title: "2 · The cost of that redirect",
          caption:
            "The scanner learns nothing about the protected pages, so findings cluster on pre-authentication surfaces and the report is dominated by false negatives.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var routes = [
              "/vulnerabilities/brute/",
              "/vulnerabilities/sqli/",
              "/vulnerabilities/xss_r/",
              "/vulnerabilities/csrf/",
              "/security.php"
            ];
            k.label(30, 30, "protected routes", { size: 10.5, mono: true, color: FAINT });
            routes.forEach(function (r, i) {
              var y = 48 + i * 30;
              k.label(30, y, r, { size: 11, mono: true, color: "#141826" });
              chip(k, w * 0.6, y - 13, w * 0.34, 26, "302 → login", {
                fill: "#fff7ed",
                stroke: AMBER,
                color: "#92400e",
                size: 10,
                r: 6,
                lw: 1.2
              });
            });
            k.label(30, h - 44, "findings inside the protected area: 0 — not because it is clean, but because it was never tested", {
              size: 10.5,
              mono: true,
              color: INK
            });
            footer(k, w, h, "Absence of evidence is not evidence of absence; state coverage next to every result.");
          }
        },
        {
          title: "3 · Log in and copy the session cookie",
          caption:
            "The tester logs into the lab application through the proxy and copies the authentication cookie out of their own browser's cookie store. The credential stays out of the scanner configuration.",
          draw: function (ctx, w, h, k) {
            k.clear();
            chip(k, 30, 40, 140, 34, "POST /login.php", {
              fill: "#ffffff",
              stroke: SLATE,
              color: "#141826",
              size: 11
            });
            k.arrow(176, 57, w * 0.42, 57, { color: SLATE, lw: 1.6 });
            chip(k, w * 0.44, 34, w * 0.5, 46, "Set-Cookie: PHPSESSID=<value>", {
              fill: "#ecfdf5",
              stroke: GREEN,
              color: "#065f46",
              size: 10.5
            });
            k.label(30, 108, "the cookie is a credential — copy it, never commit it", {
              size: 10.5,
              mono: true,
              color: AMBER
            });

            k.box(30, 132, w - 60, 62, { fill: "#f8fafc", stroke: SLATE, lw: 1.4, r: 10 });
            k.label(46, 154, "browser cookie store", { size: 11, mono: true, color: "#141826" });
            k.label(46, 176, "PHPSESSID · security=low · expires with the session", {
              size: 10.5,
              color: MUTED
            });
            footer(k, w, h, "The deck's method: retrieve the authentication cookie and enter it into the scanner.");
          }
        },
        {
          title: "4 · Every request now carries the cookie",
          caption:
            "With the cookie configured, the scanner's requests are treated as authenticated. The crawler now maps navigation, forms and API routes that were invisible a moment ago.",
          draw: function (ctx, w, h, k) {
            k.clear();
            chip(k, 30, 40, 130, 34, "scanner", { fill: "#fde8ee", stroke: INK, color: "#881337" });
            chip(k, 30, 84, 130, 34, "Cookie: <session>", {
              fill: "#ecfdf5",
              stroke: GREEN,
              color: "#065f46",
              size: 10.5
            });
            k.arrow(166, 57, w * 0.58, 57, { color: GREEN, lw: 2 });
            packet(k, w * 0.44, 57, "authenticated", { fill: GREEN, color: GREEN });
            chip(k, w * 0.6, 40, w * 0.34, 34, "200 OK · page returned", {
              fill: "#ecfdf5",
              stroke: GREEN,
              color: "#065f46",
              size: 11
            });

            ["navigation", "forms", "API routes", "session handling"].forEach(function (t, i) {
              k.label(30, 140 + i * 20, "· " + t + " now reachable", { size: 11, color: MUTED });
            });
            k.label(30, h - 44, "the cookie is re-checked on every request — expiry mid-scan shows up as a redirect spike", {
              size: 10.5,
              mono: true,
              color: INK
            });
            footer(k, w, h, "Authenticated scanning does not break the rules of a scan; it changes what the scan can see.");
          }
        },
        {
          title: "5 · Coverage, before and after",
          caption:
            "The same crawler reaches far more of the application, so the alert count rises — in the privileged functionality, not in the public pages. Compare coverage and precision, never alert counts.",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.label(30, 34, "coverage of the discovered surface", { size: 11, mono: true, color: INK });

            k.label(30, 66, "unauthenticated", { size: 11, color: MUTED });
            k.bar(30, 78, w - 200, 16, 0.18, { max: 1, fill: SLATE, track: "#e8ecf3" });
            k.label(w - 150, 86, "18%", { size: 11, mono: true, color: MUTED });

            k.label(30, 116, "authenticated", { size: 11, color: MUTED });
            k.bar(30, 128, w - 200, 16, 0.83, { max: 1, fill: GREEN, track: "#e8ecf3" });
            k.label(w - 150, 136, "83%", { size: 11, mono: true, color: GREEN });

            k.label(30, 172, "findings: public surfaces only → protected functionality included", {
              size: 10.5,
              mono: true,
              color: MUTED
            });
            k.label(30, 194, "remaining gap: destructive tests excluded, token-protected flows, session expiry", {
              size: 10.5,
              mono: true,
              color: AMBER
            });
            footer(k, w, h, "A coverage statement is what turns a scan into a defensible assessment.");
          }
        }
      ]
    });
  }
})();
