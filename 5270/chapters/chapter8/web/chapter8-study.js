(function () {
  "use strict";
  var renderMath = window.chapterRenderMath || function () {};

  // ========== MORRIS COUNTER SIMULATOR ==========
  var morrisX = 0;
  var morrisTrueCount = 0;

  function morrisStep() {
    morrisTrueCount++;
    if (Math.random() < Math.pow(2, -morrisX)) {
      morrisX++;
    }
  }

  function updateMorrisDisplay() {
    document.getElementById("morrisTrueCount").textContent = morrisTrueCount;
    document.getElementById("morrisX").textContent = morrisX;
    var est = Math.pow(2, morrisX) - 1;
    document.getElementById("morrisEstimate").textContent = est;
    if (morrisTrueCount > 0) {
      var err = Math.abs(est - morrisTrueCount) / morrisTrueCount * 100;
      document.getElementById("morrisError").textContent = err.toFixed(1) + "%";
    } else {
      document.getElementById("morrisError").textContent = "0%";
    }
  }

  document.getElementById("btnMorrisStep").addEventListener("click", function () {
    morrisStep();
    updateMorrisDisplay();
  });

  document.getElementById("btnMorris10").addEventListener("click", function () {
    for (var i = 0; i < 10; i++) morrisStep();
    updateMorrisDisplay();
  });

  document.getElementById("btnMorris100").addEventListener("click", function () {
    for (var i = 0; i < 100; i++) morrisStep();
    updateMorrisDisplay();
  });

  document.getElementById("btnMorrisReset").addEventListener("click", function () {
    morrisX = 0;
    morrisTrueCount = 0;
    updateMorrisDisplay();
  });

  // ========== MISRA-GRIES SIMULATOR ==========
  var MG_K = 3;
  var MG_COLORS = {A:"#6c8cff",B:"#34d399",C:"#f87171",D:"#fbbf24",E:"#a78bfa",F:"#f472b6",G:"#fb923c"};
  var mgStream = [];
  var mgPos = 0;
  var mgCounters = {};
  var mgAutoInterval = null;
  var mgFlashVer = 0;

  function mgGenStream() {
    var a = [];
    var counts = {A:20,B:6,C:6,D:5,E:5,F:4,G:4};
    var keys = Object.keys(counts);
    for (var k = 0; k < keys.length; k++)
      for (var i = 0; i < counts[keys[k]]; i++) a.push(keys[k]);
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function mgRenderStream() {
    var el = document.getElementById("mgStream");
    el.innerHTML = "";
    if (mgPos >= mgStream.length) {
      el.innerHTML = '<span style="color:var(--text-muted);font-style:italic;">Stream complete.</span>';
      return;
    }
    var show = Math.min(15, mgStream.length - mgPos);
    for (var i = 0; i < show; i++) {
      var ch = mgStream[mgPos + i];
      var sp = document.createElement("span");
      sp.textContent = ch;
      sp.style.cssText = "display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;font-weight:700;font-size:0.85rem;color:#fff;transition:all 0.2s;background:" + MG_COLORS[ch] + ";";
      if (i === 0) {
        sp.style.outline = "2px solid #fff";
        sp.style.outlineOffset = "2px";
        sp.style.transform = "scale(1.15)";
      } else {
        sp.style.opacity = "0.4";
      }
      el.appendChild(sp);
    }
  }

  function mgRenderBars(flashKey, flashType) {
    var el = document.getElementById("mgBars");
    el.innerHTML = "";
    var keys = Object.keys(mgCounters);
    var mx = 1;
    for (var i = 0; i < keys.length; i++) if (mgCounters[keys[i]] > mx) mx = mgCounters[keys[i]];
    for (var i = 0; i < MG_K; i++) {
      var wrap = document.createElement("div");
      wrap.style.cssText = "display:flex;flex-direction:column;align-items:center;flex:1;max-width:80px;";
      var outer = document.createElement("div");
      outer.style.cssText = "width:100%;height:150px;display:flex;align-items:flex-end;justify-content:center;";
      var bar = document.createElement("div");
      bar.style.cssText = "width:100%;border-radius:6px 6px 0 0;transition:all 0.4s ease;min-height:0;position:relative;";
      if (i < keys.length) {
        var k = keys[i];
        var h = Math.max(14, (mgCounters[k] / mx) * 140);
        bar.style.height = h + "px";
        bar.style.background = MG_COLORS[k] || "var(--accent)";
        if (flashType === "shrink") {
          bar.style.boxShadow = "0 0 14px var(--red)";
        } else if (flashKey === k && flashType === "grow") {
          bar.style.boxShadow = "0 0 14px var(--green)";
        } else if (flashKey === k && flashType === "new") {
          bar.style.boxShadow = "0 0 14px var(--blue)";
        }
        var cnt = document.createElement("div");
        cnt.textContent = mgCounters[k];
        cnt.style.cssText = "color:#fff;font-weight:700;font-size:0.9rem;text-align:center;padding:2px 0;";
        bar.appendChild(cnt);
      } else {
        bar.style.height = "4px";
        bar.style.background = "var(--border)";
        bar.style.borderRadius = "2px";
      }
      outer.appendChild(bar);
      wrap.appendChild(outer);
      var lbl = document.createElement("div");
      lbl.style.cssText = "margin-top:6px;font-weight:600;font-size:0.85rem;";
      if (i < keys.length) {
        lbl.textContent = keys[i];
        lbl.style.color = MG_COLORS[keys[i]];
      } else {
        lbl.textContent = "\u2014";
        lbl.style.color = "var(--text-dim)";
      }
      wrap.appendChild(lbl);
      el.appendChild(wrap);
    }
  }

  function mgUpdateStats() {
    document.getElementById("mgPosition").textContent = mgPos + " / " + mgStream.length;
    document.getElementById("mgProcessed").textContent = mgPos;
    document.getElementById("mgActive").textContent = Object.keys(mgCounters).length;
  }

  function mgStep() {
    if (mgPos >= mgStream.length) return;
    var elem = mgStream[mgPos];
    mgPos++;
    var msg = document.getElementById("mgMessage");
    var fk = null, ft = null;

    if (mgCounters.hasOwnProperty(elem)) {
      mgCounters[elem]++;
      msg.innerHTML = '<span style="color:var(--green);">\u2713 ' + elem + ' matches counter \u2014 increment to ' + mgCounters[elem] + '</span>';
      fk = elem; ft = "grow";
    } else if (Object.keys(mgCounters).length < MG_K) {
      mgCounters[elem] = 1;
      msg.innerHTML = '<span style="color:var(--blue);">+ New counter for ' + elem + '</span>';
      fk = elem; ft = "new";
    } else {
      var ks = Object.keys(mgCounters);
      var removed = [];
      for (var i = 0; i < ks.length; i++) {
        mgCounters[ks[i]]--;
        if (mgCounters[ks[i]] <= 0) { removed.push(ks[i]); delete mgCounters[ks[i]]; }
      }
      var rm = removed.length ? " Removed: " + removed.join(", ") : "";
      msg.innerHTML = '<span style="color:var(--red);">\u2193 All counters decremented (no match for ' + elem + ').' + rm + '</span>';
      ft = "shrink";
    }

    mgRenderStream();
    mgRenderBars(fk, ft);
    mgUpdateStats();
    mgFlashVer++;
    var v = mgFlashVer;
    setTimeout(function () { if (mgFlashVer === v) mgRenderBars(null, null); }, 600);
  }

  function mgReset() {
    mgStream = mgGenStream();
    mgPos = 0;
    mgCounters = {};
    if (mgAutoInterval) { clearInterval(mgAutoInterval); mgAutoInterval = null; }
    var btn = document.getElementById("btnMGAuto");
    if (btn) btn.textContent = "Auto";
    document.getElementById("mgMessage").textContent = "";
    mgRenderStream();
    mgRenderBars(null, null);
    mgUpdateStats();
  }

  document.getElementById("btnMGStep").addEventListener("click", mgStep);

  document.getElementById("btnMGAuto").addEventListener("click", function () {
    if (mgAutoInterval) {
      clearInterval(mgAutoInterval);
      mgAutoInterval = null;
      this.textContent = "Auto";
    } else {
      this.textContent = "Pause";
      mgAutoInterval = setInterval(function () {
        if (mgPos >= mgStream.length) {
          clearInterval(mgAutoInterval);
          mgAutoInterval = null;
          document.getElementById("btnMGAuto").textContent = "Auto";
          return;
        }
        mgStep();
      }, 500);
    }
  });

  document.getElementById("btnMGReset").addEventListener("click", mgReset);
  mgReset();

})();
