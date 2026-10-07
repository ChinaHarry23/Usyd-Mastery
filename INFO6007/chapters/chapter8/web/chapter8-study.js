(function () {
  "use strict";

  /* INFO6007 — Week 8 page behaviour.
   *
   * The declarative widgets (timeline, hotspot, sequence, matcher, race, deck,
   * pipeline) are mounted by shared/interactive.js from the JSON config blocks
   * in the page. This file owns the one animated canvas stepper and the
   * re-binding that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widget first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animation from mounting. */
    initControlStepper();
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
    initControlStepper();
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
    if (!window.initINFO6007ChapterUI) return;
    try {
      window.initINFO6007ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[INFO6007 chapter 8] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Stepper: the five steps of Control Procurements ──────────── */

  function initControlStepper() {
    var host = document.getElementById("ix-control-loop");
    if (!host || !window.Interactive) return;
    /* A language swap replaces the section, so the host is a new node — but if
     * the page script runs twice on the same node, refresh instead of remount. */
    if (host.dataset.mounted === "1") {
      if (typeof host._ixRefresh === "function") host._ixRefresh();
      return;
    }
    host.dataset.mounted = "1";

    var steps = ["Review\ndeliverables", "Check milestones\n& SLA", "Test acceptance\ncriteria", "Manage approved\nchanges", "Verify invoice\n& close"];

    window.Interactive.stepper("ix-control-loop", {
      title: "Control Procurements: the five-step gate",
      subtitle: "Payments and contract closure follow formal acceptance of deliverables, so every step has to produce evidence.",
      height: 300,
      frames: [
        {
          title: "1. Review deliverables",
          caption: "Read what the vendor says it has delivered against the contract, not against the conversation. Output: a reviewed deliverable with the evidence attached — delivery notes, test reports, milestone evidence.",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawChain(k, w, h, 0, steps);
            drawPanel(k, w, h, "CONTROL FOCUS", [
              "Keep supplier work aligned with the contract.",
              "Review test reports and milestone evidence."
            ], "#7c3aed");
            k.label(w / 2, h - 26, "Evidence in: deliverables, test reports, milestone records", { align: "center", size: 12, color: "#565d75" });
          }
        },
        {
          title: "2. Check milestones and SLA",
          caption: "Compare the delivery dates and service levels with what the contract promised. This is where a schedule slip becomes a contractual fact rather than an impression.",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawChain(k, w, h, 1, steps);
            drawPanel(k, w, h, "MONITOR", [
              "Delivery status against each milestone",
              "Service levels: availability, response, resolution",
              "Lead times, and any approved change to the dates"
            ], "#2563eb");
            k.label(w / 2, h - 26, "A missed milestone triggers the agreed consequence, not a renegotiation", { align: "center", size: 12, color: "#565d75" });
          }
        },
        {
          title: "3. Test acceptance criteria",
          caption: "Acceptance criteria were negotiated when the contract was awarded. Testing them here is what turns 'the vendor says it is done' into 'the project accepts it'.",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawChain(k, w, h, 2, steps);
            drawPanel(k, w, h, "QUALITY FINDINGS", [
              "Acceptance criteria from the SOW are tested, not assumed",
              "Defects are recorded with severity and owner",
              "Conforming work is accepted formally; non-conforming work is not"
            ], "#059669");
            k.label(w / 2, h - 26, "Strict acceptance criteria in the SOW are the lecture's quality-risk mitigation", { align: "center", size: 12, color: "#565d75" });
          }
        },
        {
          title: "4. Manage approved changes",
          caption: "Scope, schedule and price changes go through change control: request, impact assessment, approval, updated baseline. Anything informal leaves no record when the dispute arrives.",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawChain(k, w, h, 3, steps);
            drawPanel(k, w, h, "CHANGE CONTROL", [
              "Every variation is requested and assessed in writing",
              "Approved changes update the contract baseline and the schedule",
              "Unapproved work is not a claim on the budget"
            ], "#f59e0b");
            k.label(w / 2, h - 26, "Manage change formally — one of the lecture's eight control tips", { align: "center", size: 12, color: "#565d75" });
          }
        },
        {
          title: "5. Verify the invoice, then close",
          caption: "The invoice is checked against accepted deliverables before it is paid. Contract closure records the final position and feeds lessons learned into the next make-or-buy decision.",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawChain(k, w, h, 4, steps);
            drawPanel(k, w, h, "THE PAYMENT GATE", [
              "Verify before payment: no acceptance, no release",
              "Final invoice reconciled against the accepted scope",
              "Contract closed, performance recorded, lessons learned captured"
            ], "#dc2626");
            k.label(w / 2, h - 26, "Verify before payment — the rule that keeps the buyer's leverage", { align: "center", size: 12, color: "#565d75" });
          }
        },
        {
          title: "The loop closes",
          caption: "Monitoring feeds the next planning cycle: performance data, quality findings and approved changes become the input to the next procurement decision, and to the vendor scorecard.",
          draw: function (ctx, w, h, k) {
            k.clear();
            drawChain(k, w, h, -1, steps);
            k.arrow(w - 60, 108, w - 60, 44, { color: "#7c3aed", lw: 2 });
            k.arrow(60, 44, 60, 108, { color: "#7c3aed", lw: 2 });
            k.label(w / 2, h / 2 + 6, "monitor → record → re-plan", { align: "center", size: 15, weight: "700", color: "#7c3aed" });
            drawPanel(k, w, h, "FEEDS BACK INTO", [
              "Vendor scorecard: delivery timeliness, quality, cost, service, compliance",
              "The next make-or-buy analysis, with real vendor performance behind it"
            ], "#7c3aed");
          }
        }
      ]
    });
  }

  /* ── canvas helpers ─────────────────────────────────────────── */

  function drawChain(k, w, h, active, steps) {
    var n = steps.length;
    var left = 16;
    var right = w - 16;
    var gap = 10;
    var boxW = (right - left - gap * (n - 1)) / n;
    var y = 40;
    var boxH = 66;

    steps.forEach(function (label, i) {
      var x = left + i * (boxW + gap);
      var isActive = i === active;
      var isDone = active >= 0 && i < active;
      var fill = isActive ? "#7c3aed" : (isDone ? "rgba(124,58,237,0.14)" : "#ffffff");
      var stroke = isActive ? "#6d28d9" : "rgba(124,58,237,0.35)";
      k.box(x, y, boxW, boxH, { fill: fill, stroke: stroke, lw: isActive ? 2.4 : 1.6, r: 10 });

      var textColour = isActive ? "#ffffff" : "#141826";
      k.label(x + boxW / 2, y + 16, String(i + 1), { align: "center", size: 13, weight: "700", color: isActive ? "#ffffff" : "#7c3aed", mono: true });
      label.split("\n").forEach(function (line, li) {
        k.label(x + boxW / 2, y + 36 + li * 15, line, { align: "center", size: 11, color: textColour });
      });

      if (i < n - 1) {
        k.arrow(x + boxW + 1, y + boxH / 2, x + boxW + gap - 1, y + boxH / 2, { color: "rgba(124,58,237,0.6)", lw: 1.8, head: 5 });
      }
    });
  }

  function drawPanel(k, w, h, heading, lines, colour) {
    var x = 24;
    var y = 136;
    var boxW = w - 48;
    var boxH = h - y - 46;
    k.box(x, y, boxW, boxH, { fill: "#fbf9fe", stroke: colour, lw: 1.6, r: 12 });
    k.label(x + 16, y + 22, heading, { size: 11.5, mono: true, weight: "700", color: colour });
    lines.forEach(function (line, i) {
      k.label(x + 16, y + 50 + i * 22, "•  " + line, { size: 12.5, color: "#141826" });
    });
  }
})();
