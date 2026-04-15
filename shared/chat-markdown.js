/**
 * chat-markdown.js — minimal Markdown → HTML renderer + DOMPurify sanitizer.
 *
 * Extracted from shared/chat-panel.js so the chat panel's concerns
 * (networking, state, DOM wiring) are decoupled from text transformation.
 *
 * Exposes:
 *   window.ChatMarkdown.render(text)    — returns sanitized HTML string
 *   window.ChatMarkdown.sanitize(html)  — DOMPurify pass, safe fallback
 *
 * DOMPurify is loaded lazily from CDN if absent. Until it loads,
 * sanitize() falls back to an HTML-escape to avoid raw injection.
 */
(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function sanitize(html) {
    if (typeof DOMPurify !== "undefined") {
      return DOMPurify.sanitize(html, {
        ADD_TAGS: ["summary", "details"],
        ADD_ATTR: ["aria-label"]
      });
    }
    // Fallback: escape everything. Caller should not trust output until
    // DOMPurify is available.
    return escapeHtml(html);
  }

  function render(text) {
    if (!text) return "";
    var s = escapeHtml(text);

    // Fenced code blocks.
    s = s.replace(/```(\w*)\n([\s\S]*?)```/g, function (_, _lang, code) {
      return "<pre><code>" + code.trim() + "</code></pre>";
    });
    // Inline code.
    s = s.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    // Headings (h1..h4).
    s = s.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
    s = s.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    s = s.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    s = s.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    s = s.replace(/^---+$/gm, "<hr/>");
    // Bold / italic / bold-italic.
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
    // LaTeX passthrough for KaTeX auto-render.
    s = s.replace(/\$\$([^$]+?)\$\$/g, "\\[$1\\]");
    s = s.replace(/\$([^$\n]+?)\$/g, "\\($1\\)");
    // Unordered lists.
    s = s.replace(/((?:^[\t ]*\*[\t ]+.+\n?)+)/gm, function (block) {
      var items = block.trim().split("\n").map(function (line) {
        return "<li>" + line.replace(/^[\t ]*\*[\t ]+/, "") + "</li>";
      }).join("");
      return "<ul>" + items + "</ul>";
    });
    // Ordered lists.
    s = s.replace(/((?:^[\t ]*\d+\.[\t ]+.+\n?)+)/gm, function (block) {
      var items = block.trim().split("\n").map(function (line) {
        return "<li>" + line.replace(/^[\t ]*\d+\.[\t ]+/, "") + "</li>";
      }).join("");
      return "<ol>" + items + "</ol>";
    });
    // Blockquotes.
    s = s.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");
    // Paragraphs.
    s = s.replace(/\n{2,}/g, "</p><p>");
    s = s.replace(/\n/g, "<br/>");
    s = "<p>" + s + "</p>";
    // Clean up paragraph wrappers around block elements.
    s = s.replace(/<p>\s*<\/p>/g, "");
    s = s.replace(/<p>\s*(<h[1-4]>)/g, "$1");
    s = s.replace(/(<\/h[1-4]>)\s*<\/p>/g, "$1");
    s = s.replace(/<p>\s*(<ul>)/g, "$1");
    s = s.replace(/(<\/ul>)\s*<\/p>/g, "$1");
    s = s.replace(/<p>\s*(<ol>)/g, "$1");
    s = s.replace(/(<\/ol>)\s*<\/p>/g, "$1");
    s = s.replace(/<p>\s*(<pre>)/g, "$1");
    s = s.replace(/(<\/pre>)\s*<\/p>/g, "$1");
    s = s.replace(/<p>\s*(<hr\/>)/g, "$1");
    s = s.replace(/(<hr\/>)\s*<\/p>/g, "$1");
    s = s.replace(/<p>\s*(<blockquote>)/g, "$1");
    s = s.replace(/(<\/blockquote>)\s*<\/p>/g, "$1");

    return sanitize(s);
  }

  function ensureDOMPurify() {
    if (typeof DOMPurify !== "undefined") return;
    if (document.querySelector('script[data-dompurify]')) return;
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js";
    script.integrity = "sha384-eEu5CTj3qGvu9PdJuS+YlkNi7d2XxQROAFYOr59zgObtlcux1ae1Il3u7jvdCSWu";
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.async = true;
    script.dataset.dompurify = "1";
    document.head.appendChild(script);
  }

  window.ChatMarkdown = {
    render: render,
    sanitize: sanitize,
    ensureDOMPurify: ensureDOMPurify
  };
})();
