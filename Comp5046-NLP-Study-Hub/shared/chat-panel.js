(function () {
  "use strict";

  var DEFAULT_ENDPOINT = "http://localhost:1234/v1/chat/completions";
  var STORAGE_KEY = "comp5046_chat_config";

  function getPageText() {
    var main = document.getElementById("mainContent") || document.querySelector("main") || document.body;
    var clone = main.cloneNode(true);
    clone.querySelectorAll("script, style, svg, nav, .chat-panel, #chatPanel, #chatToggleBtn").forEach(function (el) { el.remove(); });
    return clone.textContent.replace(/\s+/g, " ").trim().substring(0, 6000);
  }

  function loadConfig() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveConfig(cfg) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch (e) {}
  }

  /* ===== LIGHTWEIGHT MARKDOWN → HTML ===== */
  function md(text) {
    if (!text) return "";
    var s = text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // code blocks ```lang\n...\n```
    s = s.replace(/```(\w*)\n([\s\S]*?)```/g, function (_, lang, code) {
      return '<pre><code>' + code.trim() + '</code></pre>';
    });
    // inline code
    s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    // headings
    s = s.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    s = s.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    s = s.replace(/^## (.+)$/gm, '<h2>$2</h2>');
    s = s.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    s = s.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    // hr
    s = s.replace(/^---+$/gm, '<hr/>');
    // bold + italic
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // LaTeX display math $$...$$ → \[...\]
    s = s.replace(/\$\$([^$]+?)\$\$/g, '\\[$1\\]');
    // LaTeX inline math $...$ → \(...\)
    s = s.replace(/\$([^$\n]+?)\$/g, '\\($1\\)');
    // unordered lists
    s = s.replace(/((?:^[\t ]*\*[\t ]+.+\n?)+)/gm, function (block) {
      var items = block.trim().split('\n').map(function (line) {
        return '<li>' + line.replace(/^[\t ]*\*[\t ]+/, '') + '</li>';
      }).join('');
      return '<ul>' + items + '</ul>';
    });
    // ordered lists
    s = s.replace(/((?:^[\t ]*\d+\.[\t ]+.+\n?)+)/gm, function (block) {
      var items = block.trim().split('\n').map(function (line) {
        return '<li>' + line.replace(/^[\t ]*\d+\.[\t ]+/, '') + '</li>';
      }).join('');
      return '<ol>' + items + '</ol>';
    });
    // blockquotes
    s = s.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    // paragraphs: double newline
    s = s.replace(/\n{2,}/g, '</p><p>');
    // single newlines inside paragraphs
    s = s.replace(/\n/g, '<br/>');
    s = '<p>' + s + '</p>';
    // clean empty paragraphs
    s = s.replace(/<p>\s*<\/p>/g, '');
    s = s.replace(/<p>\s*(<h[1-4]>)/g, '$1');
    s = s.replace(/(<\/h[1-4]>)\s*<\/p>/g, '$1');
    s = s.replace(/<p>\s*(<ul>)/g, '$1');
    s = s.replace(/(<\/ul>)\s*<\/p>/g, '$1');
    s = s.replace(/<p>\s*(<ol>)/g, '$1');
    s = s.replace(/(<\/ol>)\s*<\/p>/g, '$1');
    s = s.replace(/<p>\s*(<pre>)/g, '$1');
    s = s.replace(/(<\/pre>)\s*<\/p>/g, '$1');
    s = s.replace(/<p>\s*(<hr\/>)/g, '$1');
    s = s.replace(/(<hr\/>)\s*<\/p>/g, '$1');
    s = s.replace(/<p>\s*(<blockquote>)/g, '$1');
    s = s.replace(/(<\/blockquote>)\s*<\/p>/g, '$1');
    return s;
  }

  var selectedText = "";
  var messages = [];
  var isStreaming = false;
  var attachedFile = null; // { type: "image"|"text", name, size, data (base64 or text), dataUrl? }

  function buildHTML() {
    var cfg = loadConfig();
    var endpoint = cfg.endpoint || DEFAULT_ENDPOINT;
    var panelWidth = cfg.panelWidth || 420;

    var toggle = document.createElement("button");
    toggle.id = "chatToggleBtn";
    toggle.title = "Chat with this page";
    toggle.innerHTML = "&#x1F4AC;";
    document.body.appendChild(toggle);

    var panel = document.createElement("div");
    panel.id = "chatPanel";
    panel.style.width = panelWidth + "px";
    panel.innerHTML =
      '<div id="chatResizeHandle"></div>' +
      '<div class="chat-header">' +
        '<h3><span>&#x1F4AC;</span> Page Chat</h3>' +
        '<button class="chat-close" id="chatCloseBtn">&times;</button>' +
      '</div>' +
      '<div class="chat-config" id="chatConfig">' +
        '<label>LM Studio endpoint</label>' +
        '<input type="text" id="chatEndpoint" value="' + endpoint + '" placeholder="http://localhost:1234/v1/chat/completions"/>' +
      '</div>' +
      '<div id="chatMessages"></div>' +
      '<div id="chatInputArea">' +
        '<div id="chatSelectionBar">' +
          '<span style="font-weight:600;">Context:</span> <span class="sel-text" id="chatSelText"></span>' +
          '<button id="chatSelClear" title="Clear selection">&times;</button>' +
        '</div>' +
        '<div id="chatFileBar">' +
          '<div id="chatFilePreview"></div>' +
          '<div class="file-info"><span class="file-name" id="chatFileName"></span><span class="file-size" id="chatFileSize"></span></div>' +
          '<button class="file-clear" id="chatFileClear" title="Remove file">&times;</button>' +
        '</div>' +
        '<input type="file" id="chatFileInput" accept="image/*,.txt,.md,.csv,.json,.py,.js,.html,.pdf,.log,.jsonl"/>' +
        '<div id="chatInputRow">' +
          '<button id="chatAttachBtn" title="Attach image or file">&#x1F4CE;</button>' +
          '<textarea id="chatInput" rows="1" placeholder="Ask about this page content..."></textarea>' +
          '<button id="chatSendBtn">&#x27A4;</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(panel);

    var messagesDiv = document.getElementById("chatMessages");
    var input = document.getElementById("chatInput");
    var sendBtn = document.getElementById("chatSendBtn");
    var endpointInput = document.getElementById("chatEndpoint");
    var selBar = document.getElementById("chatSelectionBar");
    var selTextEl = document.getElementById("chatSelText");
    var resizeHandle = document.getElementById("chatResizeHandle");
    var fileInput = document.getElementById("chatFileInput");
    var fileBar = document.getElementById("chatFileBar");
    var filePreviewEl = document.getElementById("chatFilePreview");
    var fileNameEl = document.getElementById("chatFileName");
    var fileSizeEl = document.getElementById("chatFileSize");

    addSystemMsg("Page content loaded as context. Select text, attach images/files, or just ask questions. Drag left edge to resize.");

    /* ===== RESIZE DRAG ===== */
    var isResizing = false;
    resizeHandle.addEventListener("mousedown", function (e) {
      isResizing = true;
      resizeHandle.classList.add("active");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      e.preventDefault();
    });
    document.addEventListener("mousemove", function (e) {
      if (!isResizing) return;
      var newW = window.innerWidth - e.clientX;
      if (newW < 320) newW = 320;
      if (newW > window.innerWidth * 0.85) newW = Math.floor(window.innerWidth * 0.85);
      panel.style.width = newW + "px";
    });
    document.addEventListener("mouseup", function () {
      if (isResizing) {
        isResizing = false;
        resizeHandle.classList.remove("active");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        var c = loadConfig();
        c.panelWidth = parseInt(panel.style.width, 10);
        saveConfig(c);
      }
    });

    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
      toggle.classList.toggle("open");
      if (panel.classList.contains("open")) input.focus();
    });

    document.getElementById("chatCloseBtn").addEventListener("click", function () {
      panel.classList.remove("open");
      toggle.classList.remove("open");
    });

    endpointInput.addEventListener("change", function () {
      var c = loadConfig();
      c.endpoint = endpointInput.value.trim();
      saveConfig(c);
    });

    document.addEventListener("mouseup", function () {
      if (isResizing) return;
      var sel = window.getSelection().toString().trim();
      if (sel && sel.length > 2) {
        selectedText = sel.substring(0, 1500);
        selTextEl.textContent = selectedText.substring(0, 80) + (selectedText.length > 80 ? "..." : "");
        selBar.classList.add("has-selection");
      }
    });

    document.getElementById("chatSelClear").addEventListener("click", function () {
      selectedText = "";
      selBar.classList.remove("has-selection");
    });

    /* ===== FILE ATTACHMENT ===== */
    document.getElementById("chatAttachBtn").addEventListener("click", function () { fileInput.click(); });
    document.getElementById("chatFileClear").addEventListener("click", clearFile);

    fileInput.addEventListener("change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      var sizeMB = (file.size / 1048576).toFixed(1);
      fileNameEl.textContent = file.name;
      fileSizeEl.textContent = sizeMB + " MB";

      if (file.type.startsWith("image/")) {
        var reader = new FileReader();
        reader.onload = function (ev) {
          attachedFile = { type: "image", name: file.name, size: file.size, dataUrl: ev.target.result };
          filePreviewEl.innerHTML = '<img class="file-preview-img" src="' + ev.target.result + '" alt="preview"/>';
          fileBar.classList.add("has-file");
        };
        reader.readAsDataURL(file);
      } else if (file.name.endsWith(".pdf")) {
        readPdfText(file, function (text) {
          attachedFile = { type: "text", name: file.name, size: file.size, text: text };
          filePreviewEl.innerHTML = '<div class="file-icon">PDF</div>';
          fileBar.classList.add("has-file");
        });
      } else {
        var reader = new FileReader();
        reader.onload = function (ev) {
          var text = ev.target.result.substring(0, 30000);
          attachedFile = { type: "text", name: file.name, size: file.size, text: text };
          var ext = file.name.split(".").pop().toUpperCase();
          filePreviewEl.innerHTML = '<div class="file-icon">' + ext + '</div>';
          fileBar.classList.add("has-file");
        };
        reader.readAsText(file);
      }
      fileInput.value = "";
    });

    function clearFile() {
      attachedFile = null;
      fileBar.classList.remove("has-file");
      filePreviewEl.innerHTML = "";
    }

    function readPdfText(file, callback) {
      if (typeof pdfjsLib !== "undefined") {
        extractPdf(file, callback);
      } else {
        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
        script.onload = function () {
          pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
          extractPdf(file, callback);
        };
        script.onerror = function () {
          var reader = new FileReader();
          reader.onload = function (ev) { callback("[PDF binary — could not extract text. Install pdf.js for extraction.]"); };
          reader.readAsText(file);
        };
        document.head.appendChild(script);
      }
    }

    function extractPdf(file, callback) {
      var reader = new FileReader();
      reader.onload = function (ev) {
        var typedArray = new Uint8Array(ev.target.result);
        pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
          var allText = [];
          var done = 0;
          for (var i = 1; i <= Math.min(pdf.numPages, 50); i++) {
            (function (pageNum) {
              pdf.getPage(pageNum).then(function (page) {
                page.getTextContent().then(function (tc) {
                  allText[pageNum - 1] = tc.items.map(function (item) { return item.str; }).join(" ");
                  done++;
                  if (done >= Math.min(pdf.numPages, 50)) {
                    callback(allText.join("\n\n").substring(0, 30000));
                  }
                });
              });
            })(i);
          }
        }).catch(function () { callback("[Could not parse PDF]"); });
      };
      reader.readAsArrayBuffer(file);
    }

    /* ===== DRAG & DROP ON PANEL ===== */
    panel.addEventListener("dragover", function (e) { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; });
    panel.addEventListener("drop", function (e) {
      e.preventDefault();
      var file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) {
        var dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event("change"));
      }
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    input.addEventListener("input", function () {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 100) + "px";
    });
    sendBtn.addEventListener("click", sendMessage);

    function addSystemMsg(text) {
      var d = document.createElement("div");
      d.className = "chat-msg system-info";
      d.textContent = text;
      messagesDiv.appendChild(d);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function addMsg(role, content, contextSnippet) {
      var d = document.createElement("div");
      d.className = "chat-msg " + role;
      if (contextSnippet) {
        var ctx = document.createElement("span");
        ctx.className = "msg-context";
        ctx.textContent = contextSnippet.substring(0, 200) + (contextSnippet.length > 200 ? "..." : "");
        d.appendChild(ctx);
      }
      var body = document.createElement("div");
      body.className = "msg-body";
      if (role === "assistant" && content) {
        body.innerHTML = md(content);
        tryRenderMath(body);
      } else {
        body.textContent = content;
      }
      d.appendChild(body);
      messagesDiv.appendChild(d);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      return body;
    }

    function tryRenderMath(el) {
      if (typeof renderMathInElement === "function") {
        try {
          renderMathInElement(el, {
            delimiters: [
              { left: "\\[", right: "\\]", display: true },
              { left: "\\(", right: "\\)", display: false }
            ],
            throwOnError: false
          });
        } catch (e) {}
      }
    }

    function addErrorMsg(text) {
      var d = document.createElement("div");
      d.className = "chat-msg error";
      d.textContent = text;
      messagesDiv.appendChild(d);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function sendMessage() {
      var userText = input.value.trim();
      if (!userText || isStreaming) return;

      var ctxSnippet = selectedText || null;
      var fileRef = attachedFile;

      // Build visible message
      var msgDiv = document.createElement("div");
      msgDiv.className = "chat-msg user";
      if (fileRef && fileRef.type === "image") {
        var img = document.createElement("img");
        img.className = "msg-image";
        img.src = fileRef.dataUrl;
        msgDiv.appendChild(img);
      } else if (fileRef && fileRef.type === "text") {
        var badge = document.createElement("span");
        badge.className = "msg-file-badge";
        badge.textContent = "\u{1F4C4} " + fileRef.name;
        msgDiv.appendChild(badge);
      }
      if (ctxSnippet) {
        var ctx = document.createElement("span");
        ctx.className = "msg-context";
        ctx.textContent = ctxSnippet.substring(0, 200) + (ctxSnippet.length > 200 ? "..." : "");
        msgDiv.appendChild(ctx);
      }
      var bodyDiv = document.createElement("div");
      bodyDiv.className = "msg-body";
      bodyDiv.textContent = userText;
      msgDiv.appendChild(bodyDiv);
      messagesDiv.appendChild(msgDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      input.value = "";
      input.style.height = "auto";

      // Build API message content
      if (fileRef && fileRef.type === "image") {
        var parts = [];
        if (ctxSnippet) parts.push({ type: "text", text: "[Selected context]:\n" + ctxSnippet + "\n\n" });
        parts.push({ type: "image_url", image_url: { url: fileRef.dataUrl } });
        parts.push({ type: "text", text: userText });
        messages.push({ role: "user", content: parts });
      } else {
        var textContent = "";
        if (ctxSnippet) textContent += "[Selected context from page]:\n" + ctxSnippet + "\n\n";
        if (fileRef && fileRef.type === "text") {
          textContent += "[Attached file: " + fileRef.name + "]:\n" + fileRef.text.substring(0, 20000) + "\n\n";
        }
        textContent += userText;
        messages.push({ role: "user", content: textContent });
      }

      selectedText = "";
      selBar.classList.remove("has-selection");
      clearFile();
      callLLM();
    }

    function callLLM() {
      isStreaming = true;
      sendBtn.disabled = true;

      var placeholder = addMsg("assistant", "");
      placeholder.classList.add("typing-dots");

      var pageCtx = getPageText();
      var pageTitle = document.title || "Study Guide";

      var systemPrompt = "You are a helpful study assistant for the NLP course COMP5046. " +
        "The student is viewing: \"" + pageTitle + "\". " +
        "Page content (truncated):\n\n" + pageCtx + "\n\n" +
        "Answer clearly using Markdown formatting (headings, bold, lists, code blocks). " +
        "Use LaTeX math with $...$ for inline and $$...$$ for display equations. " +
        "If the student selects text, it will be included as context. Be concise but thorough.";

      var apiMessages = [{ role: "system", content: systemPrompt }].concat(messages);
      var endpoint = document.getElementById("chatEndpoint").value.trim() || DEFAULT_ENDPOINT;

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          temperature: 0.4,
          max_tokens: 202752,
          stream: false
        })
      })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status + " — is LM Studio running?");
        return res.json();
      })
      .then(function (data) {
        var msg = data.choices && data.choices[0] && data.choices[0].message;
        var reply = msg && (msg.content || msg.reasoning_content || "");
        if (!reply) throw new Error("Empty response from LLM");
        placeholder.classList.remove("typing-dots");
        placeholder.innerHTML = md(reply);
        tryRenderMath(placeholder);
        messages.push({ role: "assistant", content: reply });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      })
      .catch(function (err) {
        placeholder.parentElement.remove();
        addErrorMsg("Error: " + err.message + ". Make sure LM Studio is running with the API server enabled.");
      })
      .finally(function () {
        isStreaming = false;
        sendBtn.disabled = false;
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildHTML);
  } else {
    buildHTML();
  }
})();
