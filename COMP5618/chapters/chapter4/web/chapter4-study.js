(function () {
  "use strict";

  /* COMP5618 — Week 4 page behaviour.
   *
   * The declarative widgets (sequence, matcher, hotspot, deck, pipeline) are
   * mounted by shared/interactive.js from the JSON config blocks in the pages.
   * This file owns the two animated canvas walkthroughs — the life of an HTTP
   * request, and how a query stops filtering anything — plus the re-binding
   * that a language swap requires.
   */

  document.addEventListener("DOMContentLoaded", function () {
    /* Own widgets first: the shared chrome is presentation-only, and a failure
     * in it must not stop the page's own animations from mounting. */
    initRequestWalkthrough();
    initFilterStepper();
    initInjectionWalkthrough();
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
    initRequestWalkthrough();
    initFilterStepper();
    initInjectionWalkthrough();
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
    if (!window.initCOMP5618ChapterUI) return;
    try {
      window.initCOMP5618ChapterUI();
    } catch (err) {
      if (window.console && window.console.error) {
        window.console.error("[COMP5618 chapter 4] chapter chrome failed to initialise:", err);
      }
    }
  }

  /* ── Shared palette + drawing helpers ───────────────────────── */

  var ACCENT = "#e11d48";
  var BLUE = "#2563eb";
  var PURPLE = "#7c3aed";
  var GREEN = "#059669";
  var AMBER = "#f59e0b";
  var SLATE = "#94a3b8";
  var MUTED = "#565d75";
  var INK = "#141826";

  /* A plain line without an arrowhead. The ctx kit's arrow() always draws a
     head, so lifelines and connectors are stroked directly on the canvas. */
  function line(ctx, x1, y1, x2, y2, color, lw) {
    ctx.save();
    ctx.strokeStyle = color || "rgba(148,163,184,0.7)";
    ctx.lineWidth = lw || 1.2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  /* Four lifelines laid out across the canvas: client, web server, app server
     and database. Both walkthroughs draw relative to these positions so the two
     steppers stay visually consistent. */
  function lifelines(ctx, k, w, h) {
    var names = zh()
      ? ["客户端", "Web 服务器", "应用服务器", "数据库"]
      : ["Client", "Web server", "App server", "Database"];
    var colors = [ACCENT, BLUE, GREEN, AMBER];
    var xs = [0, 1, 2, 3].map(function (i) {
      return w * (0.14 + i * 0.24);
    });
    var boxW = Math.max(80, Math.min(132, w * 0.2));
    var boxH = 30;
    var top = 12;
    xs.forEach(function (x, i) {
      k.box(x - boxW / 2, top, boxW, boxH, {
        fill: "#ffffff",
        stroke: colors[i],
        lw: 1.8,
        r: 7,
      });
      k.label(x, top + 15, names[i], { align: "center", size: 11.5, color: INK });
      line(ctx, x, top + boxH, x, h - 30);
    });
    return xs;
  }

  /* ── Stepper 1: the life of one HTTP request ────────────────── */

  function initRequestWalkthrough() {
    var host = document.getElementById("ix-request");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-request", {
      title: "The life of one HTTP request",
      titleZh: "一次 HTTP 请求的生命周期",
      subtitle:
        "Every click travels through the same four components. Click any frame, or press play.",
      subtitleZh: "每一次点击都会经过同样的四个组件。可点击任意一帧，或按播放。",
      height: 300,
      intervalMs: 2400,
      frames: [
        {
          title: "A request arrives — and HTTP has no memory",
          titleZh: "请求到达——而 HTTP 没有记忆",
          caption:
            "The client sends one request and the web server answers it. The application has to rebuild the idea of who you are from data carried inside that request.",
          captionZh:
            "客户端发出一个请求，Web 服务器给出响应。应用必须从该请求内部携带的数据中重新构建“你是谁”。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var xs = lifelines(ctx, k, w, h);
            k.arrow(xs[0] + 4, 94, xs[1] - 6, 94, { color: ACCENT, lw: 2 });
            k.label((xs[0] + xs[1]) / 2, 80, zh() ? "HTTP 请求" : "HTTP request", {
              align: "center",
              size: 11,
              color: ACCENT,
            });
            k.arrow(xs[1] - 4, 128, xs[0] + 6, 128, { color: BLUE, lw: 2 });
            k.label((xs[0] + xs[1]) / 2, 114, zh() ? "HTTP 响应" : "HTTP response", {
              align: "center",
              size: 11,
              color: BLUE,
            });
            k.box(xs[2] - 86, 172, 172, 52, {
              fill: "rgba(225,29,72,0.06)",
              stroke: ACCENT,
              lw: 1.3,
              r: 8,
            });
            k.label(
              xs[2],
              194,
              zh() ? "重建：“你是谁？”" : "rebuild: who are you?",
              { align: "center", size: 11, color: ACCENT }
            );
            k.label(
              xs[2],
              212,
              zh() ? "从请求数据中重建" : "from data in the request",
              { align: "center", size: 9.5, color: MUTED }
            );
            k.label(
              w / 2,
              h - 14,
              zh()
                ? "无状态：服务器不会记得上一个请求"
                : "stateless: the server keeps no memory of the previous request",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
        {
          title: "The web server routes it inward",
          titleZh: "Web 服务器将其向内转发",
          caption:
            "Routing, method handling and connection management are the web server's job. Static content stops here; dynamic content is forwarded to the application server.",
          captionZh:
            "路由、方法处理与连接管理属于 Web 服务器。静态内容在此结束；动态内容被转发给应用服务器。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var xs = lifelines(ctx, k, w, h);
            k.arrow(xs[0] + 4, 94, xs[1] - 6, 94, { color: ACCENT, lw: 2 });
            k.label((xs[0] + xs[1]) / 2, 80, zh() ? "HTTP 请求" : "HTTP request", {
              align: "center",
              size: 11,
              color: ACCENT,
            });
            k.arrow(xs[1] + 4, 128, xs[2] - 6, 128, { color: BLUE, lw: 2 });
            k.label((xs[1] + xs[2]) / 2, 114, zh() ? "转发请求" : "forward", {
              align: "center",
              size: 11,
              color: BLUE,
            });
            k.box(xs[1] - 62, 168, 124, 44, {
              fill: "rgba(37,99,235,0.07)",
              stroke: BLUE,
              lw: 1.3,
              r: 8,
            });
            k.label(xs[1], 184, zh() ? "静态内容" : "static content", {
              align: "center",
              size: 10,
              color: BLUE,
            });
            k.label(xs[1], 200, zh() ? "在此直接作答" : "answered here", {
              align: "center",
              size: 9.5,
              color: MUTED
            });
            k.label(
              w / 2,
              h - 14,
              zh()
                ? "有些请求在这里就被满足，无须打扰应用"
                : "some requests are satisfied here, without troubling the application",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
        {
          title: "The application rebuilds who you are — from a cookie",
          titleZh: "应用通过 Cookie 重建“你是谁”",
          caption:
            "The session token arrives automatically with the request. The application exchanges it for an identity, and everything downstream trusts that identity.",
          captionZh:
            "会话令牌随请求自动到达。应用用它换取一个身份，而后续所有环节都信任该身份。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var xs = lifelines(ctx, k, w, h);
            k.arrow(xs[0] + 4, 94, xs[1] - 6, 94, { color: ACCENT, lw: 2 });
            k.label((xs[0] + xs[1]) / 2, 80, zh() ? "HTTP 请求" : "HTTP request", {
              align: "center",
              size: 11,
              color: ACCENT,
            });
            k.arrow(xs[1] + 4, 128, xs[2] - 6, 128, { color: BLUE, lw: 2 });
            k.label((xs[1] + xs[2]) / 2, 114, zh() ? "转发请求" : "forward", {
              align: "center",
              size: 11,
              color: BLUE,
            });
            k.box(xs[0] - 80, 160, 160, 36, {
              fill: "rgba(225,29,72,0.06)",
              stroke: ACCENT,
              lw: 1.3,
              r: 8,
            });
            k.label(xs[0], 178, zh() ? "会话令牌（Cookie）" : "session token (cookie)", {
              align: "center",
              size: 10,
              color: ACCENT,
            });
            k.arrow(xs[0], 200, xs[2], 200, { color: ACCENT, lw: 1.6, dash: [5, 4] });
            k.box(xs[2] - 86, 168, 172, 50, {
              fill: "rgba(5,150,105,0.07)",
              stroke: GREEN,
              lw: 1.3,
              r: 8,
            });
            k.label(
              xs[2],
              188,
              zh() ? "身份 + 授权判定" : "identity + authorisation",
              { align: "center", size: 10.5, color: GREEN }
            );
            k.label(xs[2], 206, zh() ? "后续环节都信任它" : "trusted downstream", {
              align: "center",
              size: 9.5,
              color: MUTED,
            });
            k.label(
              w / 2,
              h - 14,
              zh()
                ? "持有该令牌者，即被当作该用户"
                : "whoever holds the token is treated as the user",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
        {
          title: "The application reaches the database",
          titleZh: "应用访问数据库",
          caption:
            "The app server runs the business logic, checks authorisation and queries the database through its interface methods. This is the layer where injection and missing access checks live.",
          captionZh:
            "应用服务器执行业务逻辑、检查授权，并通过数据库接口方法查询。注入与访问控制缺失都发生在这一层。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var xs = lifelines(ctx, k, w, h);
            k.arrow(xs[0] + 4, 94, xs[1] - 6, 94, { color: ACCENT, lw: 2 });
            k.label((xs[0] + xs[1]) / 2, 80, zh() ? "HTTP 请求" : "HTTP request", {
              align: "center",
              size: 11,
              color: ACCENT,
            });
            k.arrow(xs[1] + 4, 128, xs[2] - 6, 128, { color: BLUE, lw: 2 });
            k.label((xs[1] + xs[2]) / 2, 114, zh() ? "转发请求" : "forward", {
              align: "center",
              size: 11,
              color: BLUE,
            });
            k.arrow(xs[2] + 4, 162, xs[3] - 6, 162, { color: GREEN, lw: 2 });
            k.label((xs[2] + xs[3]) / 2, 148, zh() ? "查询" : "query", {
              align: "center",
              size: 11,
              color: GREEN,
            });
            k.arrow(xs[3] - 4, 196, xs[2] + 6, 196, { color: AMBER, lw: 2 });
            k.label((xs[2] + xs[3]) / 2, 182, zh() ? "记录" : "records", {
              align: "center",
              size: 11,
              color: AMBER,
            });
            k.box(xs[3] - 62, 168, 124, 60, {
              fill: "rgba(245,158,11,0.08)",
              stroke: AMBER,
              lw: 1.3,
              r: 8,
            });
            k.label(xs[3], 186, zh() ? "表：产品" : "table: products", {
              align: "center",
              size: 10,
              color: MUTED,
            });
            k.label(xs[3], 205, zh() ? "每行一条记录" : "each row a record", {
              align: "center",
              size: 9.5,
              color: MUTED,
            });
            k.label(
              w / 2,
              h - 14,
              zh()
                ? "用户输入在此变成指令——这就是注入的入口"
                : "user input becomes instruction here — this is where injection enters",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
        {
          title: "The response travels back out",
          titleZh: "响应沿路径返回",
          caption:
            "The application builds the response and the web server delivers it. Anything the application echoed from user input is now being rendered in somebody's browser.",
          captionZh:
            "应用构建响应，Web 服务器将其送达。应用回显的任何用户输入，此刻正在某人的浏览器中被渲染。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var xs = lifelines(ctx, k, w, h);
            k.arrow(xs[2] - 4, 128, xs[1] + 6, 128, { color: GREEN, lw: 2 });
            k.label((xs[1] + xs[2]) / 2, 114, zh() ? "HTML 响应" : "HTML response", {
              align: "center",
              size: 11,
              color: GREEN,
            });
            k.arrow(xs[1] - 4, 162, xs[0] + 6, 162, { color: BLUE, lw: 2 });
            k.label((xs[0] + xs[1]) / 2, 148, "HTTP 200 OK", {
              align: "center",
              size: 11,
              color: BLUE,
            });
            k.box(xs[0] - 80, 168, 160, 56, {
              fill: "rgba(37,99,235,0.06)",
              stroke: BLUE,
              lw: 1.3,
              r: 8,
            });
            k.label(xs[0], 188, zh() ? "浏览器渲染" : "browser renders", {
              align: "center",
              size: 10.5,
              color: BLUE,
            });
            k.label(xs[0], 208, zh() ? "脚本会执行" : "scripts execute", {
              align: "center",
              size: 9.5,
              color: MUTED,
            });
            k.label(
              w / 2,
              h - 14,
              zh()
                ? "未经转义的回显输入，就会在这里执行"
                : "unescaped echoed input is executed right here",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
      ],
    });
  }

  /* ── Stepper 3: where the filter sits (foundations page) ────── */

  function initFilterStepper() {
    var host = document.getElementById("ix-naxsi");
    if (!host || !window.Interactive) return;

    /* The four boxes every frame is built around, positioned as fractions of
       the canvas width so all four frames line up. */
    function layout(w) {
      return {
        client: { x: w * 0.14, y: 96, bw: 150, bh: 62 },
        filter: { x: w * 0.41, y: 96, bw: 140, bh: 62 },
        server: { x: w * 0.68, y: 70, bw: 150, bh: 52 },
        app: { x: w * 0.68, y: 140, bw: 150, bh: 52 },
        db: { x: w * 0.68, y: 216, bw: 150, bh: 48 },
      };
    }

    function drawClient(k, box, hostile) {
      k.box(box.x - box.bw / 2, box.y, box.bw, box.bh, {
        fill: "#ffffff",
        stroke: ACCENT,
        lw: 2,
        r: 10,
      });
      k.label(box.x, box.y + 22, zh() ? "客户端 / 攻击者" : "client / attacker", {
        align: "center",
        size: 11,
        color: INK,
      });
      k.label(
        box.x,
        box.y + 44,
        hostile
          ? (zh() ? "可疑请求" : "suspicious request")
          : (zh() ? "正常请求" : "ordinary request"),
        { align: "center", size: 9.5, color: hostile ? ACCENT : MUTED }
      );
    }

    function drawStack(k, b) {
      k.box(b.server.x - b.server.bw / 2, b.server.y, b.server.bw, b.server.bh, {
        fill: "rgba(37,99,235,0.07)",
        stroke: BLUE,
        lw: 1.6,
        r: 9,
      });
      k.label(b.server.x, b.server.y + 20, zh() ? "Web 服务器" : "web server", {
        align: "center",
        size: 10.5,
        color: BLUE,
      });
      k.label(b.server.x, b.server.y + 38, "NginX", {
        align: "center",
        size: 9.5,
        color: MUTED,
        mono: true,
      });
      k.box(b.app.x - b.app.bw / 2, b.app.y, b.app.bw, b.app.bh, {
        fill: "rgba(5,150,105,0.07)",
        stroke: GREEN,
        lw: 1.6,
        r: 9,
      });
      k.label(b.app.x, b.app.y + 20, zh() ? "应用服务器" : "app server", {
        align: "center",
        size: 10.5,
        color: GREEN,
      });
      k.label(b.app.x, b.app.y + 38, "PHP-FPM + DVWA", {
        align: "center",
        size: 9,
        color: MUTED,
        mono: true,
      });
      k.box(b.db.x - b.db.bw / 2, b.db.y, b.db.bw, b.db.bh, {
        fill: "rgba(245,158,11,0.08)",
        stroke: AMBER,
        lw: 1.4,
        r: 9,
      });
      k.label(b.db.x, b.db.y + 20, zh() ? "数据库" : "database", {
        align: "center",
        size: 10.5,
        color: AMBER,
      });
      k.label(b.db.x, b.db.y + 36, zh() ? "被窃取的数据" : "data at risk", {
        align: "center",
        size: 9,
        color: MUTED,
      });
      k.arrow(b.server.x, b.server.y + b.server.bh, b.app.x, b.app.y - 3, {
        color: SLATE,
        lw: 1.5,
      });
      k.arrow(b.app.x - 3, b.app.y + b.app.bh, b.db.x - 3, b.db.y - 3, {
        color: SLATE,
        lw: 1.5,
      });
    }

    window.Interactive.stepper("ix-naxsi", {
      title: "Where an application-layer filter sits",
      titleZh: "应用层过滤器所处的位置",
      subtitle:
        "The tutorial's architecture: host the vulnerable application on NginX, then put the filter in front of it and choose whether it acts.",
      subtitleZh:
        "辅导课的架构：先把存在漏洞的应用托管在 NginX 上，再把过滤器放到它前面，并决定过滤器是否真正执行动作。",
      height: 330,
      intervalMs: 2600,
      frames: [
        {
          title: "Unprotected — the request reaches the application",
          titleZh: "未受保护——请求直达应用",
          caption:
            "NginX serves the page and passes PHP work to PHP-FPM, which runs the deliberately vulnerable application. Nothing inspects the request on the way in.",
          captionZh:
            "NginX 提供页面服务，并把 PHP 处理交给 PHP-FPM，由它运行这个故意留有漏洞的应用。请求在进入的过程中没有任何检查。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var b = layout(w);
            drawClient(k, b.client, true);
            drawStack(k, b);
            k.arrow(b.client.x + 82, b.client.y + 31, b.server.x - 82, b.client.y + 31, {
              color: ACCENT,
              lw: 2,
            });
            k.box(w / 2 - 132, 250, 264, 34, {
              fill: "rgba(225,29,72,0.07)",
              stroke: ACCENT,
              lw: 1.3,
              r: 8,
            });
            k.label(w / 2, 267, zh() ? "没有任何东西检查请求" : "nothing inspects the request", {
              align: "center",
              size: 10.5,
              color: ACCENT,
            });
            k.label(
              w / 2,
              h - 14,
              zh() ? "第 1–5 步：先让它跑起来" : "steps 1-5 of the tutorial: get it running first",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
        {
          title: "Inline — the filter inspects before the server",
          titleZh: "串联——过滤器在服务器之前检查",
          caption:
            "The filter is compiled in or placed in front, positioned between the client and the web server so that it intercepts and inspects all traffic passing through it.",
          captionZh:
            "过滤器被编译进去或置于前端，位于客户端与 Web 服务器之间，从而拦截并检查经过它的全部流量。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var b = layout(w);
            drawClient(k, b.client, true);
            k.box(b.filter.x - b.filter.bw / 2, b.filter.y, b.filter.bw, b.filter.bh, {
              fill: "rgba(124,58,237,0.08)",
              stroke: PURPLE,
              lw: 2,
              r: 10,
            });
            k.label(b.filter.x, b.filter.y + 22, zh() ? "过滤器" : "filter", {
              align: "center",
              size: 11,
              color: PURPLE,
            });
            k.label(b.filter.x, b.filter.y + 44, "NAXSI", {
              align: "center",
              size: 9.5,
              color: MUTED,
              mono: true,
            });
            drawStack(k, b);
            k.arrow(b.client.x + 82, b.client.y + 31, b.filter.x - 76, b.client.y + 31, {
              color: ACCENT,
              lw: 2,
            });
            k.arrow(b.filter.x + 76, b.client.y + 31, b.server.x - 82, b.client.y + 31, {
              color: PURPLE,
              lw: 2,
            });
            k.box(w / 2 - 150, 250, 300, 34, {
              fill: "rgba(124,58,237,0.07)",
              stroke: PURPLE,
              lw: 1.3,
              r: 8,
            });
            k.label(
              w / 2,
              267,
              zh() ? "规则文件指定被拒 URL 的展示页面" : "the rules file names the denied-URL page",
              { align: "center", size: 10.5, color: PURPLE }
            );
            k.label(
              w / 2,
              h - 14,
              zh() ? "第 6 步：让站点配置引用该规则文件" : "step 6: make the site config reference that rules file",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
        {
          title: "Enforcing — the filter acts",
          titleZh: "执行模式——过滤器采取动作",
          caption:
            "A request matching a rule is refused before the application sees it, the browser sees a different response code, and the event is recorded in the error log.",
          captionZh:
            "命中规则的请求在抵达应用之前就被拒绝，浏览器看到不同的响应码，事件被记录到错误日志中。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var b = layout(w);
            drawClient(k, b.client, true);
            k.box(b.filter.x - b.filter.bw / 2, b.filter.y, b.filter.bw, b.filter.bh, {
              fill: "rgba(225,29,72,0.1)",
              stroke: ACCENT,
              lw: 2.2,
              r: 10,
            });
            k.label(b.filter.x, b.filter.y + 22, zh() ? "拒绝" : "denied", {
              align: "center",
              size: 11.5,
              color: ACCENT,
            });
            k.label(b.filter.x, b.filter.y + 44, zh() ? "不进入应用" : "never reaches the app", {
              align: "center",
              size: 9.5,
              color: MUTED,
            });
            drawStack(k, b);
            k.arrow(b.client.x + 82, b.client.y + 31, b.filter.x - 76, b.client.y + 31, {
              color: ACCENT,
              lw: 2,
            });
            /* The refused request stops at the filter, so it is drawn as a
               terminal marker rather than an arrow into the server. */
            k.box(b.filter.x + 84, b.client.y + 12, 140, 40, {
              fill: "#ffffff",
              stroke: ACCENT,
              lw: 1.6,
              r: 8,
            });
            k.label(b.filter.x + 154, b.client.y + 32, zh() ? "被拦截" : "blocked", {
              align: "center",
              size: 10.5,
              color: ACCENT,
            });
            k.box(w / 2 - 166, 244, 332, 46, {
              fill: "rgba(225,29,72,0.07)",
              stroke: ACCENT,
              lw: 1.3,
              r: 8,
            });
            k.label(
              w / 2,
              262,
              zh()
                ? "响应码改变，事件写入 /var/log/nginx/error.log"
                : "response code changes; the event lands in error.log",
              { align: "center", size: 10, color: MUTED }
            );
            k.label(
              w / 2,
              h - 14,
              zh() ? "应用本身没有任何改变" : "nothing about the application has changed",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
        {
          title: "Learning mode — log the request, take no action",
          titleZh: "学习模式——只记录请求，不采取动作",
          caption:
            "With action disabled, the request passes through and reaches the application; the filter's only output is a log line. Those lines are what you use to write exceptions for legitimate traffic before enforcing.",
          captionZh:
            "在动作被禁用时，请求穿过过滤器抵达应用；过滤器唯一的产出就是日志行。正是这些日志行，让你在执行模式之前为正常流量编写例外规则。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var b = layout(w);
            drawClient(k, b.client, true);
            k.box(b.filter.x - b.filter.bw / 2, b.filter.y, b.filter.bw, b.filter.bh, {
              fill: "rgba(245,158,11,0.1)",
              stroke: AMBER,
              lw: 2,
              r: 10,
            });
            k.label(b.filter.x, b.filter.y + 22, zh() ? "学习模式" : "learning mode", {
              align: "center",
              size: 10.5,
              color: AMBER,
            });
            k.label(b.filter.x, b.filter.y + 44, zh() ? "只记录" : "log only", {
              align: "center",
              size: 9.5,
              color: MUTED,
            });
            drawStack(k, b);
            k.arrow(b.client.x + 82, b.client.y + 31, b.filter.x - 76, b.client.y + 31, {
              color: ACCENT,
              lw: 2,
            });
            k.arrow(b.filter.x + 76, b.client.y + 31, b.server.x - 82, b.client.y + 31, {
              color: AMBER,
              lw: 2,
              dash: [6, 5],
            });
            k.box(w / 2 - 176, 244, 352, 58, {
              fill: "rgba(245,158,11,0.08)",
              stroke: AMBER,
              lw: 1.3,
              r: 8,
            });
            k.label(
              w / 2,
              264,
              zh() ? "日志 = 编写例外规则的输入" : "the log is the input to your exceptions",
              { align: "center", size: 10.5, color: MUTED }
            );
            k.label(
              w / 2,
              284,
              zh() ? "高流量站点的调优需要大量精力" : "tuning this on a busy site takes real effort",
              { align: "center", size: 10, color: MUTED }
            );
            k.label(
              w / 2,
              h - 14,
              zh() ? "攻击成功，因为代码缺陷依然存在" : "the attack succeeds, because the defect is still in the code",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
      ],
    });
  }

  /* ── Stepper 2: query manipulation ──────────────────────────── */

  function initInjectionWalkthrough() {
    var host = document.getElementById("ix-sqli");
    if (!host || !window.Interactive) return;

    window.Interactive.stepper("ix-sqli", {
      title: "How a query stops filtering anything",
      titleZh: "查询如何失去过滤作用",
      subtitle:
        "The lecture's three frames: vulnerable input field, query manipulated, data exposed — then the structural fix. Conceptual shapes only; nothing here is a runnable payload.",
      subtitleZh:
        "讲义的三帧：存在漏洞的输入字段、查询被操纵、数据被泄露——以及结构性修复。此处仅为概念示意，不含可直接运行的载荷。",
      height: 400,
      intervalMs: 2800,
      frames: [
        {
          title: "Frame 1 — the vulnerable input field",
          titleZh: "第 1 帧——存在漏洞的输入字段",
          caption:
            "A field the developer expects to contain a product name. The developer's mental model is 'a short piece of text'; the field itself has no such opinion.",
          captionZh:
            "开发者预期该字段存放产品名称。开发者心中的模型是“一小段文本”；而字段本身并不这样认为。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var xs = lifelines(ctx, k, w, h);
            line(ctx, xs[0], 170, xs[2], 170, "rgba(225,29,72,0.45)", 1.4);
            k.box(xs[0] - 82, 132, 164, 76, {
              fill: "#ffffff",
              stroke: ACCENT,
              lw: 2,
              r: 10,
            });
            k.label(xs[0], 152, zh() ? "输入字段" : "input field", {
              align: "center",
              size: 11.5,
              color: INK,
            });
            k.box(xs[0] - 64, 164, 128, 26, {
              fill: "rgba(225,29,72,0.06)",
              stroke: SLATE,
              lw: 1.2,
              r: 6,
            });
            k.label(xs[0], 177, zh() ? "用户输入" : "user input", {
              align: "center",
              size: 10,
              color: MUTED,
            });
            k.box(xs[2] - 84, 132, 168, 76, {
              fill: "rgba(124,58,237,0.07)",
              stroke: PURPLE,
              lw: 1.5,
              r: 10,
            });
            k.label(
              xs[2],
              154,
              zh() ? "查询构造" : "query construction",
              { align: "center", size: 11.5, color: PURPLE }
            );
            k.label(
              xs[2],
              176,
              zh() ? "把字段文本拼进语句" : "assembles the text into a statement",
              { align: "center", size: 9.5, color: MUTED }
            );
            k.arrow(xs[0] + 86, 170, xs[2] - 90, 170, { color: ACCENT, lw: 1.8 });
            k.label(xs[1], 186, zh() ? "预期：产品名称" : "expected: a product name", {
              align: "center",
              size: 10,
              color: MUTED,
            });
            k.label(
              w / 2,
              h - 14,
              zh()
                ? "输入不是缺陷——把输入当作指令的一部分，才是缺陷"
                : "the input is not the bug — treating it as part of the instruction is",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
        {
          title: "Frame 2 — the query is manipulated",
          titleZh: "第 2 帧——查询被操纵",
          caption:
            "The field's text is assembled into the statement instead of being bound into it as a value. Part of the user's string is now instruction, and the condition the developer wrote no longer restricts anything.",
          captionZh:
            "字段文本被拼装进语句，而不是作为值绑定进去。用户字符串的一部分成了指令，开发者写的条件不再起任何限制作用。",
          draw: function (ctx, w, h, k) {
            k.clear();
            var lines = zh()
              ? [
                  "语句 = “…… WHERE name = ” + 输入 + “……”",
                  "输入 = 〈普通文本〉 + 〈恒为真的条件〉",
                  "结果 = 开发者写的过滤条件被抵消",
                ]
              : [
                  "statement = \"... WHERE name = \" + input + \"...\"",
                  "input     = <ordinary text> + <condition that is always true>",
                  "effect    = the developer's filter is cancelled out",
                ];
            k.box(24, 96, w - 48, 128, {
              fill: "rgba(124,58,237,0.06)",
              stroke: PURPLE,
              lw: 1.5,
              r: 10,
            });
            k.code(44, 122, lines, { size: 11.5, lh: 29, color: INK });
            k.box(24, 240, w - 48, 78, {
              fill: "rgba(225,29,72,0.06)",
              stroke: ACCENT,
              lw: 1.4,
              r: 10,
            });
            k.label(44, 262, zh() ? "结构性问题" : "the structural problem", {
              size: 11.5,
              color: ACCENT,
            });
            k.label(
              44,
              286,
              zh()
                ? "查询是作为文本拼起来的，因此用户数据可以落在指令的位置上。"
                : "the query is built as text, so user data can occupy an instruction position.",
              { size: 10.5, color: MUTED }
            );
            k.label(
              w / 2,
              h - 14,
              zh()
                ? "这不是数据库的缺陷，而是应用构造查询的方式"
                : "this is not a database defect — it is how the application builds the query",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
        {
          title: "Frame 3 — data is exposed",
          titleZh: "第 3 帧——数据被泄露",
          caption:
            "The statement no longer selects one product, so the database returns whole rows. The lecture's impact statement: the attacker can now view all records in the table, including credit card numbers and personal information.",
          captionZh:
            "语句不再只选一条产品，于是数据库返回整行记录。即讲义所述的后果：攻击者可以查看表中的全部记录，包括信用卡号与个人信息。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(28, 104, 226, 30, {
              fill: "rgba(245,158,11,0.09)",
              stroke: AMBER,
              lw: 1.4,
              r: 7,
            });
            k.label(44, 119, zh() ? "表：产品" : "table: products", {
              size: 10.5,
              color: MUTED,
            });
            var values = zh() ? ["名称", "价格", "卡号"] : ["name", "price", "card number"];
            values.forEach(function (v, i) {
              k.box(28, 150 + i * 32, 226, 26, {
                fill: "rgba(5,150,105,0.08)",
                stroke: GREEN,
                lw: 1.2,
                r: 6,
              });
              k.label(44, 163 + i * 32, v, { size: 10.5, color: MUTED });
            });
            k.label(28, 268, zh() ? "返回：整张表" : "returned: the whole table", {
              size: 11,
              color: GREEN,
            });
            k.arrow(258, 200, w * 0.72, 200, { color: ACCENT, lw: 2 });
            k.box(w * 0.72 + 6, 168, Math.max(120, w - w * 0.72 - 30), 64, {
              fill: "rgba(225,29,72,0.06)",
              stroke: ACCENT,
              lw: 1.4,
              r: 8,
            });
            k.label(
              w * 0.72 + 20,
              192,
              zh() ? "未授权记录" : "unauthorised records",
              { size: 11, color: ACCENT }
            );
            k.label(
              w * 0.72 + 20,
              212,
              zh() ? "全部行都被返回" : "every row is returned",
              { size: 9.5, color: MUTED }
            );
            k.label(
              w / 2,
              h - 14,
              zh()
                ? "过滤条件被抵消后，“只返回我该看的那一行”就再无人执行"
                : "with the filter cancelled, nothing enforces \"only the row I may see\"",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
        {
          title: "The fix — structure fixed, data bound",
          titleZh: "修复——结构固定，数据绑定",
          caption:
            "Keep the statement's structure constant and pass the user's value in as a value, so no input can ever be a clause. Then add input validation, least-privilege database credentials and query logging.",
          captionZh:
            "让语句结构保持不变，把用户的值作为值传入，使任何输入都无法成为子句。再加上输入校验、最小权限的数据库凭据与查询日志。",
          draw: function (ctx, w, h, k) {
            k.clear();
            k.box(24, 96, w - 48, 106, {
              fill: "rgba(5,150,105,0.07)",
              stroke: GREEN,
              lw: 1.5,
              r: 10,
            });
            k.label(44, 120, zh() ? "结构固定" : "structure fixed", {
              size: 11.5,
              color: GREEN,
            });
            k.label(
              44,
              146,
              zh()
                ? "语句的形状由代码决定，值只能出现在值的位置上。"
                : "the statement's shape is fixed by code; values can only be values.",
              { size: 10.5, color: MUTED }
            );
            k.box(24, 214, w - 48, 116, {
              fill: "rgba(37,99,235,0.06)",
              stroke: BLUE,
              lw: 1.4,
              r: 10,
            });
            k.label(44, 238, zh() ? "分层防御" : "layered controls", {
              size: 11.5,
              color: BLUE,
            });
            [
              zh() ? "校验：格式与长度符合预期" : "validate: expected format and length",
              zh()
                ? "最小权限：数据库账号能做的越少越好"
                : "least privilege: the database account can do less",
              zh()
                ? "日志：能看到应用实际执行的查询"
                : "log: see the queries the application actually ran",
            ].forEach(function (text, i) {
              k.label(44, 266 + i * 24, text, { size: 10.5, color: MUTED });
            });
            k.label(
              w / 2,
              h - 14,
              zh()
                ? "输入校验有用，但只有在结构本身安全之后才成立"
                : "input validation helps, but only once the structure itself is safe",
              { align: "center", size: 11, color: MUTED }
            );
          },
        },
      ],
    });
  }
})();
