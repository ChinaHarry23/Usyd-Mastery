(function () {
  "use strict";
  var renderMath = window.chapterRenderMath || function () {};

  // ========== BLOOM FILTER SIMULATOR ==========
  var bfBits = [];
  var bfInsertedSet = {};
  var bfInsertCount = 0;
  var bfM = 16;
  var bfT = 3;
  var bfSeeds = [];

  function bfSimpleHash(str, seed, mod) {
    var h = seed;
    for (var i = 0; i < str.length; i++) {
      h = ((h * 31) + str.charCodeAt(i) + seed * 7) & 0x7fffffff;
    }
    return h % mod;
  }

  function bfInitSeeds() {
    bfSeeds = [];
    for (var i = 0; i < bfT; i++) {
      bfSeeds.push(Math.floor(Math.random() * 100000) + 1);
    }
  }

  function bfReset() {
    bfM = parseInt(document.getElementById("sliderBFBits").value);
    bfT = parseInt(document.getElementById("sliderBFHash").value);
    bfBits = [];
    for (var i = 0; i < bfM; i++) bfBits.push(0);
    bfInsertedSet = {};
    bfInsertCount = 0;
    bfInitSeeds();
    bfRenderBitArray();
    document.getElementById("bfInserted").textContent = "0";
    document.getElementById("bfBitsSet").textContent = "0";
    document.getElementById("bfFPRate").textContent = "-";
    document.getElementById("bfTheoryFP").textContent = "-";
    document.getElementById("bfMessage").textContent = "";
  }

  function bfRenderBitArray() {
    var container = document.getElementById("bfBitArray");
    container.innerHTML = "";
    for (var i = 0; i < bfBits.length; i++) {
      var span = document.createElement("span");
      span.textContent = bfBits[i];
      span.style.cssText = "width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; border-radius:4px; font-weight:600; font-size:0.75rem; " +
        (bfBits[i] ? "background:var(--accent); color:#fff;" : "background:var(--bg-card); border:1px solid var(--border); color:var(--text-dim);");
      span.id = "bfbit-" + i;
      container.appendChild(span);
    }
  }

  function bfGetPositions(str) {
    var positions = [];
    for (var i = 0; i < bfT; i++) {
      positions.push(bfSimpleHash(str, bfSeeds[i], bfM));
    }
    return positions;
  }

  function bfInsert(str) {
    if (!str) return;
    var positions = bfGetPositions(str);
    for (var i = 0; i < positions.length; i++) {
      bfBits[positions[i]] = 1;
    }
    if (!bfInsertedSet[str]) {
      bfInsertedSet[str] = true;
      bfInsertCount++;
    }
    bfUpdateDisplay();
    bfRenderBitArray();
    bfHighlightPositions(positions, "var(--green)");
  }

  function bfLookup(str) {
    if (!str) return false;
    var positions = bfGetPositions(str);
    var allSet = true;
    for (var i = 0; i < positions.length; i++) {
      if (!bfBits[positions[i]]) { allSet = false; break; }
    }
    bfHighlightPositions(positions, allSet ? "var(--yellow)" : "var(--red)");
    return allSet;
  }

  function bfHighlightPositions(positions, color) {
    for (var i = 0; i < positions.length; i++) {
      var el = document.getElementById("bfbit-" + positions[i]);
      if (el) {
        el.style.outline = "2px solid " + color;
        el.style.outlineOffset = "1px";
      }
    }
    setTimeout(function () {
      for (var i = 0; i < positions.length; i++) {
        var el = document.getElementById("bfbit-" + positions[i]);
        if (el) { el.style.outline = "none"; }
      }
    }, 1200);
  }

  function bfUpdateDisplay() {
    document.getElementById("bfInserted").textContent = bfInsertCount;
    var onesCount = 0;
    for (var i = 0; i < bfBits.length; i++) { if (bfBits[i]) onesCount++; }
    document.getElementById("bfBitsSet").textContent = onesCount + "/" + bfM;
    if (bfInsertCount > 0) {
      var nT = bfInsertCount * bfT;
      var theory = Math.pow(1 - Math.exp(-nT / bfM), bfT);
      document.getElementById("bfTheoryFP").textContent = (theory * 100).toFixed(2) + "%";
    }
  }

  document.getElementById("sliderBFBits").addEventListener("input", function () {
    document.getElementById("valBFBits").textContent = this.value;
  });
  document.getElementById("sliderBFHash").addEventListener("input", function () {
    document.getElementById("valBFHash").textContent = this.value;
  });

  document.getElementById("btnBFInsert").addEventListener("click", function () {
    var val = document.getElementById("bfInput").value.trim();
    if (!val) return;
    bfInsert(val);
    var zh = typeof getLang === "function" && getLang() === "zh";
    document.getElementById("bfMessage").innerHTML =
      '<span style="color:var(--green);">' + (zh ? "\u2713 \u5df2\u63d2\u5165: " : "\u2713 Inserted: ") + val + "</span>";
    document.getElementById("bfInput").value = "";
  });

  document.getElementById("btnBFLookup").addEventListener("click", function () {
    var val = document.getElementById("bfInput").value.trim();
    if (!val) return;
    var found = bfLookup(val);
    var actual = !!bfInsertedSet[val];
    var zh = typeof getLang === "function" && getLang() === "zh";
    if (found && actual) {
      document.getElementById("bfMessage").innerHTML =
        '<span style="color:var(--green);">' + (zh ? "\u2713 \u627e\u5230 (true positive): " : "\u2713 Found (true positive): ") + val + "</span>";
    } else if (found && !actual) {
      document.getElementById("bfMessage").innerHTML =
        '<span style="color:var(--yellow);">\u26a0 ' + (zh ? "\u5047\u9633\u6027! " : "False positive! ") + val + (zh ? " \u4e0d\u5728\u96c6\u5408\u4e2d\u4f46\u8fc7\u6ee4\u5668\u62a5\u544a\u627e\u5230" : " is NOT in the set but filter reports found") + "</span>";
    } else {
      document.getElementById("bfMessage").innerHTML =
        '<span style="color:var(--text-muted);">\u2717 ' + (zh ? "\u672a\u627e\u5230: " : "Not found: ") + val + "</span>";
    }
  });

  document.getElementById("btnBFTest100").addEventListener("click", function () {
    var fpCount = 0;
    var testCount = 100;
    for (var i = 0; i < testCount; i++) {
      var rnd = "rnd_" + Math.random().toString(36).substring(2, 10);
      if (!bfInsertedSet[rnd] && bfLookup(rnd)) fpCount++;
    }
    var rate = (fpCount / testCount * 100).toFixed(1);
    document.getElementById("bfFPRate").textContent = rate + "%";
    var zh = typeof getLang === "function" && getLang() === "zh";
    document.getElementById("bfMessage").innerHTML =
      (zh ? "\u6d4b\u8bd5\u4e86 100 \u4e2a\u968f\u673a\u5143\u7d20\uff0c" : "Tested 100 random elements, ") +
      fpCount + (zh ? " \u4e2a\u5047\u9633\u6027 (" : " false positives (") + rate + "%)";
  });

  document.getElementById("btnBFReset").addEventListener("click", bfReset);

  bfReset();

  // ========== CUCKOO HASHING SIMULATOR ==========
  var CUCKOO_SIZE = 7;
  var CUCKOO_MAX_KICKS = 6;
  var cuckooT1 = new Array(CUCKOO_SIZE).fill(null);
  var cuckooT2 = new Array(CUCKOO_SIZE).fill(null);
  var cuckooItemCount = 0;
  var cuckooAnimating = false;
  var CUCKOO_PAL = ["#6c8cff","#34d399","#f87171","#fbbf24","#a78bfa","#f472b6","#fb923c","#22d3ee","#84cc16","#e879f9"];

  function cuckooH1(x) { return ((x % CUCKOO_SIZE) + CUCKOO_SIZE) % CUCKOO_SIZE; }
  function cuckooH2(x) { return Math.floor(Math.abs(x) / CUCKOO_SIZE) % CUCKOO_SIZE; }

  function cuckooCellColor(v) {
    return CUCKOO_PAL[((v % CUCKOO_PAL.length) + CUCKOO_PAL.length) % CUCKOO_PAL.length];
  }

  function cuckooRenderTable(arr, cid, prefix) {
    var el = document.getElementById(cid);
    el.innerHTML = "";
    for (var i = 0; i < CUCKOO_SIZE; i++) {
      var d = document.createElement("div");
      d.id = prefix + i;
      d.style.cssText = "display:flex;align-items:center;height:36px;border-radius:var(--radius-sm);padding:0 0.75rem;font-family:var(--font-mono);font-size:0.85rem;font-weight:600;transition:all 0.3s;";
      if (arr[i] !== null) {
        d.style.background = cuckooCellColor(arr[i]);
        d.style.color = "#fff";
        d.textContent = "[" + i + "] " + arr[i];
      } else {
        d.style.background = "var(--bg)";
        d.style.border = "1px solid var(--border)";
        d.style.color = "var(--text-dim)";
        d.textContent = "[" + i + "] \u2014";
      }
      el.appendChild(d);
    }
  }

  function cuckooRender() {
    cuckooRenderTable(cuckooT1, "cuckooT1", "ct1-");
    cuckooRenderTable(cuckooT2, "cuckooT2", "ct2-");
  }

  function cuckooFlash(id, color) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.boxShadow = "0 0 12px " + color + ", inset 0 0 8px " + color;
    setTimeout(function () {
      var e = document.getElementById(id);
      if (e) e.style.boxShadow = "none";
    }, 600);
  }

  function cuckooLogMsg(msg) {
    var el = document.getElementById("cuckooLog");
    el.innerHTML += msg + "<br>";
    el.scrollTop = el.scrollHeight;
  }

  function cuckooSetBtns(on) {
    document.getElementById("btnCuckooInsert").disabled = !on;
    document.getElementById("btnCuckooRandom").disabled = !on;
  }

  function cuckooInsert(key) {
    if (cuckooAnimating) return;
    var s1 = cuckooH1(key), s2 = cuckooH2(key);
    if (cuckooT1[s1] === key || cuckooT2[s2] === key) {
      cuckooLogMsg('<span style="color:var(--text-muted);">\u2298 ' + key + ' already in table</span>');
      return;
    }
    cuckooAnimating = true;
    cuckooSetBtns(false);
    cuckooLogMsg('<span style="color:var(--accent);">\u25B6 Insert(' + key + '): h\u2081=' + cuckooH1(key) + ', h\u2082=' + cuckooH2(key) + '</span>');

    var x = key, useT1 = true, kicks = 0;

    function step() {
      if (kicks > CUCKOO_MAX_KICKS) {
        cuckooLogMsg('<span style="color:var(--red);">\u2717 FAILED after ' + CUCKOO_MAX_KICKS + ' kicks \u2014 needs rehash!</span>');
        document.getElementById("cuckooKicks").textContent = kicks;
        document.getElementById("cuckooStatus").textContent = "Failed!";
        document.getElementById("cuckooStatus").style.color = "var(--red)";
        cuckooAnimating = false;
        cuckooSetBtns(true);
        return;
      }
      var slot, tbl, prefix;
      if (useT1) {
        slot = cuckooH1(x); tbl = cuckooT1; prefix = "ct1-";
      } else {
        slot = cuckooH2(x); tbl = cuckooT2; prefix = "ct2-";
      }
      var tName = useT1 ? "T1" : "T2";
      if (tbl[slot] === null) {
        tbl[slot] = x;
        cuckooItemCount++;
        cuckooRender();
        cuckooFlash(prefix + slot, "var(--green)");
        cuckooLogMsg('<span style="color:var(--green);">\u2713 Place ' + x + ' \u2192 ' + tName + '[' + slot + ']</span>');
        document.getElementById("cuckooStored").textContent = cuckooItemCount;
        document.getElementById("cuckooKicks").textContent = kicks;
        document.getElementById("cuckooStatus").textContent = "Success";
        document.getElementById("cuckooStatus").style.color = "var(--green)";
        cuckooAnimating = false;
        cuckooSetBtns(true);
      } else {
        var evicted = tbl[slot];
        tbl[slot] = x;
        cuckooRender();
        cuckooFlash(prefix + slot, "var(--red)");
        cuckooLogMsg('<span style="color:var(--yellow);">\u21bb Kick ' + evicted + ' from ' + tName + '[' + slot + '], place ' + x + '</span>');
        x = evicted;
        useT1 = !useT1;
        kicks++;
        setTimeout(step, 400);
      }
    }
    step();
  }

  function cuckooReset() {
    cuckooT1 = new Array(CUCKOO_SIZE).fill(null);
    cuckooT2 = new Array(CUCKOO_SIZE).fill(null);
    cuckooItemCount = 0;
    cuckooAnimating = false;
    document.getElementById("cuckooLog").innerHTML = "";
    document.getElementById("cuckooStored").textContent = "0";
    document.getElementById("cuckooKicks").textContent = "0";
    document.getElementById("cuckooStatus").textContent = "Ready";
    document.getElementById("cuckooStatus").style.color = "var(--text)";
    cuckooSetBtns(true);
    cuckooRender();
  }

  document.getElementById("btnCuckooInsert").addEventListener("click", function () {
    var val = parseInt(document.getElementById("cuckooInput").value);
    if (isNaN(val) || val < 0) return;
    cuckooInsert(val);
    document.getElementById("cuckooInput").value = "";
  });

  document.getElementById("cuckooInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") document.getElementById("btnCuckooInsert").click();
  });

  document.getElementById("btnCuckooRandom").addEventListener("click", function () {
    var val, tries = 0;
    do {
      val = Math.floor(Math.random() * 100);
      tries++;
    } while (tries < 300 && (cuckooT1[cuckooH1(val)] === val || cuckooT2[cuckooH2(val)] === val));
    cuckooInsert(val);
  });

  document.getElementById("btnCuckooReset").addEventListener("click", cuckooReset);
  cuckooReset();
})();
