(function () {
  "use strict";

  function renderMath() {
    if (typeof renderMathInElement === "function") {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
      });
    }
  }

  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("sidebarToggle");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.getElementById("mainContent").addEventListener("click", () => {
      if (sidebar.classList.contains("open")) sidebar.classList.remove("open");
    });
  }

  const sections = document.querySelectorAll(".section[data-track]");
  const navLinks = document.querySelectorAll(".nav-link");
  const visited = new Set();

  function updateProgress() {
    const total = sections.length;
    visited.add("hero");
    const pct = (visited.size / total) * 100;
    const fill = document.getElementById("progressFill");
    const txt = document.getElementById("progressText");
    if (fill) fill.style.width = pct + "%";
    if (txt) txt.textContent = visited.size + " / " + total;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.dataset.track;
          visited.add(id);
          updateProgress();
          navLinks.forEach((l) => {
            l.classList.toggle("active", l.dataset.section === e.target.id);
          });
        }
      });
    },
    { rootMargin: "-20% 0px -60% 0px" }
  );
  sections.forEach((s) => observer.observe(s));

  document.querySelectorAll(".proof-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isOpen = target.classList.contains("open");
      target.classList.toggle("open");
      btn.classList.toggle("open");
      if (!isOpen) renderMath();
    });
  });

  document.querySelectorAll(".solution-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isOpen = target.classList.contains("open");
      target.classList.toggle("open");
      var zh = typeof getLang === "function" && getLang() === "zh";
      btn.textContent = isOpen
        ? zh
          ? "查看解答"
          : "Show Solution"
        : zh
          ? "隐藏解答"
          : "Hide Solution";
      if (!isOpen) renderMath();
    });
  });

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".interactive-compare");
      if (!parent) return;
      parent.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      parent.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      const tab = document.getElementById(btn.dataset.tab);
      if (tab) tab.classList.add("active");
      renderMath();
    });
  });

  document.querySelectorAll(".toolkit-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
      renderMath();
    });
  });

  updateProgress();
  window.addEventListener("load", renderMath);
  setTimeout(renderMath, 500);
  setTimeout(renderMath, 1500);
})();
