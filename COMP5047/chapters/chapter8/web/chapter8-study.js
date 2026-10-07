(function () {
  "use strict";

  /* COMP5047 — Week 8 page behaviour.
   *
   * The declarative widgets (timeline, matcher, race, deck, sequence, hotspot)
   * are mounted by shared/interactive.js from the JSON config blocks in the
   * page. This file owns the four animated canvas steppers and the re-binding
   * that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initLadderStepper();
    initVuiPipelineStepper();
    initConfidenceStepper();
    initRepairStepper();
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
    initLadderStepper();
    initVuiPipelineStepper();
    initConfidenceStepper();
    initRepairStepper();
    rebindChrome();
  });

  var lastChromeLang = null;

  function currentLang() {
    return typeof window.getLang === "function" ? window.getLang() : "en";
  }

  function zh() {
    return currentLang() === "zh";
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
    if (!window.initCOMP5047ChapterUI) return;
    try {
      window.initCOMP5047ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[COMP5047 chapter 8] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Canvas helpers ─────────────────────────────────────────── */

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    var words = String(text).split(/\s+/);
    var lines = [];
    var line = "";
    var i;
    for (i = 0; i < words.length; i++) {
      var attempt = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(attempt).width > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = attempt;
      }
    }
    if (line) lines.push(line);
    if (maxLines && lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\s+\S*$/, "") + "…";
    }
    lines.forEach(function (ln, idx) {
      ctx.fillText(ln, x, y + idx * lineHeight);
    });
    return lines.length;
  }

  function withFont(ctx, opts, fn) {
    ctx.save();
    ctx.font = (opts.weight || "500") + " " + (opts.size || 13) + "px " + opts.family;
    ctx.fillStyle = opts.color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    fn();
    ctx.restore();
  }

  function paragraph(ctx, x, y, text, opts) {
    opts = opts || {};
    var size = opts.size || 13;
    var lh = opts.lh || 20;
    var color = opts.color || "#565d75";
    var mono = opts.mono === true;
    withFont(
      ctx,
      { size: size, color: color, weight: opts.weight || "500", family: mono ? "ui-monospace, monospace" : "system-ui, sans-serif" },
      function () {
        wrapText(ctx, text, x, y, opts.maxWidth || 300, lh, opts.maxLines || 8);
      }
    );
  }

  /* ── Stepper 1: Sheridan and Verplank's levels of automation ── */

  function initLadderStepper() {
    var host = document.getElementById("ix-ladder");
    if (!host || !window.Interactive) return;

    var levels = [
      { n: 1, name: "AI offers no assistance: human must take all decisions and actions" },
      { n: 2, name: "AI offers a complete set of decision/action alternatives" },
      { n: 3, name: "AI narrows the selection down to a few" },
      { n: 4, name: "AI suggests one alternative" },
      { n: 5, name: "AI executes a suggestion if the human approves" },
      { n: 6, name: "AI allows the human a time to veto before automatic execution" },
      { n: 7, name: "AI executes automatically, then necessarily informs the human" },
      { n: 8, name: "AI informs the human only if asked" },
      { n: 9, name: "AI informs the human only if it decides to" },
      { n: 10, name: "AI decides everything, acts autonomously, ignoring the human" }
    ];

    var examples = [
      "the user reads the glucose value and decides the dose",
      "all candidate doses listed, the user picks one",
      "three plausible doses shown, the user chooses",
      "one recommended dose, the user accepts or rejects",
      "the pump proposes a dose and waits for approval",
      "the pump starts a dose but allows a veto in the next minute",
      "the pump doses and tells the user afterwards",
      "the pump doses silently and logs it for review on request",
      "the pump doses silently and reports only when it judges it necessary",
      "closed-loop control: the device decides and never asks"
    ];

    function roleState(level) {
      if (level <= 3) return "low";
      if (level <= 6) return "mid";
      return "high";
    }

    function drawRoles(ctx, k, x, y, w, level) {
      var pad = 14;
      var gap = 12;
      var bw = (w - pad * 2 - gap) / 2;
      var bh = 96;
      var state = roleState(level);
      var aiActive = level >= 2;
      var humanActive = level <= 7;

      var boxes = [
        {
          x: x + pad,
          title: "HUMAN",
          on: humanActive,
          note:
            state === "low"
              ? "decides and acts"
              : state === "mid"
              ? "decides with a veto"
              : state === "high"
              ? "watches a notification"
              : ""
        },
        {
          x: x + pad + bw + gap,
          title: "AI SYSTEM",
          on: aiActive,
          note:
            state === "low"
              ? level === 1
                ? "absent"
                : "informs"
              : state === "mid"
              ? level === 4
                ? "suggests"
                : "acts, then asks"
              : "decides and acts"
        }
      ];

      boxes.forEach(function (b) {
        k.box(b.x, y, bw, bh, {
          fill: b.on ? "#e6f2f5" : "#f1f5f9",
          stroke: b.on ? "#0e7490" : "#cbd5e1",
          lw: b.on ? 2 : 1.2,
          r: 10
        });
        k.label(b.x + bw / 2, y + 24, b.title, {
          align: "center",
          size: 12,
          mono: true,
          color: b.on ? "#0e7490" : "#94a3b8"
        });
        paragraph(ctx, b.x + 12, y + 52, b.on ? b.note : "no role at this level", {
          size: 11.5,
          lh: 16,
          maxWidth: bw - 24,
          maxLines: 2,
          color: b.on ? "#141826" : "#94a3b8"
        });
      });

      var midY = y + bh + 16;
      if (state === "low") {
        k.label(x + pad, midY, "the person initiates every action", { size: 11.5, color: "#565d75" });
        k.arrow(x + pad + bw + gap - 6, midY, x + pad + bw + 10, midY, { color: "#94a3b8", dash: [4, 4], lw: 1.4 });
        k.label(x + pad, midY + 18, "the system informs, if that", { size: 11, color: "#94a3b8" });
      } else if (state === "mid") {
        k.label(x + pad, midY, level === 4 ? "suggestion → review → user acts" : "action → notice → veto window", {
          size: 11.5,
          color: "#565d75"
        });
        k.arrow(x + pad + bw + 6, midY, x + pad + bw + gap - 6, midY, { color: "#0891b2", lw: 1.8 });
        k.arrow(x + pad + bw + gap - 6, midY + 20, x + pad + bw + 6, midY + 20, { color: "#0891b2", lw: 1.8 });
        k.label(x + pad, midY + 20, "shared initiative", { size: 11, color: "#0891b2" });
      } else {
        k.label(x + pad, midY, level === 10 ? "no human involvement at all" : "action first, information afterwards", {
          size: 11.5,
          color: "#565d75"
        });
        k.arrow(x + pad + bw + gap - 6, midY, x + pad + bw + 6, midY, { color: "#dc2626", lw: 1.8 });
        k.label(x + pad, midY + 20, level === 10 ? "the human is out of the loop" : "the human is notified, not consulted", {
          size: 11,
          color: "#dc2626"
        });
      }
    }

    var frames = levels.map(function (lvl, idx) {
      return {
        title: "Level " + lvl.n + " — " + lvl.name,
        caption: "Example at level " + lvl.n + ": " + examples[idx] + ".",
        draw: function (ctx, w, h, k) {
          k.clear();
          var state = roleState(lvl.n);
          k.box(14, 12, w - 28, h - 24, { stroke: "#e2e8f0", lw: 1.4, r: 12 });

          /* a small scale indicator, "1" at the bottom and "10" at the top */
          var railX = w - 40;
          k.label(railX, 26, "10", { align: "center", size: 10, mono: true, color: "#94a3b8" });
          k.label(railX, h - 22, "1", { align: "center", size: 10, mono: true, color: "#94a3b8" });
          k.arrow(railX, h - 34, railX, 36, { color: "#cbd5e1", lw: 1.3 });
          var t = (lvl.n - 1) / 9;
          k.dot(railX, h - 34 - t * (h - 70), 5, { fill: "#0891b2", stroke: "#0e7490", lw: 1.2 });

          var innerW = w - 28 - 44;
          k.label(34, 40, "LOW  " + lvl.n + "  HIGH", { size: 11, mono: true, color: state === "high" ? "#dc2626" : state === "mid" ? "#0891b2" : "#059669" });
          k.bar(34, 54, innerW - 60, 9, lvl.n, { max: 10, fill: state === "high" ? "#dc2626" : state === "mid" ? "#0891b2" : "#059669", track: "#e2e8f0" });

          paragraph(ctx, 34, 86, lvl.name, {
            size: 14,
            lh: 20,
            weight: "700",
            maxWidth: innerW - 30,
            maxLines: 2,
            color: "#141826"
          });

          drawRoles(ctx, k, 24, h - 172, innerW - 6, lvl.n);
        }
      };
    });

    window.Interactive.stepper("ix-ladder", {
      title: zh() ? "自动化的十个层级（Sheridan 与 Verplank）" : "The ten levels of automation (Sheridan and Verplank)",
      subtitle: zh()
        ? "层级 1 完全没有协助；层级 10 完全无视人。用胰岛素泵这一个决策来说明每一层意味着什么。"
        : "Level 1 is no assistance at all; level 10 ignores the human entirely. One decision — an insulin dose — is used to show what each level means.",
      height: 320,
      frames: frames
    });
  }

  /* ── Stepper 2: the voice pipeline, stage by stage ──────────── */

  function initVuiPipelineStepper() {
    var host = document.getElementById("ix-vui-pipeline");
    if (!host || !window.Interactive) return;

    var stages = [
      { label: "Wake word", note: "the device decides you are talking to it" },
      { label: "Capture", note: "microphone array records the utterance" },
      { label: "Recognise", note: "acoustic model produces a transcript" },
      { label: "Understand", note: "words → syntax → semantics → pragmatics" },
      { label: "Skill / API", note: "the request leaves the device" },
      { label: "Dialogue manager", note: "confidence sets the response tier" },
      { label: "Synthesise", note: "text-to-speech, then the repair" }
    ];

    var captions = [
      "Nothing else happens until the wake word fires. A false accept means the device is listening to a conversation nobody addressed to it; a false reject means the user repeats themselves. Both are privacy parameters, not just accuracy parameters.",
      "The array has to separate the speaker from the room. Placement decides whether the transcript is right before any model runs — which is why a device that works on a desk fails in a kitchen.",
      "The recogniser turns sound into the only thing the rest of the pipeline ever sees. Once the transcript is wrong, every later stage will act confidently on the wrong words.",
      "The deck's four levels of language: words, syntax, semantics, pragmatics. “Play Yesterday” could be a song, an album, a film or a book; “I shot an elephant in my pyjamas” has two parses. Ambiguity is linguistic, not a bug.",
      "This is the capability boundary. The deck's Google example — “Ok, Google, open Uber” answered with “I can't open apps” — is an honest limit, and stating it is the first human-AI guideline.",
      "Three-tiered confidence decides what the user hears: act when confident, confirm when uncertain, ask again when lost. This is also where short-term memory makes “the last song” resolvable.",
      "Speech synthesis carries prosody, which the deck lists as the empathy advantage of voice. Then the loop closes: if the answer is wrong, the user repairs it themselves — louder, shorter, rephrased, or with more detail."
    ];

    var frames = stages.map(function (stage, idx) {
      return {
        title: (idx + 1) + ". " + stage.label,
        caption: captions[idx],
        draw: function (ctx, w, h, k) {
          k.clear();
          var pad = 16;
          var gap = 8;
          var bw = (w - pad * 2 - gap * (stages.length - 1)) / stages.length;
          var by = 22;
          var bh = 62;

          stages.forEach(function (s, i) {
            var x = pad + i * (bw + gap);
            var done = i < idx;
            var live = i === idx;
            k.box(x, by, bw, bh, {
              fill: live ? "#0891b2" : done ? "#e6f2f5" : "#f8fafc",
              stroke: live ? "#0e7490" : done ? "#0e7490" : "#cbd5e1",
              lw: live ? 2.4 : 1.3,
              r: 8
            });
            paragraph(ctx, x + 8, by + 22, s.label, {
              size: 11.5,
              lh: 14,
              maxWidth: bw - 14,
              maxLines: 2,
              weight: live ? "700" : "600",
              color: live ? "#ffffff" : done ? "#0e7490" : "#7b829a"
            });
            if (i < stages.length - 1) {
              k.arrow(x + bw + 1, by + bh / 2, x + bw + gap - 1, by + bh / 2, {
                color: i < idx ? "#0891b2" : "#cbd5e1",
                lw: 1.6
              });
            }
          });

          var cy = 128;
          k.label(pad, cy + 4, stages[idx].note, { size: 12.5, mono: false, color: "#0e7490", weight: "700" });
          k.highlight(pad - 4, cy - 14, w - pad * 2 + 8, 36, { color: "#0891b2", dash: [5, 4] });

          paragraph(ctx, pad, 176, captions[idx], {
            size: 12.5,
            lh: 19,
            maxWidth: w - pad * 2,
            maxLines: 5,
            color: "#565d75"
          });
        }
      };
    });

    window.Interactive.stepper("ix-vui-pipeline", {
      title: zh() ? "一条语音指令要经过的七个阶段" : "Seven stages between speaking and being understood",
      subtitle: zh()
        ? "每一帧显示一个阶段，以及交互设计师在该阶段真正能控制的东西。"
        : "Each frame isolates one stage and the part of it the interaction designer actually controls.",
      height: 280,
      frames: frames
    });
  }

  /* ── Stepper 3: three-tiered confidence ─────────────────────── */

  function initConfidenceStepper() {
    var host = document.getElementById("ix-confidence");
    if (!host || !window.Interactive) return;

    var tiers = [
      {
        title: "Tier 1 — confident: act",
        caption:
          "High confidence, reversible action, context matches. The deck's example: “OK, ordering more dog food”. The user is told what happened, not asked. This tier is only defensible when the action can be undone.",
        cards: [{ t: "User", b: "“Please buy more dog food”" }, { t: "System", b: "“OK, ordering more dog food”" }],
        level: "high",
        fill: 0.88
      },
      {
        title: "Tier 2 — uncertain: confirm",
        caption:
          "The parse is plausible but not certain, or the action is hard to reverse. The deck's example: “I understand you'd like to order more dog food. Is that correct?” One extra turn buys correctness.",
        cards: [{ t: "User", b: "“Please buy more dog food”" }, { t: "System", b: "“I understand you'd like to order more dog food. Is that correct?”" }],
        level: "mid",
        fill: 0.55
      },
      {
        title: "Tier 3 — lost: ask again",
        caption:
          "Confidence below the usable threshold. The deck's example: “I'm sorry, I didn't get that. What would you like to buy?” The system states its failure instead of guessing, which keeps the third attempt different from the first two.",
        cards: [{ t: "User", b: "unintelligible" }, { t: "System", b: "“I'm sorry, I didn't get that. What would you like to buy?”" }],
        level: "low",
        fill: 0.22
      },
      {
        title: "The failure this policy prevents",
        caption:
          "Acting silently at low confidence. The system commits an irreversible action on a guess, the user cannot tell whether the mistake was theirs, and the repair strategies in the next section become the user's only recourse.",
        cards: [{ t: "User", b: "ambiguous request" }, { t: "System", b: "acts anyway — no confirmation, no notice" }],
        level: "bad",
        fill: 0.12
      }
    ];

    function bubble(ctx, box, x, y, w, text, opts) {
      opts = opts || {};
      var lines = 1;
      withFont(
        ctx,
        { size: opts.size || 12.5, color: opts.color, weight: "500", family: "system-ui, sans-serif" },
        function () {
          lines = wrapText(ctx, text, x + 12, y + 22, w - 24, 17, 4);
        }
      );
      var bh = 22 + lines * 17 + 10;
      box(x, y, w, bh, { fill: opts.fill || "#ffffff", stroke: opts.stroke || "#cbd5e1", lw: 1.4, r: 10 });
      withFont(
        ctx,
        { size: opts.size || 12.5, color: opts.color, weight: "500", family: "system-ui, sans-serif" },
        function () {
          wrapText(ctx, text, x + 12, y + 22, w - 24, 17, 4);
        }
      );
      return bh;
    }

    var frames = tiers.map(function (tier, idx) {
      return {
        title: tier.title,
        caption: tier.caption,
        draw: function (ctx, w, h, k) {
          k.clear();
          var pad = 18;
          var meterW = Math.min(240, w * 0.32);
          var color = tier.level === "high" ? "#059669" : tier.level === "mid" ? "#0891b2" : tier.level === "low" ? "#f59e0b" : "#dc2626";

          k.label(pad, 26, "CONFIDENCE", { size: 10.5, mono: true, color: "#7b829a" });
          k.bar(pad, 40, meterW, 12, tier.fill, { max: 1, fill: color, track: "#e2e8f0" });
          k.label(pad + meterW + 10, 46, Math.round(tier.fill * 100) + "%", { size: 12, mono: true, color: color });
          k.label(pad, 66, "policy: " + (idx === 0 ? "act" : idx === 1 ? "confirm" : idx === 2 ? "ask again" : "none — this is the anti-pattern"), {
            size: 11.5,
            color: "#565d75"
          });

          var topY = 102;
          var bw = w - pad * 2;
          var used = bubble(ctx, k.box, pad, topY, bw, tier.cards[0].t + ": " + tier.cards[0].b, {
            fill: "#ffffff",
            stroke: "#94a3b8",
            color: "#141826"
          });
          bubble(ctx, k.box, pad, topY + used + 14, bw, tier.cards[1].t + ": " + tier.cards[1].b, {
            fill: tier.level === "bad" ? "#fef2f2" : "#e6f2f5",
            stroke: color,
            color: tier.level === "bad" ? "#dc2626" : "#0e7490"
          });

          k.highlight(pad - 6, topY - 8, bw + 12, used * 2 + 34, { color: color, dash: [5, 4] });
        }
      };
    });

    window.Interactive.stepper("ix-confidence", {
      title: zh() ? "三层置信度策略" : "The three-tiered confidence policy",
      subtitle: zh()
        ? "助手必须先判断自己有多确定，再决定是直接执行、请求确认，还是承认没听懂。"
        : "The assistant has to decide how sure it is before it decides what to do: act, confirm, or admit it did not understand.",
      height: 300,
      frames: frames
    });
  }

  /* ── Stepper 4: one failure, four repair strategies ─────────── */

  function initRepairStepper() {
    var host = document.getElementById("ix-repair-pipeline");
    if (!host || !window.Interactive) return;

    var patterns = [
      {
        title: "The failure",
        caption:
          "The user asks for a playlist and the system answers something else. Everything that follows is the user working around a defect the interface never surfaced.",
        strategy: "—",
        signal: "no signal: the user has not changed anything yet",
        diagnosis: "the system gave no indication of which stage failed"
      },
      {
        title: "Hyperarticulation",
        caption:
          "Speaking louder and/or slower, trying to clearly articulate the utterance. The deck's example: “Alexa, play the Beatles on Spotify” becomes “A-LE-XA, PLAY THE BEA-TLES ON SPO-TI-FY”.",
        strategy: "acoustic repair",
        signal: "same words, higher volume, slower rate",
        diagnosis: "the user believes the system cannot hear — check the transcript before retraining anything"
      },
      {
        title: "Simplification",
        caption:
          "Reducing the complexity of the utterance, leaving only keywords. The deck's example: “Alexa, can you play ‘Beat the intro'?” becomes “Alexa, ‘Beat the Intro'”.",
        strategy: "acoustic repair",
        signal: "shorter, telegraphic input with the sentence structure removed",
        diagnosis: "the user no longer believes the system can parse a sentence — the natural-language layer has lost credibility"
      },
      {
        title: "New utterance",
        caption:
          "Re-formulating the utterance to achieve the same goal. The deck's example: “Modify my group meeting on Wednesday” becomes “Edit my group meeting on Wednesday”.",
        strategy: "semantic repair",
        signal: "same goal, different verb",
        diagnosis: "the skill's vocabulary is too narrow — this is a synonym problem, not a volume problem"
      },
      {
        title: "Give more information",
        caption:
          "Adding more information to help the system disambiguate. The deck's example: “Hey Google, play Hello” becomes “Hey Google, play Hello by Adele”.",
        strategy: "semantic repair",
        signal: "the retry is longer than the first attempt",
        diagnosis: "the first request was under-specified and the system should have asked which one instead of guessing"
      },
      {
        title: "What the designer does with this",
        caption:
          "Detect the repair pattern, then respond differently on the third attempt: show the transcript, offer the nearest available option, or hand off to another modality such as a list on screen.",
        strategy: "design response",
        signal: "repair-pattern distribution across sessions",
        diagnosis: "acoustic repairs point at recognition; semantic repairs point at understanding and capability"
      }
    ];

    var frames = patterns.map(function (p, idx) {
      return {
        title: (idx + 1) + ". " + p.title,
        caption: p.caption,
        draw: function (ctx, w, h, k) {
          k.clear();
          var pad = 18;

          var steps = ["failure", "repair", "signal", "diagnosis"];
          var gap = 8;
          var bw = (w - pad * 2 - gap * 3) / 4;
          steps.forEach(function (label, i) {
            var x = pad + i * (bw + gap);
            var live = i <= Math.min(idx, 3);
            k.box(x, 20, bw, 30, {
              fill: live ? "#e6f2f5" : "#f8fafc",
              stroke: live ? "#0e7490" : "#cbd5e1",
              lw: live ? 1.8 : 1.2,
              r: 8
            });
            k.label(x + bw / 2, 36, label, {
              align: "center",
              size: 11,
              mono: true,
              color: live ? "#0e7490" : "#94a3b8"
            });
            if (i < 3) {
              k.arrow(x + bw + 1, 35, x + bw + gap - 1, 35, { color: live ? "#0891b2" : "#cbd5e1", lw: 1.5 });
            }
          });

          var y = 74;
          k.label(pad, y, "DECK PATTERN", { size: 10, mono: true, color: "#7b829a" });
          k.label(pad, y + 22, idx === 0 ? "—" : idx === 5 ? "design response, not a user behaviour" : p.title, {
            size: 15,
            color: idx === 0 ? "#7b829a" : "#141826",
            weight: "700"
          });
          k.label(pad, y + 46, p.strategy, {
            size: 12,
            mono: true,
            color: idx >= 3 ? "#7c3aed" : idx >= 1 ? "#0891b2" : "#7b829a"
          });

          paragraph(ctx, pad, y + 78, p.caption, {
            size: 12.5,
            lh: 18,
            maxWidth: w - pad * 2,
            maxLines: 4,
            color: "#565d75"
          });

          k.box(pad, h - 62, w - pad * 2, 46, { fill: "#f8fcfd", stroke: "#e2e8f0", lw: 1.2, r: 8 });
          k.label(pad + 12, h - 46, "system could detect", { size: 10.5, mono: true, color: "#059669" });
          paragraph(ctx, pad + 12, h - 28, p.signal, {
            size: 11.5,
            lh: 15,
            maxWidth: w - pad * 2 - 24,
            maxLines: 1,
            color: "#141826"
          });
        }
      };
    });

    window.Interactive.stepper("ix-repair-pipeline", {
      title: zh() ? "一次失败，四种修复策略" : "One failure, four repairs — and what each one tells you",
      subtitle: zh()
        ? "用户会自行修补系统的错误。他们选择哪种策略，就指向语音流水线中出错的那一段。"
        : "Users repair the system's errors themselves. Which repair they choose points at the stage of the pipeline that failed.",
      height: 320,
      frames: frames
    });
  }
})();
