(function () {
  "use strict";

  function mmEscapePlain(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function mmRenderLabel(span, text) {
    if (!span) return;
    if (text == null || text === "") {
      span.textContent = "";
      return;
    }
    var raw = String(text);
    var parts = raw.split(/\$/);
    var html = "";
    var i;
    for (i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        html += mmEscapePlain(parts[i]);
      } else {
        html += "$" + mmEscapePlain(parts[i]) + "$";
      }
    }
    span.innerHTML = html;
    if (typeof renderMathInElement === "function") {
      try {
        renderMathInElement(span, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
          throwOnError: false,
          errorColor: "#f87171",
          trust: false,
        });
      } catch (e) {}
    }
  }

  function levelClass(level) {
    if (level === 0) return "n-root";
    if (level === 1) return "n-branch";
    if (level === 2) return "n-sub";
    return "n-leaf";
  }

  function buildBranch(data, level) {
    var branch = document.createElement("div");
    branch.className = "mm-branch";

    var node = document.createElement("div");
    node.className = "mm-node " + levelClass(level);
    node.setAttribute("role", "treeitem");
    node.setAttribute("tabindex", "0");
    if (data.color) node.classList.add("c-" + data.color);
    if (data.href) node.setAttribute("data-href", data.href);

    var labelEn = data.label || "";
    var labelZh = data.label_zh || labelEn;
    node.setAttribute("data-label-en", labelEn);
    node.setAttribute("data-label-zh", labelZh);

    var textSpan = document.createElement("span");
    textSpan.className = "mm-text";
    mmRenderLabel(textSpan, labelEn);
    node.appendChild(textSpan);

    var hasChildren = data.children && data.children.length > 0;
    if (hasChildren) {
      node.setAttribute("aria-expanded", "true");
      var chevron = document.createElement("span");
      chevron.className = "mm-chevron";
      chevron.textContent = "›";
      node.appendChild(chevron);
    }

    branch.appendChild(node);

    if (hasChildren) {
      var childContainer = document.createElement("div");
      childContainer.className = "mm-children";
      data.children.forEach(function (child) {
        childContainer.appendChild(buildBranch(child, level + 1));
      });
      branch.appendChild(childContainer);
    }

    return branch;
  }

  function drawConnectors(container) {
    var oldSvg = container.querySelector("svg.mm-connectors");
    if (oldSvg) oldSvg.remove();

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "mm-connectors");
    var rect = container.getBoundingClientRect();
    svg.setAttribute("width", container.scrollWidth);
    svg.setAttribute("height", container.scrollHeight);
    container.insertBefore(svg, container.firstChild);

    var cRect = container.getBoundingClientRect();
    var scrollL = container.scrollLeft || 0;
    var scrollT = container.scrollTop || 0;

    container.querySelectorAll(".mm-branch").forEach(function (branch) {
      var childrenDiv = branch.querySelector(":scope > .mm-children");
      if (!childrenDiv) return;
      if (branch.classList.contains("collapsed")) return;

      var parentNode = branch.querySelector(":scope > .mm-node");
      var pRect = parentNode.getBoundingClientRect();
      var px = pRect.right - cRect.left + scrollL;
      var py = pRect.top + pRect.height / 2 - cRect.top + scrollT;

      var childBranches = childrenDiv.querySelectorAll(":scope > .mm-branch");
      childBranches.forEach(function (cb) {
        var childNode = cb.querySelector(":scope > .mm-node");
        var chRect = childNode.getBoundingClientRect();
        var cx = chRect.left - cRect.left + scrollL;
        var cy = chRect.top + chRect.height / 2 - cRect.top + scrollT;

        var dx = (cx - px) * 0.5;
        var d = "M " + px + " " + py +
                " C " + (px + dx) + " " + py +
                " " + (cx - dx) + " " + cy +
                " " + cx + " " + cy;

        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        svg.appendChild(path);
      });
    });
  }

  function renderMindmap(containerId, data) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    container.setAttribute("role", "tree");

    var tree = buildBranch(data, 0);
    container.appendChild(tree);

    attachEvents(container);
    applyLang(container);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        drawConnectors(container);
      });
    });
  }

  function toggleNode(node, container) {
    var branch = node.parentElement;

    if (node.getAttribute("data-href")) {
      window.location.href = node.getAttribute("data-href");
      return;
    }

    if (branch.querySelector(":scope > .mm-children")) {
      branch.classList.toggle("collapsed");
      var expanded = !branch.classList.contains("collapsed");
      node.setAttribute("aria-expanded", String(expanded));
      requestAnimationFrame(function () {
        drawConnectors(container);
      });
    }
  }

  function attachEvents(container) {
    container.addEventListener("click", function (e) {
      var node = e.target.closest(".mm-node");
      if (!node) return;
      var branch = node.parentElement;

      if (node.getAttribute("data-href")) {
        var href = node.getAttribute("data-href");
        if (e.ctrlKey || e.metaKey) {
          window.open(href, "_blank");
        } else {
          window.location.href = href;
        }
        return;
      }

      if (branch.querySelector(":scope > .mm-children")) {
        branch.classList.toggle("collapsed");
        var expanded = !branch.classList.contains("collapsed");
        node.setAttribute("aria-expanded", String(expanded));
        requestAnimationFrame(function () {
          drawConnectors(container);
        });
      }
    });

    container.addEventListener("keydown", function (e) {
      var node = e.target.closest(".mm-node");
      if (!node) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleNode(node, container);
      }
    });
  }

  function applyLang(container) {
    var lang = "en";
    if (typeof getLang === "function") lang = getLang();
    var attr = lang === "zh" ? "data-label-zh" : "data-label-en";
    container.querySelectorAll(".mm-node").forEach(function (n) {
      var text = n.getAttribute(attr) || n.getAttribute("data-label-en");
      var textSpan = n.querySelector(".mm-text");
      if (textSpan) mmRenderLabel(textSpan, text);
    });
  }

  window.addEventListener("langchange", function () {
    document.querySelectorAll(".mm-canvas").forEach(function (c) {
      applyLang(c);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          drawConnectors(c);
        });
      });
    });
  });

  var btnExpand = document.getElementById("btnExpandAll");
  var btnCollapse = document.getElementById("btnCollapseAll");
  if (btnExpand) {
    btnExpand.addEventListener("click", function () {
      document.querySelectorAll(".mm-branch.collapsed").forEach(function (b) {
        b.classList.remove("collapsed");
      });
      requestAnimationFrame(function () {
        var c = document.querySelector(".mm-canvas");
        if (c) drawConnectors(c);
      });
    });
  }
  if (btnCollapse) {
    btnCollapse.addEventListener("click", function () {
      document.querySelectorAll(".mm-branch").forEach(function (b) {
        if (b.querySelector(":scope > .mm-children")) {
          b.classList.add("collapsed");
        }
      });
      requestAnimationFrame(function () {
        var c = document.querySelector(".mm-canvas");
        if (c) drawConnectors(c);
      });
    });
  }

  window.addEventListener("resize", function () {
    var c = document.querySelector(".mm-canvas");
    if (c) drawConnectors(c);
  });

  window.renderMindmap = renderMindmap;
})();
