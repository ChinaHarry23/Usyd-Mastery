(function () {
  "use strict";

  /* COMP5618 — Week 8 page behaviour.
   *
   * The declarative widgets (hotspot, sequence, matcher, timeline, pipeline,
   * race, deck) are mounted by shared/interactive.js from the JSON config
   * blocks in the page. This file owns the three animated canvas walkthroughs
   * and the re-binding that a language swap requires:
   *
   *   ix-lifecycle  — source code to running app, and where verification sits
   *   ix-intent     — one implicit intent crossing the sandbox, frame by frame
   *   ix-privesc    — the escalation chain from a sandboxed app to root
   */

  var COL = {
    card: "#ffffff",
    ink: "#141826",
    dim: "#565d75",
    faint: "#94a3b8",
    line: "#cbd5e1",
    app: { fill: "#eef4ff", stroke: "#2563eb", text: "#1d4ed8" },
    system: { fill: "#eafaf2", stroke: "#059669", text: "#047857" },
    other: { fill: "#f3eefe", stroke: "#7c3aed", text: "#6d28d9" },
    hot: { fill: "#fdeef2", stroke: "#e11d48", text: "#be123c" },
    stop: { fill: "#fef2f2", stroke: "#dc2626", text: "#b91c1c" }
  };

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initLifecycleStepper();
    initIntentStepper();
    initPrivescStepper();
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
    initLifecycleStepper();
    initIntentStepper();
    initPrivescStepper();
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
        window.console.error("[COMP5618 chapter 7] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared drawing helpers ─────────────────────────────────── */

  /* One pipeline stage: a numbered pill, a title and an optional note. */
  function stageRow(k, x, y, width, height, index, title, note, state) {
    var skin = state === "active" ? COL.hot : state === "done" ? COL.system : null;
    k.box(x, y, width, height, {
      fill: skin ? skin.fill : COL.card,
      stroke: skin ? skin.stroke : COL.line,
      lw: state === "active" ? 2.4 : 1.6,
      r: 10
    });
    k.dot(x + 24, y + height / 2, 13, {
      fill: state === "active" ? COL.hot.stroke : state === "done" ? COL.system.stroke : COL.card,
      stroke: state ? skin.stroke : COL.faint,
      lw: 1.6
    });
    k.label(x + 24, y + height / 2, String(index + 1), {
      align: "center",
      size: 11,
      mono: true,
      color: state ? "#ffffff" : COL.dim
    });
    k.label(x + 48, y + (note ? height / 2 - 8 : height / 2), title, {
      size: 12.5,
      color: state === "active" ? COL.hot.text : COL.ink
    });
    if (note) {
      k.label(x + 48, y + height / 2 + 11, note, { size: 10.5, color: COL.dim, weight: "500" });
    }
  }

  function stageConnector(k, x, yTop, yBottom) {
    k.arrow(x, yTop, x, yBottom, { color: COL.line, lw: 1.8 });
  }

  /* ── Stepper 1: APK lifecycle and verification ──────────────── */

  function initLifecycleStepper() {
    var host = document.getElementById("ix-lifecycle");
    if (!host || !window.Interactive) return;

    var stages = [
      "Source code",
      "Build",
      "Package (APK)",
      "Sign",
      "Distribute",
      "Verify and install",
      "Sandboxed app"
    ];

    var notes = [
      "Java/Kotlin sources, manifest, resources",
      "Compiled to DEX bytecode for the Android runtime",
      "A ZIP: manifest, classes.dex, resources",
      "The developer's private key over the package",
      "A store, a mirror, or an ADB pull",
      "Signature check, then a unique Linux UID",
      "Own data directory, own process, own identity"
    ];

    function drawChain(k, w, h, active, checkAt) {
      k.clear();
      var count = stages.length;
      var gap = 12;
      var top = 20;
      var boxH = (h - top - 20 - (count - 1) * gap) / count;
      var x = 24;
      var width = Math.min(w - 220, 520);

      stages.forEach(function (title, i) {
        var y = top + i * (boxH + gap);
        var state = i === active ? "active" : i < active ? "done" : "todo";
        stageRow(k, x, y, width, boxH, i, title, notes[i], state);
        if (i < count - 1) stageConnector(k, x + width / 2, y + boxH, y + boxH + gap);
      });

      if (checkAt != null) {
        var yCheck = top + checkAt * (boxH + gap);
        k.box(w - 178, yCheck - 6, 154, boxH + 12, {
          fill: "rgba(225,29,72,0.06)",
          stroke: COL.hot.stroke,
          lw: 1.6,
          r: 10
        });
        k.label(w - 101, yCheck + boxH / 2 - 10, "verification gate", {
          align: "center",
          size: 11,
          mono: true,
          color: COL.hot.text
        });
        k.label(w - 101, yCheck + boxH / 2 + 8, "unsigned ⇒ refused", {
          align: "center",
          size: 10.5,
          weight: "500",
          color: COL.dim
        });
        k.arrow(x + width + 6, yCheck + boxH / 2, w - 182, yCheck + boxH / 2, {
          color: COL.hot.stroke,
          lw: 1.6,
          dash: [4, 4]
        });
      } else {
        k.label(w - 24, 30, "the app you can read, rebuild", { align: "right", size: 11, color: COL.dim });
        k.label(w - 24, 48, "and re-sign is the app you can audit", { align: "right", size: 11, color: COL.dim });
      }
    }

    window.Interactive.stepper("ix-lifecycle", {
      title: "From source to a sandboxed app — and where verification sits",
      subtitle: "The lecture's publication path, with the signature check marked at the point it actually gates.",
      height: 360,
      frames: [
        {
          title: "Source code",
          caption: "Native Android apps are developed in Java, with other toolchains available. The manifest written here decides the permissions and the exported components the finished app will have.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 0, null);
          }
        },
        {
          title: "Build",
          caption: "The sources are compiled into DEX bytecode for the Android runtime, together with a compiled resource table.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 1, null);
          }
        },
        {
          title: "Package — the Android Application Package",
          caption: "Everything is packed into the APK. It is a packaging format: a ZIP archive holding the manifest, the DEX bytecode, the resources and the signature block.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 2, null);
          }
        },
        {
          title: "Sign",
          caption: "The package is signed with the developer's key. From here on the signature is what identifies who packaged this build — and what a repackager cannot reproduce.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 3, null);
          }
        },
        {
          title: "Distribute",
          caption: "The signed package reaches users through an official store, a mirror, or a direct pull from a device over the ADB shell. The route decides what else you are trusting.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 4, null);
          }
        },
        {
          title: "Verify and install — the gate that actually stops a rebuild",
          caption: "Installation verifies the signature. Rebuild the APK and the old signature no longer matches, so the install is refused; sign the rebuild with your own key and it installs under your identity instead of the original developer's.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 5, 5);
          }
        },
        {
          title: "Sandboxed app",
          caption: "The installed app is assigned its own Linux UID with a private data directory and its own process — the sandbox. It can reach nothing beyond the permissions its manifest declared and the user granted.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 6, null);
          }
        }
      ]
    });
  }

  /* ── Stepper 2: one intent crossing the sandbox ─────────────── */

  function initIntentStepper() {
    var host = document.getElementById("ix-intent");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-intent", {
      title: "One implicit intent, frame by frame",
      subtitle: "How a request crosses the sandbox: resolved by the system, gated by the guard, delivered to the receiver.",
      height: 340,
      frames: [
        {
          title: "Two apps, two sandboxes",
          caption: "App A and App B each have their own UID, their own data directory and their own process. Nothing in the design so far lets A reach B — and nothing lets A do anything it did not declare.",
          draw: function (ctx, w, h, k) {
            drawLayout(k, w, h, { a: "idle", sys: "idle", b: "idle" });
            k.label(w - 24, 34, "no direct call path", { align: "right", size: 11.5, mono: true, color: COL.faint });
            k.label(w - 24, 54, "each box is a separate Linux user", { align: "right", size: 10.5, color: COL.dim });
          }
        },
        {
          title: "A builds an intent",
          caption: "App A creates an intent describing an operation — an action plus data rather than a component name. That is an implicit intent: A has not chosen a recipient.",
          draw: function (ctx, w, h, k) {
            drawLayout(k, w, h, { a: "call", sys: "idle", b: "idle" });
            drawCard(k, w, h, "new Intent(action, data)", "explicit? no — target not named", COL.app);
          }
        },
        {
          title: "The framework resolves it",
          caption: "The system, not the app, decides who may handle it. ActivityManager and PackageManager match the action against the intent filters other apps have published.",
          draw: function (ctx, w, h, k) {
            drawLayout(k, w, h, { a: "done", sys: "call", b: "call" });
            drawCard(k, w, h, "PackageManager query", "matching intent filters", COL.system);
          }
        },
        {
          title: "A guard changes the answer",
          caption: "If the receiving component declares a permission guard, the caller must hold it. Exported with a guard is a contract; exported with no guard accepts every app on the device.",
          draw: function (ctx, w, h, k) {
            drawLayout(k, w, h, { a: "done", sys: "done", b: "call" });
            drawCard(k, w, h, "guard(c) ∈ cap(A) ?", "reach = exported ∧ permitted", COL.hot);
          }
        },
        {
          title: "A denial stops here",
          caption: "The guard fails, the request is refused, and the sandbox has done its job. On Android 6.0 and later the same shape applies to permissions themselves: capability is what was declared and granted.",
          draw: function (ctx, w, h, k) {
            drawLayout(k, w, h, { a: "done", sys: "stop", b: "idle" });
            drawCard(k, w, h, "SecurityException", "capability = M ∩ G", COL.stop);
          }
        },
        {
          title: "Reach: the named component",
          caption: "App B's component is exported, so the system can deliver. Exporting is not a mistake by itself — a share target, a picker or a plugin host has to be reachable — but it is the moment the sandbox acquires a door.",
          draw: function (ctx, w, h, k) {
            drawLayout(k, w, h, { a: "done", sys: "done", b: "call" });
            drawCard(k, w, h, "exported = true", "delivery permitted", COL.other);
          }
        },
        {
          title: "Delivery runs in B's identity",
          caption: "B's component executes with B's capabilities, not A's. This is the whole point of IPC mediation: A does not gain B's permissions, it asks B to use them on its behalf.",
          draw: function (ctx, w, h, k) {
            drawLayout(k, w, h, { a: "done", sys: "done", b: "call" });
            drawCard(k, w, h, "runs as uid(B)", "not as uid(A)", COL.app);
          }
        },
        {
          title: "Trusting the caller",
          caption: "If B's component assumes the caller is its own app — a common oversight for an exported component — the boundary has been crossed for real: whatever the receiver does with the extras, it does with B's identity.",
          draw: function (ctx, w, h, k) {
            drawLayout(k, w, h, { a: "call", sys: "done", b: "call" });
            drawCard(k, w, h, "extras are untrusted input", "at a trust boundary", COL.hot);
          }
        },
        {
          title: "The consequence",
          caption: "A reachable component that acts on caller-supplied data is capability A never had. No permission was abused and no kernel bug was needed — an interface was simply more public than its author assumed.",
          draw: function (ctx, w, h, k) {
            drawLayout(k, w, h, { a: "call", sys: "done", b: "call" });
            drawCard(k, w, h, "A ⇝ capability of B", "via an unguarded export", COL.stop);
          }
        },
        {
          title: "Fix the interface, not the intent",
          caption: "Unexport the component, or give it a permission guard; then validate the caller and the data. The design rule is the same one you would apply to any public endpoint.",
          draw: function (ctx, w, h, k) {
            drawLayout(k, w, h, { a: "done", sys: "done", b: "call" });
            drawCard(k, w, h, "unexport, or guard + validate", "boundary restored", COL.system);
          }
        }
      ]
    });
  }

  function drawLayout(k, w, h, state) {
    k.clear();
    var appW = 176;
    var appH = 74;
    var ax = 30;
    var bx = 30;
    var topY = 52;
    var botY = h - 118;
    var sysW = Math.max(150, w - 360);
    var sysX = ax + appW + Math.max(40, (w - (2 * appW + 60) - sysW) / 2);
    var sysY = topY + (botY - topY) / 2 - 33;

    /* App A — the requester */
    k.box(ax, topY, appW, appH, { fill: COL.app.fill, stroke: COL.app.stroke, lw: 2, r: 10 });
    k.label(ax + 14, topY + 22, "App A", { size: 13, weight: "700", color: COL.app.text });
    k.label(ax + 14, topY + 41, "uid(A) · own sandbox", { size: 10.5, color: COL.dim, weight: "500" });
    k.label(ax + 14, topY + 58, "declares what it can use", { size: 10.5, color: COL.dim, weight: "500" });

    /* App B — the exported component */
    k.box(bx, botY, appW, appH, { fill: COL.other.fill, stroke: COL.other.stroke, lw: 2, r: 10 });
    k.label(bx + 14, botY + 22, "App B", { size: 13, weight: "700", color: COL.other.text });
    k.label(bx + 14, botY + 41, "uid(B) · exported component", { size: 10.5, color: COL.dim, weight: "500" });
    k.label(bx + 14, botY + 58, "guard(c) if declared", { size: 10.5, color: COL.dim, weight: "500" });

    /* The system — resolution and enforcement */
    k.box(sysX, sysY, sysW, 66, { fill: COL.system.fill, stroke: COL.system.stroke, lw: 2, r: 10 });
    k.label(sysX + sysW / 2, sysY + 24, "System server", { align: "center", size: 12.5, weight: "700", color: COL.system.text });
    k.label(sysX + sysW / 2, sysY + 44, "ActivityManager · PackageManager", { align: "center", size: 10.5, color: COL.dim, weight: "500" });

    k.arrow(ax + appW + 6, topY + 37, sysX - 6, sysY + 16, { color: COL.faint, lw: 1.6, dash: [4, 4] });
    k.label(ax + appW + 12, topY + 26, "1 IPC", { size: 10, mono: true, color: COL.faint });
    k.arrow(sysX - 6, sysY + 50, bx + appW + 6, botY + 37, { color: COL.faint, lw: 1.6, dash: [4, 4] });
    k.label(sysX - 96, botY + 24, "2 deliver", { size: 10, mono: true, color: COL.faint });

    /* The IPC state readout */
    k.box(w - 190, topY + 8, 166, 96, {
      fill: "rgba(148,163,184,0.08)",
      stroke: COL.line,
      lw: 1.5,
      dash: [5, 4],
      r: 10
    });
    k.label(w - 107, topY + 30, "IPC state", { align: "center", size: 10.5, mono: true, color: COL.dim });

    /* Actor state rings, so the active actor is never ambiguous */
    markState(k, { x: ax, y: topY, w: appW, h: appH }, state.a);
    markState(k, { x: bx, y: botY, w: appW, h: appH }, state.b);
    markState(k, { x: sysX, y: sysY, w: sysW, h: 66 }, state.sys);
  }

  function markState(k, box, state) {
    if (state === "call") {
      k.highlight(box.x - 5, box.y - 5, box.w + 10, box.h + 10, { color: COL.hot.stroke, lw: 2.4, dash: [6, 4], r: 13 });
    } else if (state === "stop") {
      k.highlight(box.x - 5, box.y - 5, box.w + 10, box.h + 10, { color: COL.stop.stroke, lw: 2.4, dash: [], r: 13 });
    } else if (state === "done") {
      k.highlight(box.x - 5, box.y - 5, box.w + 10, box.h + 10, { color: COL.system.stroke, lw: 1.6, dash: [2, 4], r: 13 });
    }
  }

  /* The frame-specific message shown inside the IPC state readout. */
  function drawCard(k, w, h, headline, sub, skin) {
    k.box(w - 184, 86, 154, 54, { fill: skin.fill, stroke: skin.stroke, lw: 1.8, r: 9 });
    k.label(w - 107, 106, headline, { align: "center", size: 11.5, mono: true, color: skin.text });
    k.label(w - 107, 126, sub, { align: "center", size: 10, weight: "500", color: COL.dim });
  }

  /* ── Stepper 3: the escalation chain ───────────────────────── */

  function initPrivescStepper() {
    var host = document.getElementById("ix-privesc");
    if (!host || !window.Interactive) return;

    var steps = [
      { label: "Sandboxed app", note: "unprivileged uid(A); the sandbox holds", tone: "start" },
      { label: "Reachable privileged component", note: "pre-installed or exported, holding more privilege than the app", tone: "step" },
      { label: "Trusts the caller's input", note: "no authentication of the caller and no validation of the data", tone: "step" },
      { label: "Privilege transfers", note: "the exploit runs with the component's identity, not the app's", tone: "hot" },
      { label: "Kernel memory-safety bug", note: "the last gate: a bug that turns borrowed privilege into kernel privilege", tone: "hot" },
      { label: "Root — the sandbox is gone", note: "every userspace control above the kernel becomes advisory", tone: "stop" }
    ];

    var chains = [
      { key: "guard", text: "unexport it, or require a permission" },
      { key: "auth", text: "validate the caller and the data" },
      { key: "patch", text: "patch quickly when the bug is found" }
    ];

    window.Interactive.stepper("ix-privesc", {
      title: "The escalation chain: from a sandboxed app to root",
      subtitle: "Nothing here needs a kernel bug until the last steps — the expensive escalations are borrowed trust.",
      height: 340,
      frames: [
        {
          title: "Frame 1 — the attacker holds only an app",
          caption: "An installed app has its own UID, its own files and its own permissions. Everything the sandbox promised is in force: it can reach nothing it did not declare and was not granted.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 0, null);
          }
        },
        {
          title: "Frame 2 — find the reachable component",
          caption: "The first step is not exploitation but enumeration: which component can this app actually reach, and how much privilege does that component hold? Export status and pre-installation are the two things that matter.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 1, null);
          }
        },
        {
          title: "Frame 3 — the component trusts its caller",
          caption: "The component performs a privileged action on caller-supplied data without authenticating the caller. This is where reach becomes capability: the interface is more public than its author assumed.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 2, null);
          }
        },
        {
          title: "Frame 4 — privilege transfers",
          caption: "The action executes under the component's identity. The attacker has not stolen a password or abused a permission: they have borrowed the component's privilege by asking it to act.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 3, "guard");
          }
        },
        {
          title: "Frame 5 — the last gate is the kernel",
          caption: "Borrowed privilege is still bounded by the kernel. Passing that bound needs a memory-safety bug or a similar flaw — the expensive step, and the reason prompt patching matters as much as careful interface design.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 4, "patch");
          }
        },
        {
          title: "Frame 6 — root, and the end of the model",
          caption: "At kernel privilege the sandbox, the permission gate and the signature check are all userspace policy evaluated by code that now runs at the attacker's privilege. This is what rooting means defensively: not one control defeated, but the model removed.",
          draw: function (ctx, w, h, k) {
            drawChain(k, w, h, 5, null);
          }
        }
      ]
    });

    function drawChain(k, w, h, active, cut) {
      k.clear();
      var gap = 10;
      var top = 14;
      var rowH = (h - top - 16 - (steps.length - 1) * gap) / steps.length;
      var x = 22;
      var width = Math.min(w - 214, 520);

      steps.forEach(function (step, i) {
        var y = top + i * (rowH + gap);
        var state = i === active ? "active" : i < active ? "done" : "todo";
        var skin =
          state === "active"
            ? step.tone === "stop"
              ? COL.stop
              : COL.hot
            : state === "done"
              ? COL.system
              : null;

        k.box(x, y, width, rowH, {
          fill: skin ? skin.fill : COL.card,
          stroke: skin ? skin.stroke : COL.line,
          lw: state === "active" ? 2.4 : 1.5,
          r: 9
        });
        k.dot(x + 22, y + rowH / 2, 12, {
          fill: state === "active" ? (step.tone === "stop" ? COL.stop.stroke : COL.hot.stroke) : state === "done" ? COL.system.stroke : COL.card,
          stroke: skin ? skin.stroke : COL.faint,
          lw: 1.5
        });
        k.label(x + 22, y + rowH / 2, String(i + 1), { align: "center", size: 10.5, mono: true, color: state ? "#ffffff" : COL.dim });
        k.label(x + 44, y + rowH / 2 - 8, step.label, {
          size: 12,
          color: state === "active" ? (step.tone === "stop" ? COL.stop.text : COL.hot.text) : COL.ink
        });
        k.label(x + 44, y + rowH / 2 + 9, step.note, { size: 10, weight: "500", color: COL.dim });
        if (i < steps.length - 1) {
          stageConnector(k, x + width / 2, y + rowH, y + rowH + gap);
        }
      });

      var note = cut ? chains.filter(function (c) { return c.key === cut; })[0] : null;
      if (note) {
        k.box(w - 184, h / 2 - 34, 160, 68, {
          fill: "rgba(5,150,105,0.08)",
          stroke: COL.system.stroke,
          lw: 1.6,
          r: 10
        });
        k.label(w - 104, h / 2 - 12, "control that removes it", { align: "center", size: 10.5, mono: true, color: COL.system.text });
        k.label(w - 104, h / 2 + 10, note.text, { align: "center", size: 10.5, weight: "500", color: COL.dim });
        k.arrow(x + width + 6, h / 2, w - 188, h / 2, { color: COL.system.stroke, lw: 1.6, dash: [4, 4] });
      } else {
        k.label(w - 24, 30, "reach \u2192 trust \u2192 borrow", { align: "right", size: 11, mono: true, color: COL.faint });
        k.label(w - 24, 50, "\u2192 kernel \u2192 root", { align: "right", size: 11, mono: true, color: COL.faint });
        k.label(w - 24, 80, "A chain is only as strong as", { align: "right", size: 10.5, color: COL.dim });
        k.label(w - 24, 98, "its weakest step.", { align: "right", size: 10.5, color: COL.dim });
      }
    }
  }
})();
