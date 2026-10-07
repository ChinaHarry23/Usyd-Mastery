(function () {
  "use strict";

  /* COMP5618 — Week 6 (Linux OS Introduction) page behaviour.
   *
   * The declarative widgets (hotspot, matcher, sequence, pipeline, race, deck)
   * are mounted by shared/interactive.js from the JSON config blocks in the
   * page. This file owns the two animated canvas steppers and the re-binding
   * that a language swap requires.
   */

  var C = {
    accent: "#e11d48",
    accentStrong: "#be123c",
    blue: "#2563eb",
    green: "#059669",
    purple: "#7c3aed",
    amber: "#f59e0b",
    text: "#141826",
    muted: "#565d75",
    dim: "#7b829a",
    line: "#cbd5e1",
    soft: "#fdf7f9"
  };

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initPermStepper();
    initEscalationStepper();
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
    initPermStepper();
    initEscalationStepper();
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
        window.console.error("[COMP5618 chapter 6] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* Shared drawing helper: one ten-character mode string at (x, y). */
  function drawModeString(k, x, y, chars, box) {
    var cell = box || 34;
    var gap = 3;
    var colours = [
      { fill: "#f1f5f9", stroke: C.dim },
      { fill: "#ffe4ea", stroke: C.accent },
      { fill: "#ffe4ea", stroke: C.accent },
      { fill: "#ffe4ea", stroke: C.accent },
      { fill: "#e8eefc", stroke: C.blue },
      { fill: "#e8eefc", stroke: C.blue },
      { fill: "#e8eefc", stroke: C.blue },
      { fill: "#eafaf3", stroke: C.green },
      { fill: "#eafaf3", stroke: C.green },
      { fill: "#eafaf3", stroke: C.green }
    ];
    for (var i = 0; i < chars.length; i++) {
      var cx = x + i * (cell + gap);
      k.box(cx, y, cell, 46, {
        fill: colours[i].fill,
        stroke: colours[i].stroke,
        lw: 1.6,
        r: 7
      });
      k.label(cx + cell / 2, y + 23, chars[i], {
        align: "center",
        size: 19,
        mono: true,
        weight: "700",
        color: C.text
      });
    }
    return x + chars.length * (cell + gap);
  }

  /* ── Stepper 1: decoding a permission string ─────────────────── */

  function initPermStepper() {
    var host = document.getElementById("ix-permbits");
    if (!host || !window.Interactive) return;
    if (host.dataset.mounted === "1") return;
    host.dataset.mounted = "1";

    window.Interactive.stepper("ix-permbits", {
      title: "Decoding a permission string",
      subtitle: "From the ten characters of ls -l to the identity a process runs with.",
      titleZh: "解读权限字符串",
      subtitleZh: "从 ls -l 的十个字符，到进程实际运行所依赖的身份。",
      height: 260,
      frames: [
        {
          title: "-rwxr-xr-x — one type character, then three triads",
          caption: "Position 1 says what the file is. Positions 2-10 split into owner, group and others, each with a read, a write and an execute slot.",
          titleZh: "-rwxr-xr-x —— 一个类型字符，随后三个三元组",
          captionZh: "第 1 位说明文件类型；第 2—10 位分为属主、属组和其他人，各含读、写、执行三个位置。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            var x0 = Math.max(24, (w - 10 * 37) / 2);
            drawModeString(k, x0, 52, ["-", "r", "w", "x", "r", "-", "x", "r", "-", "x"]);
            k.label(w / 2, 28, "ls -l shows type + owner + group + others", {
              align: "center",
              size: 11.5,
              mono: true,
              color: C.muted
            });
            k.label(x0 + 1.5 * 37, 122, "owner: rwx", { align: "center", size: 12, weight: "700", color: C.accentStrong });
            k.label(x0 + 4.5 * 37, 122, "group: r-x", { align: "center", size: 12, weight: "700", color: C.blue });
            k.label(x0 + 7.5 * 37, 122, "others: r-x", { align: "center", size: 12, weight: "700", color: C.green });
            k.label(x0 + 0.5 * 37, 122, "type", { align: "center", size: 12, weight: "700", color: C.dim });
            k.label(w / 2, 172, "A dash is a permission that is not granted — it is a decision, not a gap.", {
              align: "center",
              size: 11.5,
              color: C.muted
            });
            k.label(w / 2, 200, "The kernel checks these bits against the process's effective identity, not against who typed the command.", {
              align: "center",
              size: 11.5,
              color: C.muted
            });
            k.label(w / 2, 232, "rwx = 7   r-x = 5   r-- = 4   --- = 0", {
              align: "center",
              size: 12,
              mono: true,
              weight: "700",
              color: C.accentStrong
            });
          }
        },
        {
          title: "Who may do what — the file is world-readable and world-executable",
          caption: "Owner, group and others each get one row. A user who is neither the owner nor a member of the group falls through to the last row: read and execute only.",
          titleZh: "谁可以做什么 —— 该文件对所有人可读、可执行",
          captionZh: "属主、属组与其他用户各占一行。既非属主也不在属组中的用户落到最后一行：只能读取与执行。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            var rows = [
              { who: "owner (root)", perm: "r w x", ok: true, colour: C.accentStrong },
              { who: "group (root)", perm: "r - x", ok: true, colour: C.blue },
              { who: "others (you)", perm: "r - x", ok: true, colour: C.green }
            ];
            var y0 = 52;
            rows.forEach(function (r, i) {
              var y = y0 + i * 54;
              k.box(46, y, 190, 40, { fill: "#ffffff", stroke: r.colour, lw: 1.6, r: 8 });
              k.label(60, y + 20, r.who, { size: 12.5, weight: "700", color: r.colour });
              k.label(280, y + 20, r.perm, { size: 15, mono: true, weight: "700", color: C.text });
              k.label(420, y + 20, i === 2 ? "this is the row that applies to you" : "not your row", {
                size: 11.5,
                color: i === 2 ? C.accentStrong : C.dim
              });
            });
            k.label(w / 2, 218, "Write is granted to nobody here — the file cannot be changed by anyone but root.", {
              align: "center",
              size: 11.5,
              color: C.muted
            });
            k.label(w / 2, 240, "So the only interesting question left is what happens when it is executed.", {
              align: "center",
              size: 11.5,
              color: C.muted
            });
          }
        },
        {
          title: "-rwsr-xr-x — the s takes the owner's execute slot",
          caption: "Setuid is not an extra character. It replaces the x in the owner's triad, which is why the lecture tells you to look for an s where you expected an x.",
          titleZh: "-rwsr-xr-x —— s 占用了属主的执行位",
          captionZh: "setuid 并不是多出来的一个字符，而是替换了属主三元组中的 x——所以讲义让你注意本该是 x 的位置出现了 s。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            var x0 = Math.max(24, (w - 10 * 37) / 2);
            k.label(x0, 26, "no setuid", { size: 11.5, mono: true, color: C.dim });
            drawModeString(k, x0, 36, ["-", "r", "w", "x", "r", "-", "x", "r", "-", "x"]);
            k.label(x0, 116, "setuid set", { size: 11.5, mono: true, color: C.accentStrong });
            drawModeString(k, x0, 126, ["-", "r", "w", "s", "r", "-", "x", "r", "-", "x"]);
            k.highlight(x0 + 3 * 37 - 3, 124, 40, 50, { color: C.accent, lw: 2.4 });
            k.arrow(x0 + 3 * 37 + 17, 108, x0 + 3 * 37 + 17, 122, { color: C.accent, lw: 2 });
            k.label(x0 + 3 * 37 + 30, 104, "was x, now s", { size: 11.5, weight: "700", color: C.accentStrong });
            k.label(w / 2, 210, "Lower case s: setuid AND executable — the flag is live.", {
              align: "center",
              size: 12,
              color: C.text
            });
            k.label(w / 2, 234, "Upper case S: setuid but NOT executable — the flag is inert until someone adds x.", {
              align: "center",
              size: 12,
              color: C.muted
            });
          }
        },
        {
          title: "At exec time: euid becomes the file's owner, ruid does not change",
          caption: "The real identity stays yours; the effective identity is what the kernel authorises against. That single substitution is the whole mechanism.",
          titleZh: "exec 时：euid 变为文件属主，ruid 不变",
          captionZh: "真实身份仍是你自己，而内核据以授权的有效身份被替换——这一处替换就是整个机制。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            var cy = 108;
            k.box(30, cy - 48, 168, 96, { fill: "#ffffff", stroke: C.line, lw: 1.8, r: 10 });
            k.label(114, cy - 26, "before exec", { align: "center", size: 11.5, mono: true, color: C.dim });
            k.label(114, cy + 2, "ruid = alice", { align: "center", size: 12, mono: true, color: C.text });
            k.label(114, cy + 26, "euid = alice", { align: "center", size: 12, mono: true, color: C.text });

            k.arrow(206, cy, 292, cy, { color: C.accent, lw: 2.2 });
            k.label(249, cy - 16, "exec /bin/ping", { align: "center", size: 11, mono: true, color: C.accentStrong });
            k.label(249, cy + 18, "SUID = 1", { align: "center", size: 11, mono: true, weight: "700", color: C.accentStrong });

            k.box(w - 198, cy - 48, 168, 96, { fill: "#ffffff", stroke: C.accent, lw: 2.2, r: 10 });
            k.label(w - 114, cy - 26, "after exec", { align: "center", size: 11.5, mono: true, color: C.accentStrong });
            k.label(w - 114, cy + 2, "ruid = alice", { align: "center", size: 12, mono: true, color: C.muted });
            k.label(w - 114, cy + 26, "euid = root", { align: "center", size: 12.5, mono: true, weight: "700", color: C.accentStrong });

            k.label(w / 2, 200, "euid = owner(f) when SUID(f) = 1, otherwise euid = ruid.", {
              align: "center",
              size: 12.5,
              mono: true,
              weight: "700",
              color: C.text
            });
            k.label(w / 2, 228, "No password is involved at any point: the identity change comes from the file's mode bits.", {
              align: "center",
              size: 11.5,
              color: C.muted
            });
          }
        },
        {
          title: "Why that is a privilege boundary, not a detail",
          caption: "Anything the program can reach is now reachable with root's identity — including files the caller could never open.",
          titleZh: "为什么这是权限边界，而不是细节",
          captionZh: "程序能触及的一切，现在都以 root 身份触及——包括调用者原本永远打不开的文件。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            var files = ["/etc/shadow", "/root", "/etc/sudoers"];
            k.label(48, 40, "as alice, in a normal shell", { size: 12, weight: "700", color: C.muted });
            files.forEach(function (f, i) {
              var y = 60 + i * 42;
              k.box(48, y, 200, 32, { fill: "#ffffff", stroke: C.line, lw: 1.4, r: 7 });
              k.label(60, y + 16, f, { size: 11.5, mono: true, color: C.text });
              k.box(264, y + 5, 92, 22, { fill: "#e2e8f0", stroke: C.line, lw: 1.2, r: 11 });
              k.label(310, y + 16, "denied", { align: "center", size: 10.5, mono: true, color: C.muted });
            });

            k.label(w / 2 + 110, 40, "inside the setuid program", { align: "center", size: 12, weight: "700", color: C.accentStrong });
            files.forEach(function (f, i) {
              var y = 60 + i * 42;
              k.box(w / 2 + 30, y, 200, 32, { fill: "#ffffff", stroke: C.accent, lw: 1.6, r: 7 });
              k.label(w / 2 + 42, y + 16, f, { size: 11.5, mono: true, color: C.text });
              k.box(w / 2 + 246, y + 5, 92, 22, { fill: "#ffe4ea", stroke: C.accent, lw: 1.2, r: 11 });
              k.label(w / 2 + 292, y + 16, "allowed", { align: "center", size: 10.5, mono: true, weight: "700", color: C.accentStrong });
            });

            k.label(w / 2, 210, "The stronger the program's identity, the more damage a flaw in that program is worth.", {
              align: "center",
              size: 12,
              color: C.text
            });
            k.label(w / 2, 236, "That is why the lecture's first best practice is simply to limit how many setuid programs exist.", {
              align: "center",
              size: 11.5,
              color: C.muted
            });
          }
        },
        {
          title: "The defender's view: enumerate, then reduce",
          caption: "A setuid binary is only acceptable when it needs the bit, validates its input and cannot be made to run arbitrary commands.",
          titleZh: "防御者视角：先枚举，再削减",
          captionZh: "只有当某个 setuid 程序确实需要该位、做了输入校验、且无法被用来执行任意命令时，它才是可接受的。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            k.label(30, 30, "Enumerate", { size: 12.5, weight: "700", color: C.accentStrong });
            k.code(30, 56, [
              "find / -perm -4000 -type f -exec ls -l {} \\;",
              "find / -writable -type d 2>/dev/null",
              "sudo ./unix-privesc-check detailed | less"
            ], { size: 11.5, lh: 22, color: C.text });

            k.label(w / 2 + 20, 30, "Then apply the seven practices", { size: 12.5, weight: "700", color: C.blue });
            var items = [
              "Limit setuid-enabled programs",
              "Update and patch them",
              "Strict input validation and access control",
              "Periodic audits and vulnerability assessments",
              "Monitor system logs",
              "Real-time monitoring",
              "Least privilege"
            ];
            items.forEach(function (t, i) {
              k.label(w / 2 + 20, 58 + i * 22, "• " + t, { size: 11, color: C.muted });
            });

            k.label(w / 2, 236, "Fewer privileged programs is the only control that removes escalation paths instead of watching them.", {
              align: "center",
              size: 11.5,
              color: C.text
            });
          }
        }
      ]
    });
  }

  /* ── Stepper 2: the SUID-to-root escalation chain ────────────── */

  function initEscalationStepper() {
    var host = document.getElementById("ix-privesc-chain");
    if (!host || !window.Interactive) return;
    if (host.dataset.mounted === "1") return;
    host.dataset.mounted = "1";

    window.Interactive.stepper("ix-privesc-chain", {
      title: "From a web shell to root: one escalation chain",
      subtitle: "The Week 6 tutorial, drawn as a sequence of identity states. Conceptual and lab-scoped — no exploit code.",
      titleZh: "从 Web Shell 到 root：一条提权链",
      subtitleZh: "把第 6 周辅导课画成一连串身份状态。仅为概念性、限定在实验环境中的演示，不含任何利用代码。",
      height: 280,
      frames: [
        {
          title: "1 · The foothold is a service account, not root",
          caption: "The web server runs as www-data and the database daemon as mysql. A flaw in the web application therefore yields a shell inside a deliberately low-privilege account.",
          titleZh: "1 · 立足点是一个服务账户，而不是 root",
          captionZh: "Web 服务器以 www-data 运行，数据库守护进程以 mysql 运行。因此 Web 应用中的漏洞只会带来一个位于低权限账户内的 shell。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            var cy = 120;
            k.box(30, cy - 44, 150, 88, { fill: "#ffffff", stroke: C.purple, lw: 1.8, r: 10 });
            k.label(105, cy - 20, "attacker host", { align: "center", size: 11.5, mono: true, color: C.purple });
            k.label(105, cy + 6, "lab network only", { align: "center", size: 10.5, color: C.dim });
            k.label(105, cy + 26, "no credentials", { align: "center", size: 10.5, color: C.dim });

            k.arrow(190, cy, 300, cy, { color: C.dim, lw: 1.8, dash: [5, 4] });
            k.label(245, cy - 16, "HTTP request", { align: "center", size: 10.5, mono: true, color: C.muted });

            k.box(310, cy - 66, 220, 132, { fill: "#ffffff", stroke: C.accent, lw: 2, r: 12 });
            k.label(420, cy - 42, "vulnerable web app", { align: "center", size: 12, weight: "700", color: C.accentStrong });
            k.label(420, cy - 16, "nginx  →  www-data", { align: "center", size: 11.5, mono: true, color: C.text });
            k.label(420, cy + 10, "mysqld →  mysql", { align: "center", size: 11.5, mono: true, color: C.text });
            k.label(420, cy + 38, "contained by design", { align: "center", size: 11, color: C.green });

            k.label(w - 130, cy - 20, "least privilege", { align: "center", size: 11.5, weight: "700", color: C.green });
            k.label(w - 130, cy + 4, "keeps the blast", { align: "center", size: 11, color: C.muted });
            k.label(w - 130, cy + 22, "radius small", { align: "center", size: 11, color: C.muted });

            k.label(w / 2, 238, "This is the state the rest of the chain has to break out of.", {
              align: "center",
              size: 11.5,
              color: C.text
            });
          }
        },
        {
          title: "2 · The shell inherits that identity — and nothing more",
          caption: "whoami returns www-data. Every command typed now runs with the web server's privileges, so the root-owned parts of the filesystem are simply refused.",
          titleZh: "2 · shell 只继承该身份，别的什么也没有",
          captionZh: "whoami 返回 www-data。此后每条命令都以 Web 服务器的权限运行，因此文件系统中属于 root 的部分会被直接拒绝。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            k.box(40, 42, w - 80, 74, { fill: "#0d0f14", stroke: C.accent, lw: 1.6, r: 10 });
            k.code(60, 66, [
              "$ whoami",
              "www-data"
            ], { size: 13, lh: 24, color: "#c9d1d9" });

            k.box(40, 140, (w - 116) / 2, 74, { fill: "#ffffff", stroke: C.line, lw: 1.6, r: 10 });
            k.label(60, 164, "Reachable", { size: 12, weight: "700", color: C.green });
            k.label(60, 188, "/tmp, the web root, its own files", { size: 11, mono: true, color: C.muted });

            k.box(76 + (w - 116) / 2, 140, (w - 116) / 2, 74, { fill: "#ffffff", stroke: C.line, lw: 1.6, r: 10 });
            k.label(96 + (w - 116) / 2, 164, "Refused", { size: 12, weight: "700", color: C.accentStrong });
            k.label(96 + (w - 116) / 2, 188, "/etc/shadow, /root, package manager", { size: 11, mono: true, color: C.muted });

            k.label(w / 2, 246, "priv(child) ⊆ priv(parent): the shell cannot invent privilege for itself.", {
              align: "center",
              size: 12,
              mono: true,
              weight: "700",
              color: C.text
            });
          }
        },
        {
          title: "3 · Enumerate before escalating",
          caption: "The audit commands from the lecture come first: setuid files, writable directories, world-writable files, delegated sudo commands and scheduled tasks.",
          titleZh: "3 · 先枚举，再提权",
          captionZh: "先跑讲义中的审计命令：setuid 文件、可写目录、全局可写文件、被委托的 sudo 命令，以及计划任务。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            k.label(30, 28, "The four audit questions", { size: 12.5, weight: "700", color: C.accentStrong });
            k.code(30, 58, [
              { text: "find / -perm -4000 -type f -exec ls -l {} \\;", color: C.text },
              { text: "find / -writable -type d 2>/dev/null", color: C.text },
              { text: "find / -perm -2 -type f -exec ls -l {} \\;", color: C.text },
              { text: "sudo -l   /   cat /etc/crontab", color: C.text }
            ], { size: 11.5, lh: 24 });

            var rows = [
              ["SUID files", "which privileged program can run commands?"],
              ["Writable dirs", "where could a helper be planted?"],
              ["World-writable files", "what can be modified by anyone?"],
              ["sudo and cron", "what is already delegated, and to whom?"]
            ];
            rows.forEach(function (r, i) {
              var y = 158 + i * 26;
              k.box(w / 2 + 20, y - 11, 128, 22, { fill: "#ffe4ea", stroke: C.accent, lw: 1.1, r: 6 });
              k.label(w / 2 + 32, y, r[0], { size: 10.5, mono: true, color: C.accentStrong });
              k.label(w / 2 + 160, y, r[1], { size: 10.5, color: C.muted });
            });

            k.label(w / 2, 268, "Enumeration is the same work whether you are attacking the host or defending it.", {
              align: "center",
              size: 11.5,
              color: C.text
            });
          }
        },
        {
          title: "4 · The vector: a root-owned setuid helper",
          caption: "One file satisfies both conditions at once — owned by root, and carrying the s bit. Executing it sets euid to 0 before the program's first instruction runs.",
          titleZh: "4 · 向量：一个属主为 root 的 setuid 辅助程序",
          captionZh: "一个文件同时满足两个条件——属主是 root，且带有 s 位。执行它时，在程序第一条指令运行之前，euid 就已被设为 0。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            var x0 = Math.max(30, (w - 10 * 37) / 2);
            k.label(x0, 30, "/tmp/escalate", { size: 12.5, mono: true, weight: "700", color: C.text });
            drawModeString(k, x0, 42, ["-", "r", "w", "s", "r", "-", "x", "r", "-", "x"]);
            k.highlight(x0 + 3 * 37 - 3, 40, 40, 50, { color: C.accent, lw: 2.4 });

            k.label(w / 2, 130, "owner: root          group: users          the s bit is set", {
              align: "center",
              size: 12,
              mono: true,
              color: C.accentStrong
            });

            k.box(w / 2 - 210, 158, 200, 72, { fill: "#ffffff", stroke: C.line, lw: 1.6, r: 10 });
            k.label(w / 2 - 110, 182, "why a compiled binary?", { align: "center", size: 11.5, weight: "700", color: C.text });
            k.label(w / 2 - 110, 206, "most kernels ignore SUID on scripts", { align: "center", size: 10.5, color: C.muted });

            k.box(w / 2 + 10, 158, 200, 72, { fill: "#ffffff", stroke: C.accent, lw: 1.8, r: 10 });
            k.label(w / 2 + 110, 182, "what it does", { align: "center", size: 11.5, weight: "700", color: C.accentStrong });
            k.label(w / 2 + 110, 206, "drops to the owner and runs a script", { align: "center", size: 10.5, color: C.muted });

            k.label(w / 2, 256, "Individually each attribute is unremarkable. Together they are the vulnerability.", {
              align: "center",
              size: 11.5,
              color: C.text
            });
          }
        },
        {
          title: "5 · The identity change happens, then the payload runs",
          caption: "The helper hands control to an interpreter, which runs a script. Because euid is already 0, the script and everything it starts are root.",
          titleZh: "5 · 先发生身份切换，随后载荷才开始运行",
          captionZh: "辅助程序把控制权交给解释器，解释器再运行脚本。由于 euid 已经是 0，脚本及其启动的一切都以 root 运行。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            var cy = 116;
            var boxes = [
              { x: 24, w: 148, t: "www-data shell", s: "euid = 33", c: C.muted },
              { x: 24 + 172, w: 148, t: "/tmp/escalate", s: "SUID, owner root", c: C.accent },
              { x: 24 + 344, w: 148, t: "/bin/bash", s: "euid = 0", c: C.accentStrong },
              { x: 24 + 516, w: 148, t: "im_root.sh", s: "runs as root", c: C.accentStrong }
            ];
            boxes.forEach(function (b, i) {
              k.box(b.x, cy - 40, b.w, 80, { fill: "#ffffff", stroke: b.c, lw: 1.8, r: 10 });
              k.label(b.x + b.w / 2, cy - 12, b.t, { align: "center", size: 11, mono: true, weight: "700", color: b.c });
              k.label(b.x + b.w / 2, cy + 14, b.s, { align: "center", size: 10.5, mono: true, color: C.muted });
              if (i < boxes.length - 1) {
                k.arrow(b.x + b.w + 4, cy, b.x + b.w + 20, cy, { color: C.dim, lw: 1.8 });
              }
            });

            k.label(w / 2, 200, "The attacker never supplies a password, and never needs one.", {
              align: "center",
              size: 12,
              color: C.text
            });
            k.label(w / 2, 228, "The mechanism supplies the identity; the script only decides what to do with it.", {
              align: "center",
              size: 11.5,
              color: C.muted
            });
            k.label(w / 2, 256, "That is why the lecture's defences target the mechanism, not the payload.", {
              align: "center",
              size: 11.5,
              color: C.muted
            });
          }
        },
        {
          title: "6 · Verification: whoami now returns root",
          caption: "The listening session on the attacker's own host receives a connection from the VM, and the command that comes back identifies as root. That is full control of the machine.",
          titleZh: "6 · 验证：whoami 现在返回 root",
          captionZh: "攻击者主机上的监听会话收到来自虚拟机的连接，返回的命令身份为 root。这就意味着完全控制了该机器。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            k.box(40, 40, w - 80, 92, { fill: "#0d0f14", stroke: C.accent, lw: 1.6, r: 10 });
            k.code(60, 68, [
              { text: "$ nc -vvlp <lab port>", color: "#8b949e" },
              { text: "connect to ... from 192.168.56.x", color: "#8b949e" },
              { text: "$ whoami", color: "#c9d1d9" },
              { text: "root", color: "#ff8fa3" }
            ], { size: 12.5, lh: 22 });

            k.box(40, 152, (w - 100) / 2, 72, { fill: "#ffffff", stroke: C.line, lw: 1.6, r: 10 });
            k.label(60, 178, "What was gained", { size: 12, weight: "700", color: C.accentStrong });
            k.label(60, 202, "root privileges, without the root password", { size: 10.5, color: C.muted });

            k.box(60 + (w - 100) / 2, 152, (w - 100) / 2, 72, { fill: "#ffffff", stroke: C.line, lw: 1.6, r: 10 });
            k.label(80 + (w - 100) / 2, 178, "What was not gained", { size: 12, weight: "700", color: C.blue });
            k.label(80 + (w - 100) / 2, 202, "persistence by itself — that needs cron or a rootkit", { size: 10.5, color: C.muted });

            k.label(w / 2, 254, "Anything the script contains now executes as root, on every execution.", {
              align: "center",
              size: 11.5,
              color: C.text
            });
          }
        },
        {
          title: "7 · The same chain, read as a defender",
          caption: "Five detection points map onto five controls. No single one is sufficient, which is why the hardening checklist is a list rather than a silver bullet.",
          titleZh: "7 · 以防御者视角重读同一条链",
          captionZh: "五个检测点对应五项控制措施。任何单独一项都不充分——这正是安全加固清单是一份清单、而不是银弹的原因。",
          draw: function (ctx, w, h, k) {
            k.clear(C.soft);
            var rows = [
              ["SUID binary appears in a writable directory", "audit with find -perm -4000"],
              ["root-owned executable outside package records", "integrity checks: Tripwire or AIDE"],
              ["web server process spawns a shell", "application logs and process monitoring"],
              ["server makes an outbound connection", "NIDS: Snort or Suricata"],
              ["a setuid binary that has no business existing", "limit setuid-enabled programs"]
            ];
            k.label(30, 28, "Detection point", { size: 11.5, mono: true, color: C.accentStrong });
            k.label(w / 2 + 30, 28, "Control that closes it", { size: 11.5, mono: true, color: C.green });
            rows.forEach(function (r, i) {
              var y = 58 + i * 34;
              k.box(30, y - 13, w / 2 - 60, 26, { fill: "#ffffff", stroke: C.line, lw: 1.3, r: 7 });
              k.label(42, y, r[0], { size: 10.5, color: C.text });
              k.box(w / 2 + 30, y - 13, w / 2 - 60, 26, { fill: "#eafaf3", stroke: C.green, lw: 1.3, r: 7 });
              k.label(w / 2 + 42, y, r[1], { size: 10.5, color: C.text });
            });
            k.label(w / 2, 256, "Detection buys time; removing the mechanism removes the path.", {
              align: "center",
              size: 11.5,
              weight: "700",
              color: C.text
            });
          }
        }
      ]
    });
  }
})();
