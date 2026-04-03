(function () {
  "use strict";

  var STORAGE_KEY = window.CHAT_STORAGE_KEY || (function () {
    var m = location.pathname.match(/(?:comp|COMP)(\d+)|(\d{4})\//i);
    return m ? "comp" + (m[1] || m[2]) + "_chat_config" : "chat_config";
  })();

  var DEFAULT_ENDPOINT = window.CHAT_ENDPOINT ||
    (function () { try { var c = JSON.parse(localStorage.getItem(STORAGE_KEY)); return c && c.endpoint ? c.endpoint : null; } catch (e) { return null; } })() ||
    "http://localhost:1234/v1/chat/completions";

  var HISTORY_KEY = "chat_history_" + btoa(location.pathname).slice(0, 20);

  function getPageText() {
    var main = document.getElementById("mainContent") || document.querySelector("main") || document.body;
    var clone = main.cloneNode(true);
    clone.querySelectorAll("script, style, svg, nav, .chat-panel, #chatPanel, #chatToggleBtn").forEach(function (el) { el.remove(); });
    return clone.textContent.replace(/\s+/g, " ").trim().substring(0, 30000);
  }

  function loadConfig() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveConfig(cfg) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch (e) {}
  }

  /* ===== SANITIZATION ===== */
  function sanitize(html) {
    if (typeof DOMPurify !== "undefined") {
      return DOMPurify.sanitize(html, { ADD_TAGS: ["summary", "details"], ADD_ATTR: ["aria-label"] });
    }
    return html;
  }

  /* ===== LIGHTWEIGHT MARKDOWN → HTML ===== */
  function md(text) {
    if (!text) return "";
    var s = text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    s = s.replace(/```(\w*)\n([\s\S]*?)```/g, function (_, lang, code) {
      return '<pre><code>' + code.trim() + '</code></pre>';
    });
    s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    s = s.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    s = s.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    s = s.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    s = s.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    s = s.replace(/^---+$/gm, '<hr/>');
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    s = s.replace(/\$\$([^$]+?)\$\$/g, '\\[$1\\]');
    s = s.replace(/\$([^$\n]+?)\$/g, '\\($1\\)');
    s = s.replace(/((?:^[\t ]*\*[\t ]+.+\n?)+)/gm, function (block) {
      var items = block.trim().split('\n').map(function (line) {
        return '<li>' + line.replace(/^[\t ]*\*[\t ]+/, '') + '</li>';
      }).join('');
      return '<ul>' + items + '</ul>';
    });
    s = s.replace(/((?:^[\t ]*\d+\.[\t ]+.+\n?)+)/gm, function (block) {
      var items = block.trim().split('\n').map(function (line) {
        return '<li>' + line.replace(/^[\t ]*\d+\.[\t ]+/, '') + '</li>';
      }).join('');
      return '<ol>' + items + '</ol>';
    });
    s = s.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    s = s.replace(/\n{2,}/g, '</p><p>');
    s = s.replace(/\n/g, '<br/>');
    s = '<p>' + s + '</p>';
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

  function loadHistory() {
    try { var h = JSON.parse(localStorage.getItem(HISTORY_KEY)); return Array.isArray(h) ? h : []; } catch (e) { return []; }
  }
  function saveHistory(msgs) {
    try {
      var trimmed = msgs.slice(-100);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch (e) {}
  }

  var selectedText = "";
  var messages = [];
  var historyLoaded = false;
  var isStreaming = false;
  var attachedFile = null;
  var availableModels = [];
  var VISION_PATTERNS = /vl|vision|llava|cogvlm|minicpm-v|qvq|pixtral|internvl/i;

  function getBaseUrl(endpoint) {
    var match = endpoint.match(/^(https?:\/\/[^/]+)/);
    return match ? match[1] : null;
  }

  function fetchModels(endpoint, callback) {
    var baseUrl = getBaseUrl(endpoint);
    if (!baseUrl) { callback([]); return; }

    fetch(baseUrl + "/v1/models")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var models = [];
        if (data.data && data.data.length > 0) {
          models = data.data
            .filter(function (m) { return m.id && !/embed/i.test(m.id); })
            .map(function (m) { return m.id; });
        }
        availableModels = models;
        callback(models);
      })
      .catch(function () { callback([]); });
  }

  function buildHTML() {
    if (typeof DOMPurify === "undefined") {
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js";
      s.async = true;
      document.head.appendChild(s);
    }

    var cfg = loadConfig();
    var endpoint = cfg.endpoint || DEFAULT_ENDPOINT;
    var panelWidth = cfg.panelWidth || 420;

    var toggle = document.createElement("button");
    toggle.id = "chatToggleBtn";
    toggle.title = "Chat with this page";
    toggle.setAttribute("aria-label", "Open chat panel");
    toggle.innerHTML = "&#x1F4AC;";
    document.body.appendChild(toggle);

    var panel = document.createElement("div");
    panel.id = "chatPanel";
    panel.setAttribute("role", "complementary");
    panel.setAttribute("aria-label", "Chat panel");
    panel.style.width = panelWidth + "px";
    panel.innerHTML =
      '<div id="chatResizeHandle"></div>' +
      '<div class="chat-header">' +
        '<h3><span>&#x1F4AC;</span> Page Chat</h3>' +
        '<button class="chat-clear" id="chatClearBtn" title="Clear conversation" aria-label="Clear conversation">&#x1F5D1;</button>' +
        '<button class="chat-close" id="chatCloseBtn" aria-label="Close chat panel">&times;</button>' +
      '</div>' +
      '<div class="chat-config" id="chatConfig">' +
        '<label>LM Studio endpoint</label>' +
        '<input type="text" id="chatEndpoint" value="' + endpoint + '" placeholder="http://localhost:1234/v1/chat/completions"/>' +
        '<label>Model</label>' +
        '<div class="chat-model-row">' +
          '<select id="chatModelSelect"><option value="">Loading models…</option></select>' +
          '<button id="chatModelRefresh" title="Refresh models">&#x21BB;</button>' +
        '</div>' +
        '<label>Vision Model <span class="label-hint">(for image descriptions)</span></label>' +
        '<div class="chat-model-row">' +
          '<select id="chatVisionModelSelect"><option value="">Loading…</option></select>' +
        '</div>' +
      '</div>' +
      '<div id="chatMessages" role="log" aria-live="polite"></div>' +
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
          '<button id="chatAttachBtn" title="Attach image or file" aria-label="Attach image or file">&#x1F4CE;</button>' +
          '<textarea id="chatInput" rows="1" placeholder="Ask about this page content..." aria-label="Chat message input"></textarea>' +
          '<button id="chatSendBtn" aria-label="Send message">&#x27A4;</button>' +
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

    var modelSelect = document.getElementById("chatModelSelect");
    var modelRefreshBtn = document.getElementById("chatModelRefresh");
    var visionModelSelect = document.getElementById("chatVisionModelSelect");

    function getSelectedModel() {
      return modelSelect.value || "";
    }

    function getSelectedVisionModel() {
      return visionModelSelect.value || "";
    }

    function populateModelSelect(models) {
      var cfg = loadConfig();
      var savedModel = cfg.model || "";
      var savedVision = cfg.visionModel || "";

      modelSelect.innerHTML = "";
      visionModelSelect.innerHTML = "";

      if (models.length === 0) {
        modelSelect.innerHTML = '<option value="">No models found</option>';
        visionModelSelect.innerHTML = '<option value="">No vision models</option>';
        return;
      }

      var visionModels = models.filter(function (m) { return VISION_PATTERNS.test(m); });

      for (var i = 0; i < models.length; i++) {
        var opt = document.createElement("option");
        opt.value = models[i];
        opt.textContent = models[i] + (VISION_PATTERNS.test(models[i]) ? " \uD83D\uDC41" : "");
        if (models[i] === savedModel) opt.selected = true;
        modelSelect.appendChild(opt);
      }
      if (!savedModel || models.indexOf(savedModel) === -1) {
        modelSelect.selectedIndex = 0;
      }

      if (visionModels.length === 0) {
        visionModelSelect.innerHTML = '<option value="">No vision models available</option>';
      } else {
        for (var j = 0; j < visionModels.length; j++) {
          var vopt = document.createElement("option");
          vopt.value = visionModels[j];
          vopt.textContent = visionModels[j];
          if (visionModels[j] === savedVision) vopt.selected = true;
          visionModelSelect.appendChild(vopt);
        }
        if (!savedVision || visionModels.indexOf(savedVision) === -1) {
          visionModelSelect.selectedIndex = 0;
        }
      }

      var c = loadConfig();
      c.model = getSelectedModel();
      c.visionModel = getSelectedVisionModel();
      saveConfig(c);
    }

    function refreshModels() {
      var ep = endpointInput.value.trim() || DEFAULT_ENDPOINT;
      modelSelect.innerHTML = '<option value="">Loading…</option>';
      visionModelSelect.innerHTML = '<option value="">Loading…</option>';
      fetchModels(ep, populateModelSelect);
    }

    modelSelect.addEventListener("change", function () {
      var c = loadConfig();
      c.model = getSelectedModel();
      saveConfig(c);
    });

    visionModelSelect.addEventListener("change", function () {
      var c = loadConfig();
      c.visionModel = getSelectedVisionModel();
      saveConfig(c);
    });

    modelRefreshBtn.addEventListener("click", refreshModels);

    refreshModels();

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
      if (panel.classList.contains("open")) {
        if (!historyLoaded) {
          historyLoaded = true;
          replayHistory();
        }
        input.focus();
        if (availableModels.length === 0) refreshModels();
      }
    });

    document.getElementById("chatCloseBtn").addEventListener("click", function () {
      panel.classList.remove("open");
      toggle.classList.remove("open");
    });

    document.getElementById("chatClearBtn").addEventListener("click", function () {
      messages = [];
      try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
      messagesDiv.innerHTML = "";
      addSystemMsg("Page content loaded as context. Select text, attach images/files, or just ask questions. Drag left edge to resize.");
    });

    endpointInput.addEventListener("change", function () {
      var c = loadConfig();
      c.endpoint = endpointInput.value.trim();
      saveConfig(c);
      refreshModels();
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

    function replayHistory() {
      var saved = loadHistory();
      if (saved.length === 0) return;
      messages = saved;
      for (var i = 0; i < saved.length; i++) {
        var m = saved[i];
        var text = typeof m.content === "string" ? m.content : "(multipart message)";
        addMsg(m.role, text);
      }
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
        body.innerHTML = sanitize(md(content));
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

    function describeImage(imageUrl, userText, visionModel, endpoint) {
      return fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: visionModel,
          messages: [
            { role: "system", content: "You are a vision assistant helping a student. Describe the image in detail, including all text, formulas, diagrams, and structure. Output your description as plain text that another AI can use to answer questions about this image." },
            { role: "user", content: [
              { type: "image_url", image_url: { url: imageUrl } },
              { type: "text", text: userText || "Describe this image in detail." }
            ]}
          ],
          temperature: 0.3,
          stream: false
        })
      })
      .then(function (res) {
        if (!res.ok) throw new Error("Vision model returned HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        var msg = data.choices && data.choices[0] && data.choices[0].message;
        return (msg && (msg.content || msg.reasoning_content)) || "[Vision model returned empty description]";
      });
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
      saveHistory(messages);
      callLLM();
    }

    function callLLM() {
      isStreaming = true;
      sendBtn.disabled = true;

      var msgWrapper = document.createElement("div");
      msgWrapper.className = "chat-msg assistant";
      var thinkingEl = document.createElement("details");
      thinkingEl.className = "msg-thinking";
      thinkingEl.innerHTML = '<summary>Thinking…</summary><div class="thinking-body"></div>';
      var bodyEl = document.createElement("div");
      bodyEl.className = "msg-body";
      bodyEl.innerHTML = '<span class="stream-cursor">▊</span>';
      msgWrapper.appendChild(thinkingEl);
      msgWrapper.appendChild(bodyEl);
      messagesDiv.appendChild(msgWrapper);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      var thinkingBody = thinkingEl.querySelector(".thinking-body");
      var thinkingText = "";
      var contentText = "";
      var hasThinking = false;

      var pageCtx = getPageText();
      var pageTitle = document.title || "Study Guide";

      var systemPrompt = "You are a helpful study assistant. The student is studying: \"" + pageTitle + "\". " +
        "Page content (truncated):\n\n" + pageCtx + "\n\n" +
        "Answer clearly using Markdown formatting (headings, bold, lists, code blocks). " +
        "Use LaTeX math with $...$ for inline and $$...$$ for display equations. " +
        "If the student selects text, it will be included as context. Be concise but thorough.";

      var apiMessages = [{ role: "system", content: systemPrompt }].concat(messages);
      var endpoint = document.getElementById("chatEndpoint").value.trim() || DEFAULT_ENDPOINT;

      var selectedModel = getSelectedModel();
      if (!selectedModel) {
        msgWrapper.remove();
        addErrorMsg("Please select a model from the dropdown above.");
        isStreaming = false;
        sendBtn.disabled = false;
        return;
      }

      var isVisionModel = VISION_PATTERNS.test(selectedModel);
      var visionModel = getSelectedVisionModel();

      var hasVisionContent = apiMessages.some(function (m) {
        return Array.isArray(m.content) && m.content.some(function (p) { return p.type === "image_url"; });
      });

      function replaceImagesWithDescriptions(msgs, descriptions) {
        var descIdx = 0;
        return msgs.map(function (m) {
          if (typeof m.content === "string") return m;
          if (!Array.isArray(m.content)) return m;
          var newParts = [];
          for (var k = 0; k < m.content.length; k++) {
            if (m.content[k].type === "image_url") {
              newParts.push({ type: "text", text: "[Image description from vision model]:\n" + (descriptions[descIdx++] || "(no description)") });
            } else {
              newParts.push(m.content[k]);
            }
          }
          var combinedText = newParts.map(function (p) { return p.text || ""; }).join("\n");
          return { role: m.role, content: combinedText };
        });
      }

      function collectImageUrls(msgs) {
        var urls = [];
        var texts = [];
        msgs.forEach(function (m) {
          if (!Array.isArray(m.content)) return;
          var msgText = m.content.filter(function (p) { return p.type === "text"; }).map(function (p) { return p.text; }).join(" ");
          m.content.forEach(function (p) {
            if (p.type === "image_url") {
              urls.push(p.image_url.url);
              texts.push(msgText);
            }
          });
        });
        return { urls: urls, texts: texts };
      }

      function buildBody(msgs) {
        return {
          model: selectedModel,
          messages: msgs,
          temperature: 0.4,
          stream: true
        };
      }

      function processSSE(response) {
        var reader = response.body.getReader();
        var decoder = new TextDecoder();
        var buffer = "";
        var renderTimer = null;
        var contentDirty = false;
        var thinkingDirty = false;

        function scheduleRender() {
          if (renderTimer) return;
          renderTimer = requestAnimationFrame(function () {
            renderTimer = null;
            if (contentDirty) {
              contentDirty = false;
              bodyEl.innerHTML = sanitize(md(contentText)) + '<span class="stream-cursor">▊</span>';
              tryRenderMath(bodyEl);
            }
            if (thinkingDirty) {
              thinkingDirty = false;
              thinkingBody.textContent = thinkingText;
            }
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          });
        }

        function read() {
          return reader.read().then(function (result) {
            if (result.done) {
              if (renderTimer) { cancelAnimationFrame(renderTimer); renderTimer = null; }
              finishStream();
              return;
            }
            buffer += decoder.decode(result.value, { stream: true });
            var lines = buffer.split("\n");
            buffer = lines.pop();

            for (var i = 0; i < lines.length; i++) {
              var line = lines[i].trim();
              if (!line || line === "data: [DONE]" || line === "data:[DONE]") continue;
              var jsonStr = null;
              if (line.indexOf("data: ") === 0) jsonStr = line.substring(6);
              else if (line.indexOf("data:") === 0) jsonStr = line.substring(5);
              if (!jsonStr) continue;
              try {
                var json = JSON.parse(jsonStr);
                var delta = json.choices && json.choices[0] && json.choices[0].delta;
                if (!delta) continue;

                if (delta.reasoning_content) {
                  if (!hasThinking) {
                    hasThinking = true;
                    thinkingEl.style.display = "block";
                    thinkingEl.open = true;
                  }
                  thinkingText += delta.reasoning_content;
                  thinkingDirty = true;
                }

                if (delta.content) {
                  if (hasThinking && thinkingEl.open) {
                    thinkingEl.open = false;
                    var summary = thinkingEl.querySelector("summary");
                    var wordCount = thinkingText.trim().split(/\s+/).length;
                    summary.textContent = "Thought for " + wordCount + " words";
                  }
                  contentText += delta.content;
                  contentDirty = true;
                }
              } catch (e) {}
            }
            if (contentDirty || thinkingDirty) scheduleRender();
            return read();
          });
        }
        return read();
      }

      function finishStream() {

        if (!hasThinking) {
          thinkingEl.remove();
        } else {
          thinkingEl.querySelector(".thinking-body").innerHTML = sanitize(md(thinkingText));
          tryRenderMath(thinkingEl.querySelector(".thinking-body"));
          var summary = thinkingEl.querySelector("summary");
          var wordCount = thinkingText.trim().split(/\s+/).length;
          summary.textContent = "Thought for " + wordCount + " words";
        }

        if (contentText) {
          bodyEl.innerHTML = sanitize(md(contentText));
          tryRenderMath(bodyEl);
        } else if (thinkingText && !contentText) {
          bodyEl.innerHTML = sanitize(md(thinkingText));
          tryRenderMath(bodyEl);
          if (hasThinking) thinkingEl.remove();
        }

        messages.push({ role: "assistant", content: contentText || thinkingText || "" });
        saveHistory(messages);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        isStreaming = false;
        sendBtn.disabled = false;
      }

      function handleError(err) {
        msgWrapper.remove();
        addErrorMsg("Error: " + err.message);
        isStreaming = false;
        sendBtn.disabled = false;
      }

      function doMainRequest(msgs) {
        return fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildBody(msgs))
        }).then(function (res) {
          if (!res.ok) {
            return res.text().then(function (body) {
              var detail = "";
              try { detail = JSON.parse(body).error.message || body; } catch (e) { detail = body; }
              throw new Error("HTTP " + res.status + ": " + detail.substring(0, 200));
            });
          }
          return processSSE(res);
        });
      }

      if (hasVisionContent && !isVisionModel) {
        if (!visionModel) {
          addSystemMsg("\u26A0 No vision model selected — images cannot be analyzed. Choose one in the Vision Model dropdown.");
          var fallbackMsgs = replaceImagesWithDescriptions(apiMessages, []);
          doMainRequest(fallbackMsgs).catch(handleError);
        } else {
          var imageData = collectImageUrls(apiMessages);
          addSystemMsg("\uD83D\uDC41 Analyzing " + imageData.urls.length + " image(s) with " + visionModel + "…");

          var descriptionPromises = imageData.urls.map(function (url, idx) {
            return describeImage(url, imageData.texts[idx], visionModel, endpoint);
          });

          Promise.all(descriptionPromises)
            .then(function (descriptions) {
              var enrichedMsgs = replaceImagesWithDescriptions(apiMessages, descriptions);
              return doMainRequest(enrichedMsgs);
            })
            .catch(handleError);
        }
      } else {
        doMainRequest(apiMessages).catch(handleError);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildHTML);
  } else {
    buildHTML();
  }
})();
