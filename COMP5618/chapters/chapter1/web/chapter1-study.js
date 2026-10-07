(function () {
  "use strict";

  /* COMP5618 — Week 1 page behaviour.
   *
   * The declarative widgets (deck, matcher, sequence, hotspot, race) are
   * mounted by shared/interactive.js from the JSON config blocks in the page.
   * This file owns the two animated canvas steppers that carry the visual
   * argument of the chapter: the isolated lab built in Tutorial 1, and the
   * penetration-testing chain the unit runs end to end.
   *
   * Nothing here reaches the network, and every example is a lab-scoped
   * diagram — the chapter deliberately contains no runnable exploit material.
   */

  var PALETTE = {
    crimson: "#e11d48",
    crimsonSoft: "rgba(225,29,72,0.12)",
    rose: "#fb7185",
    blue: "#2563eb",
    blueSoft: "rgba(37,99,235,0.10)",
    purple: "#7c3aed",
    green: "#059669",
    greenSoft: "rgba(5,150,105,0.12)",
    amber: "#f59e0b",
    amberSoft: "rgba(245,158,11,0.14)",
    slate: "#64748b",
    line: "#94a3b8",
    dim: "#565d75",
    faint: "rgba(148,163,184,0.55)",
    white: "#ffffff"
  };

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initLabStepper();
    initAttackStepper();
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
    initLabStepper();
    initAttackStepper();
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
        window.console.error("[COMP5618 chapter 1] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared geometry for the lab stepper ────────────────────── */

  function labLayout(w, h) {
    var frameX = 20;
    var frameY = 30;
    var frameW = w - 40;
    var frameH = h - 46;
    var vmY = frameY + 40;
    var vmH = Math.max(48, frameH - 66);
    var pad = 18;
    var gap = 26;
    var vmW = (frameW - pad * 2 - gap) / 2;
    var swY = frameY + frameH - 34;
    var swH = 22;
    return {
      frameX: frameX,
      frameY: frameY,
      frameW: frameW,
      frameH: frameH,
      vmY: vmY,
      vmH: vmH,
      vmW: vmW,
      swX: frameX + pad,
      swY: swY,
      swW: frameW - pad * 2,
      swH: swH,
      kaliX: frameX + pad,
      ubuX: frameX + pad + vmW + gap,
      swCenterY: swY + swH / 2,
      labelY: frameY + frameH - 12
    };
  }

  function drawVm(k, x, y, bw, bh, name, sub, accent, fill, dark) {
    k.box(x, y, bw, bh, { fill: fill, stroke: accent, lw: 2, r: 10 });
    k.label(x + 12, y + 20, name, { size: 13, weight: "700", color: dark });
    k.label(x + 12, y + 39, sub, { size: 10.5, mono: true, color: PALETTE.dim });
  }

  function nicBox(k, x, y, bw, text) {
    k.box(x, y, bw, 22, { fill: PALETTE.white, stroke: PALETTE.line, lw: 1.3, r: 6 });
    k.label(x + bw / 2, y + 11, text, {
      align: "center",
      size: 9.5,
      mono: true,
      color: PALETTE.dim
    });
  }

  /* ── Stepper 1: the isolated lab from Tutorial 1 ─────────────── */

  function initLabStepper() {
    var host = document.getElementById("ix-lab");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-lab", {
      title: "Building the isolated lab",
      subtitle:
        "Tutorial 1 in five frames: install the hypervisor, segment the network, verify reachability, encrypt the disk, and prove the path before you touch a tool.",
      height: 300,
      frames: [
        {
          title: "One host, two guests",
          caption:
            "VirtualBox is installed on your own device and runs two guests: Kali as the attacker workstation and Ubuntu as the target. Everything the unit does happens between these two machines and nowhere else.",
          draw: function (ctx, w, h, k) {
            var L = labLayout(w, h);
            k.clear();
            k.box(L.frameX, L.frameY, L.frameW, L.frameH, {
              stroke: PALETTE.crimson,
              lw: 2,
              r: 14,
              fill: "rgba(225,29,72,0.03)"
            });
            k.label(L.frameX + 14, L.frameY + 18, "your device — the hypervisor host", {
              size: 11.5,
              mono: true,
              color: PALETTE.crimson
            });
            drawVm(
              k,
              L.kaliX,
              L.vmY,
              L.vmW,
              L.vmH,
              "KALI LINUX",
              "attacker workstation",
              PALETTE.crimson,
              PALETTE.crimsonSoft,
              "#9f1239"
            );
            drawVm(
              k,
              L.ubuX,
              L.vmY,
              L.vmW,
              L.vmH,
              "UBUNTU",
              "target host",
              PALETTE.blue,
              PALETTE.blueSoft,
              "#1e40af"
            );
          }
        },
        {
          title: "Segment the network: host-only adapter",
          caption:
            "Both guests get an extra NIC set to host-only adapter. The guests can reach each other, but that path has no route to the internet or to anyone else's machine — which is exactly what makes it safe to attack.",
          draw: function (ctx, w, h, k) {
            var L = labLayout(w, h);
            k.clear();
            k.box(L.frameX, L.frameY, L.frameW, L.frameH, {
              stroke: PALETTE.crimson,
              lw: 2,
              r: 14,
              fill: "rgba(225,29,72,0.03)"
            });
            k.label(L.frameX + 14, L.frameY + 18, "your device", {
              size: 11.5,
              mono: true,
              color: PALETTE.crimson
            });
            k.box(L.swX, L.swY, L.swW, L.swH, {
              fill: PALETTE.amberSoft,
              stroke: PALETTE.amber,
              lw: 1.8,
              r: 8
            });
            k.label(L.swX + 10, L.swCenterY, "host-only network", {
              size: 10.5,
              mono: true,
              color: "#92400e"
            });

            var nicY = L.vmY + L.vmH - 30;
            var nicW = L.vmW - 48;
            drawVm(
              k,
              L.kaliX,
              L.vmY,
              L.vmW,
              L.vmH,
              "KALI LINUX",
              "10.0.2.10",
              PALETTE.crimson,
              PALETTE.crimsonSoft,
              "#9f1239"
            );
            drawVm(
              k,
              L.ubuX,
              L.vmY,
              L.vmW,
              L.vmH,
              "UBUNTU",
              "10.0.2.20",
              PALETTE.blue,
              PALETTE.blueSoft,
              "#1e40af"
            );
            nicBox(k, L.kaliX + 24, nicY, nicW, "host-only adapter");
            nicBox(k, L.ubuX + 24, nicY, nicW, "host-only adapter");
            k.arrow(L.kaliX + L.vmW / 2, L.vmY + L.vmH + 6, L.swX + L.swW * 0.3, L.swY - 2, {
              color: PALETTE.amber,
              lw: 1.6
            });
            k.arrow(L.ubuX + L.vmW / 2, L.vmY + L.vmH + 6, L.swX + L.swW * 0.7, L.swY - 2, {
              color: PALETTE.amber,
              lw: 1.6
            });
            k.label(L.swX + L.swW, L.swY - 32, "no bridge, no NAT — the path stops here", {
              align: "right",
              size: 10.5,
              color: PALETTE.dim
            });
          }
        },
        {
          title: "Verify before you attack: ifconfig, then ping",
          caption:
            "Read the addresses with ifconfig on both guests, then ping in each direction. When capture is running you can watch one ICMP exchange cross the host-only link and come back, which is the proof that the wire you are about to study is the wire you built.",
          draw: function (ctx, w, h, k) {
            var L = labLayout(w, h);
            k.clear();
            k.box(L.frameX, L.frameY, L.frameW, L.frameH, {
              stroke: "rgba(148,163,184,0.6)",
              lw: 1.6,
              r: 14
            });
            k.label(L.frameX + 14, L.frameY + 18, "the same two machines, now talking", {
              size: 11.5,
              mono: true,
              color: PALETTE.dim
            });
            drawVm(
              k,
              L.kaliX,
              L.vmY,
              L.vmW,
              L.vmH,
              "KALI",
              "10.0.2.10",
              PALETTE.crimson,
              PALETTE.crimsonSoft,
              "#9f1239"
            );
            drawVm(
              k,
              L.ubuX,
              L.vmY,
              L.vmW,
              L.vmH,
              "UBUNTU",
              "10.0.2.20",
              PALETTE.blue,
              PALETTE.blueSoft,
              "#1e40af"
            );
            var yA = L.vmY + Math.round(L.vmH * 0.42);
            var yB = L.vmY + Math.round(L.vmH * 0.74);
            k.arrow(L.kaliX + L.vmW + 4, yA, L.ubuX - 4, yA, { color: PALETTE.crimson, lw: 2 });
            k.label((L.kaliX + L.vmW + L.ubuX) / 2, yA - 12, "ICMP echo request", {
              align: "center",
              size: 10.5,
              mono: true,
              color: PALETTE.crimson
            });
            k.arrow(L.ubuX - 4, yB, L.kaliX + L.vmW + 4, yB, { color: PALETTE.blue, lw: 2 });
            k.label((L.kaliX + L.vmW + L.ubuX) / 2, yB + 14, "ICMP echo reply", {
              align: "center",
              size: 10.5,
              mono: true,
              color: PALETTE.blue
            });
            k.label(L.frameX + L.frameW - 4, L.labelY, "captured on the host-only interface", {
              align: "right",
              size: 10.5,
              color: PALETTE.dim
            });
          }
        },
        {
          title: "Encrypt the disk and the swap",
          caption:
            "LUKS sits above the volume group: one encrypted container holding root, swap and home as logical volumes. The slides are explicit that this is required — a laptop holding a semester of hostile traffic does not get to be readable at rest.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var x = Math.max(20, w * 0.16);
            var bw = Math.min(w - 40, (w - 40) * 0.68);

            k.box(x, 26, bw, 42, {
              fill: "rgba(100,116,139,0.10)",
              stroke: PALETTE.line,
              lw: 1.6,
              r: 8
            });
            k.label(x + 14, 42, "sdb1", { size: 12, mono: true, color: PALETTE.slate });
            k.label(x + 14, 58, "regular, unencrypted files (optional)", {
              size: 10.5,
              color: PALETTE.dim
            });

            k.box(x, 78, bw, 42, {
              fill: PALETTE.blueSoft,
              stroke: PALETTE.blue,
              lw: 1.6,
              r: 8
            });
            k.label(x + 14, 94, "sdb2", { size: 12, mono: true, color: PALETTE.blue });
            k.label(x + 14, 110, "boot partition — what makes the container below decryptable", {
              size: 10.5,
              color: PALETTE.dim
            });

            var outerY = 130;
            var outerH = Math.max(110, h - outerY - 16);
            k.box(x, outerY, bw, outerH, {
              fill: "rgba(225,29,72,0.04)",
              stroke: PALETTE.crimson,
              lw: 2,
              r: 10
            });
            k.label(x + 14, outerY + 18, "sdb4 — LUKS encrypted partition", {
              size: 12,
              mono: true,
              color: PALETTE.crimson
            });
            k.arrow(x + 30, outerY + 34, x + 56, outerY + 52, { color: PALETTE.line, lw: 1.4 });
            k.label(x + 62, outerY + 50, "unlocked with a passphrase, then handed to LVM", {
              size: 10.5,
              color: PALETTE.dim
            });

            var lvY = outerY + 66;
            var lvH = Math.max(30, (outerH - 78) / 3 - 6);
            var lvW = bw - 56;
            var lvX = x + 28;
            [
              ["volgroup-rootvol", "your operating system", PALETTE.crimson],
              ["volgroup-swapvol", "swap — encrypt this too", PALETTE.amber],
              ["volgroup-homevol", "your files", PALETTE.purple]
            ].forEach(function (row, i) {
              var ly = lvY + i * (lvH + 6);
              k.box(lvX, ly, lvW, lvH, { fill: PALETTE.white, stroke: row[2], lw: 1.4, r: 6 });
              k.label(lvX + 10, ly + lvH / 2, row[0], {
                size: 10.5,
                mono: true,
                color: row[2]
              });
              k.label(lvX + lvW - 10, ly + lvH / 2, row[1], {
                align: "right",
                size: 10,
                color: PALETTE.dim
              });
            });
          }
        },
        {
          title: "Prove it, then submit it",
          caption:
            "The tutorial is marked from a short screencast: show both addresses, show the guests pinging each other, show an SSH login from Kali into Ubuntu, show a file moved with scp, and explain the difference between a TCP ACK scan and an Xmas scan while the capture runs.",
          draw: function (ctx, w, h, k) {
            k.clear();
            var items = [
              ["1", "Addresses on both guests", "ifconfig on Kali and on Ubuntu"],
              ["2", "Reachability", "ping each way, and capture it"],
              ["3", "Remote login", "ssh from Kali into Ubuntu"],
              ["4", "File transfer", "scp a file across, then check it"],
              ["5", "Explain the scans", "ACK vs Xmas, with the capture on screen"]
            ];
            var top = 22;
            var rowH = Math.max(38, (h - 44) / items.length);
            items.forEach(function (row, i) {
              var y = top + i * rowH;
              k.box(24, y, w - 48, rowH - 8, {
                fill: i === items.length - 1 ? PALETTE.greenSoft : "rgba(148,163,184,0.09)",
                stroke: i === items.length - 1 ? PALETTE.green : "rgba(148,163,184,0.5)",
                lw: 1.4,
                r: 8
              });
              k.dot(46, y + (rowH - 8) / 2, 12, {
                fill: PALETTE.white,
                stroke: i === items.length - 1 ? PALETTE.green : PALETTE.line,
                lw: 1.6
              });
              k.label(46, y + (rowH - 8) / 2, row[0], {
                align: "center",
                size: 11,
                mono: true,
                color: i === items.length - 1 ? PALETTE.green : PALETTE.slate
              });
              k.label(70, y + (rowH - 8) / 2 - 7, row[1], { size: 12, color: "#141826" });
              k.label(70, y + (rowH - 8) / 2 + 9, row[2], {
                size: 10.5,
                mono: true,
                color: PALETTE.dim
              });
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: the penetration-testing chain ────────────────── */

  var CHAIN = [
    {
      id: "RECON",
      label: "Reconnaissance",
      detail: "Learn the target before you touch it",
      accent: PALETTE.blue,
      fill: PALETTE.blueSoft,
      prompt: "the questions you answer first",
      questions: [
        ["Scope", "which systems, which IPs, which hours?"],
        ["Surface", "what is exposed, and who owns it?"],
        ["Rules", "what is the stop condition?"]
      ],
      caption:
        "Reconnaissance is where the written authorisation is read a second time. Everything after this frame is only lawful because this frame happened first."
    },
    {
      id: "SCAN",
      label: "Scanning",
      detail: "Discover live hosts and open ports",
      accent: PALETTE.blue,
      fill: PALETTE.blueSoft,
      prompt: "what the scan is allowed to be",
      questions: [
        ["Targets", "only the addresses inside the scope"],
        ["Timing", "gentle enough not to disrupt service"],
        ["Output", "a list of reachable services to investigate"]
      ],
      caption:
        "Tutorial 1 scans the Ubuntu guest and finds port 22 open. On a real engagement the same output is the first evidence you will have to defend in the report."
    },
    {
      id: "ENUMERATE",
      label: "Enumeration",
      detail: "Ask each open service what it is",
      accent: PALETTE.purple,
      fill: "rgba(124,58,237,0.10)",
      prompt: "what you are trying to establish",
      questions: [
        ["Versions", "software and version behind the port"],
        ["Behaviour", "what the service does with unexpected input"],
        ["Access", "is authentication even required?"]
      ],
      caption:
        "Enumeration is the frame that separates a script kiddie from a tester: running a tool is scanning, understanding what came back is enumeration."
    },
    {
      id: "ACCESS",
      label: "Gaining access",
      detail: "Turn a weakness into a foothold",
      accent: PALETTE.crimson,
      fill: PALETTE.crimsonSoft,
      prompt: "what makes this step defensible",
      questions: [
        ["Permission", "in scope, in writing, in the agreed window"],
        ["Least force", "the smallest step that proves the finding"],
        ["Containment", "no data read or copied beyond the proof"]
      ],
      caption:
        "The exploit itself is the shortest part of the engagement. The unit's own assignment brief asks you to explain how you got in rather than to demonstrate that you can."
    },
    {
      id: "ESCALATE",
      label: "Privilege escalation",
      detail: "Establish how far the foothold reaches",
      accent: PALETTE.amber,
      fill: PALETTE.amberSoft,
      prompt: "why this frame matters to the client",
      questions: [
        ["Reach", "which accounts and files are now exposed?"],
        ["Evidence", "what would an auditor find in the logs?"],
        ["Blast radius", "what the impact statement will say"]
      ],
      caption:
        "Escalation is what converts 'a service is misconfigured' into a business impact, and it is why the assignment asks you to communicate findings to management."
    },
    {
      id: "REPORT",
      label: "Reporting",
      detail: "Return the finding, not just the flag",
      accent: PALETTE.green,
      fill: PALETTE.greenSoft,
      prompt: "what the deliverable must contain",
      questions: [
        ["Finding", "what was wrong, in plain language"],
        ["Impact", "what it would cost if someone else found it"],
        ["Fix", "what to change, and how to verify the change"]
      ],
      caption:
        "A finding nobody can act on is not a finding. Reporting is the deliverable the unit actually marks, in the incident review and in the penetration-test assignment alike."
    }
  ];

  function chainLayout(w, h) {
    var pad = 18;
    var gap = 10;
    var chipW = (w - pad * 2 - gap * (CHAIN.length - 1)) / CHAIN.length;
    var chipY = 72;
    var chipH = 34;
    var panelY = chipY + chipH + 20;
    return {
      pad: pad,
      gap: gap,
      chipW: chipW,
      chipY: chipY,
      chipH: chipH,
      panelY: panelY,
      panelH: Math.max(80, h - panelY - 52)
    };
  }

  function chainIndex(cfg) {
    for (var i = 0; i < CHAIN.length; i++) {
      if (CHAIN[i].id === cfg) return i;
    }
    return 0;
  }

  function drawChain(ctx, w, h, k, cfg) {
    var L = chainLayout(w, h);
    var at = chainIndex(cfg);

    k.clear();
    k.label(L.pad, 24, "recon → scan → enumerate → access → escalate → report", {
      size: 11,
      mono: true,
      color: PALETTE.dim
    });
    k.box(L.pad, 36, w - L.pad * 2, 4, { fill: "rgba(148,163,184,0.35)", r: 2 });
    k.box(L.pad, 36, ((w - L.pad * 2) / (CHAIN.length - 1)) * at, 4, {
      fill: PALETTE.crimson,
      r: 2
    });

    CHAIN.forEach(function (step, i) {
      var x = L.pad + i * (L.chipW + L.gap);
      var active = i === at;
      var done = i < at;
      k.box(x, L.chipY, L.chipW, L.chipH, {
        fill: active ? step.fill : done ? "rgba(148,163,184,0.10)" : PALETTE.white,
        stroke: active ? step.accent : "rgba(148,163,184,0.55)",
        lw: active ? 2 : 1.2,
        r: 8
      });
      k.label(x + L.chipW / 2, L.chipY + 13, step.id, {
        align: "center",
        size: 9.5,
        mono: true,
        color: active ? step.accent : PALETTE.slate
      });
      k.label(x + L.chipW / 2, L.chipY + 26, String(i + 1), {
        align: "center",
        size: 9,
        color: PALETTE.dim
      });
      if (i < CHAIN.length - 1) {
        k.arrow(x + L.chipW + 1, L.chipY + L.chipH / 2, x + L.chipW + L.gap - 1, L.chipY + L.chipH / 2, {
          color: PALETTE.line,
          lw: 1.2,
          head: 5
        });
      }
    });

    var step = CHAIN[at];
    k.box(L.pad, L.panelY, w - L.pad * 2, L.panelH, {
      fill: step.fill,
      stroke: step.accent,
      lw: 1.6,
      r: 10
    });
    k.label(L.pad + 16, L.panelY + 24, step.label, {
      size: 15,
      weight: "700",
      color: "#141826"
    });
    k.label(L.pad + 16, L.panelY + 44, step.detail, { size: 11, color: PALETTE.dim });
    k.label(L.pad + 16, L.panelY + 70, step.prompt + ":", {
      size: 11,
      mono: true,
      color: step.accent
    });

    var rowY = L.panelY + 92;
    var rowH = 20;
    step.questions.forEach(function (q, i) {
      var y = rowY + i * rowH;
      if (y + 12 > L.panelY + L.panelH) return;
      k.label(L.pad + 26, y, "•", { size: 12, color: step.accent });
      k.label(L.pad + 40, y, q[0], { size: 11.5, weight: "700", color: "#141826" });
      k.label(L.pad + 118, y, "— " + q[1], { size: 11, color: PALETTE.dim });
    });
  }

  function initAttackStepper() {
    var host = document.getElementById("ix-chain");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-chain", {
      title: "The penetration-testing chain",
      subtitle:
        "Six frames, one continuous procedure. This is the shape of the incident review, of the Week 10 assignment, and of the exam question that asks you to order a methodology.",
      height: 320,
      frames: CHAIN.map(function (step) {
        return {
          title: step.label + " — " + step.detail,
          caption: step.caption,
          draw: function (ctx, w, h, k) {
            drawChain(ctx, w, h, k, step.id);
          }
        };
      })
    });
  }
})();
