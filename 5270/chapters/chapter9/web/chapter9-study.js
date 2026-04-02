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

  // ========== SIDEBAR ==========
  var sidebar = document.getElementById("sidebar");
  var sidebarToggle = document.getElementById("sidebarToggle");
  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
  });
  document.getElementById("mainContent").addEventListener("click", function () {
    if (sidebar.classList.contains("open")) sidebar.classList.remove("open");
  });

  // ========== SCROLL SPY & PROGRESS ==========
  var sections = document.querySelectorAll(".section[data-track]");
  var navLinks = document.querySelectorAll(".nav-link");
  var visited = new Set();

  function updateProgress() {
    visited.add("hero");
    var pct = (visited.size / sections.length) * 100;
    document.getElementById("progressFill").style.width = pct + "%";
    document.getElementById("progressText").textContent =
      visited.size + " / " + sections.length;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.dataset.track;
          visited.add(id);
          updateProgress();
          navLinks.forEach(function (l) {
            l.classList.toggle("active", l.dataset.section === e.target.id);
          });
        }
      });
    },
    { rootMargin: "-20% 0px -60% 0px" }
  );
  sections.forEach(function (s) {
    observer.observe(s);
  });

  // ========== PROOF TOGGLES ==========
  document.querySelectorAll(".proof-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.dataset.target);
      var isOpen = target.classList.contains("open");
      target.classList.toggle("open");
      btn.classList.toggle("open");
      if (!isOpen) renderMath();
    });
  });

  // ========== SOLUTION TOGGLES ==========
  document.querySelectorAll(".solution-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.dataset.target);
      var isOpen = target.classList.contains("open");
      target.classList.toggle("open");
      var zh = typeof getLang === "function" && getLang() === "zh";
      btn.textContent = isOpen
        ? zh ? "\u67e5\u770b\u89e3\u7b54" : "Show Solution"
        : zh ? "\u9690\u85cf\u89e3\u7b54" : "Hide Solution";
      if (!isOpen) renderMath();
    });
  });

  // ========== COUNTMINSKETCH SIMULATOR ==========
  var CMS_T = 3;
  var CMS_K = 7;
  var cmsGrid = [];
  var cmsTrue = {};
  var cmsTotalInserted = 0;
  var cmsHashSeeds = [];

  function cmsInit() {
    cmsGrid = [];
    for (var t = 0; t < CMS_T; t++) {
      cmsGrid.push(new Array(CMS_K).fill(0));
    }
    cmsTrue = {};
    cmsTotalInserted = 0;
    cmsHashSeeds = [];
    for (var t2 = 0; t2 < CMS_T; t2++) {
      cmsHashSeeds.push({
        a: Math.floor(Math.random() * 9973) + 1,
        b: Math.floor(Math.random() * 9973)
      });
    }
  }

  function cmsHash(t, j) {
    var s = cmsHashSeeds[t];
    return ((s.a * j + s.b) % 9973) % CMS_K;
  }

  function cmsInsert(j) {
    cmsTotalInserted++;
    cmsTrue[j] = (cmsTrue[j] || 0) + 1;
    for (var t = 0; t < CMS_T; t++) {
      cmsGrid[t][cmsHash(t, j)]++;
    }
  }

  function cmsQuery(j) {
    var minVal = Infinity;
    for (var t = 0; t < CMS_T; t++) {
      var v = cmsGrid[t][cmsHash(t, j)];
      if (v < minVal) minVal = v;
    }
    return minVal;
  }

  function cmsRenderGrid(highlightJ) {
    var container = document.getElementById("cmsGrid");
    var html = '<table class="styled-table" style="width:100%; font-size:0.85rem; text-align:center;">';
    html += "<thead><tr><th></th>";
    for (var c = 0; c < CMS_K; c++) {
      html += "<th>" + c + "</th>";
    }
    html += "</tr></thead><tbody>";
    for (var t = 0; t < CMS_T; t++) {
      html += "<tr><td style=\"font-weight:600;\">h" + (t + 1) + "</td>";
      for (var c2 = 0; c2 < CMS_K; c2++) {
        var isHL = highlightJ !== undefined && cmsHash(t, highlightJ) === c2;
        var style = isHL
          ? "background:var(--accent-glow); font-weight:700; color:var(--accent);"
          : "";
        html += '<td style="' + style + '">' + cmsGrid[t][c2] + "</td>";
      }
      html += "</tr>";
    }
    html += "</tbody></table>";
    container.innerHTML = html;
  }

  function cmsUpdateStats(j) {
    document.getElementById("cmsTotalInserted").textContent = cmsTotalInserted;
    if (j !== undefined) {
      var trueF = cmsTrue[j] || 0;
      var estF = cmsQuery(j);
      document.getElementById("cmsTrueFreq").textContent = trueF;
      document.getElementById("cmsEstFreq").textContent = estF;
      document.getElementById("cmsOverest").textContent = "+" + (estF - trueF);
    }
  }

  cmsInit();
  cmsRenderGrid();
  cmsUpdateStats();

  document.getElementById("btnCmsInsert").addEventListener("click", function () {
    var j = parseInt(document.getElementById("cmsInput").value) || 1;
    cmsInsert(j);
    cmsRenderGrid(j);
    cmsUpdateStats(j);
  });

  document.getElementById("btnCmsInsert10").addEventListener("click", function () {
    var lastJ = 1;
    for (var i = 0; i < 10; i++) {
      lastJ = Math.floor(Math.random() * 20) + 1;
      cmsInsert(lastJ);
    }
    cmsRenderGrid(lastJ);
    cmsUpdateStats(lastJ);
  });

  document.getElementById("btnCmsQuery").addEventListener("click", function () {
    var j = parseInt(document.getElementById("cmsInput").value) || 1;
    cmsRenderGrid(j);
    cmsUpdateStats(j);
  });

  document.getElementById("btnCmsReset").addEventListener("click", function () {
    cmsInit();
    cmsRenderGrid();
    document.getElementById("cmsTotalInserted").textContent = "0";
    document.getElementById("cmsTrueFreq").textContent = "\u2014";
    document.getElementById("cmsEstFreq").textContent = "\u2014";
    document.getElementById("cmsOverest").textContent = "\u2014";
  });

  // ========== CS vs CMS SIDE-BY-SIDE ==========
  var CSV_D = 3, CSV_W = 7;
  var csvElements = ["a", "b", "c", "d", "e"];
  var csvCSGrid = [];
  var csvCMSGrid = [];
  var csvTrue = {};
  var csvStreamLen = 0;
  var csvColHash = [];
  var csvSignHash = [];

  function csvInit() {
    csvCSGrid = [];
    csvCMSGrid = [];
    for (var t = 0; t < CSV_D; t++) {
      csvCSGrid.push(new Array(CSV_W).fill(0));
      csvCMSGrid.push(new Array(CSV_W).fill(0));
    }
    csvTrue = {};
    csvStreamLen = 0;
    csvColHash = [];
    csvSignHash = [];
    for (var t2 = 0; t2 < CSV_D; t2++) {
      var ch = [], sh = [];
      for (var j = 0; j < csvElements.length; j++) {
        ch.push(Math.floor(Math.random() * CSV_W));
        sh.push(Math.random() < 0.5 ? -1 : 1);
      }
      csvColHash.push(ch);
      csvSignHash.push(sh);
    }
  }

  function csvInsert(elemIdx) {
    csvStreamLen++;
    var name = csvElements[elemIdx];
    csvTrue[name] = (csvTrue[name] || 0) + 1;
    for (var t = 0; t < CSV_D; t++) {
      var col = csvColHash[t][elemIdx];
      csvCSGrid[t][col] += csvSignHash[t][elemIdx];
      csvCMSGrid[t][col] += 1;
    }
  }

  function csvQueryCS(elemIdx) {
    var estimates = [];
    for (var t = 0; t < CSV_D; t++) {
      var col = csvColHash[t][elemIdx];
      estimates.push(csvSignHash[t][elemIdx] * csvCSGrid[t][col]);
    }
    estimates.sort(function (a, b) { return a - b; });
    return estimates[Math.floor(CSV_D / 2)];
  }

  function csvQueryCMS(elemIdx) {
    var minVal = Infinity;
    for (var t = 0; t < CSV_D; t++) {
      var col = csvColHash[t][elemIdx];
      var v = csvCMSGrid[t][col];
      if (v < minVal) minVal = v;
    }
    return minVal;
  }

  function csvCellBg(val, isCS) {
    if (val === 0) return "transparent";
    var absVal = Math.abs(val);
    var intensity = Math.min(absVal / 10, 1) * 0.5;
    if (isCS) {
      return val > 0
        ? "rgba(52,211,153," + intensity + ")"
        : "rgba(248,113,113," + intensity + ")";
    }
    return "rgba(52,211,153," + intensity + ")";
  }

  function csvRenderGrids(highlightElem) {
    var csHtml = '<table class="styled-table" style="width:100%; font-size:0.82rem; text-align:center;">';
    csHtml += "<thead><tr><th></th>";
    for (var c = 0; c < CSV_W; c++) csHtml += "<th>" + c + "</th>";
    csHtml += "</tr></thead><tbody>";
    for (var t = 0; t < CSV_D; t++) {
      csHtml += '<tr><td style="font-weight:600;">h' + (t + 1) + "</td>";
      for (var c2 = 0; c2 < CSV_W; c2++) {
        var val = csvCSGrid[t][c2];
        var isHL = highlightElem !== undefined && csvColHash[t][highlightElem] === c2;
        var bg = csvCellBg(val, true);
        var style = "background:" + bg + ";";
        if (isHL) style += "outline:2px solid var(--accent); outline-offset:-2px; font-weight:700;";
        var clr = val < 0 ? "color:var(--red);" : val > 0 ? "color:var(--green);" : "";
        if (isHL) {
          var sv = csvSignHash[t][highlightElem];
          csHtml += '<td style="' + style + clr + '">' + val +
            '<div style="font-size:0.6rem;opacity:0.6;">g=' + (sv > 0 ? "+1" : "\u22121") + "</div></td>";
        } else {
          csHtml += '<td style="' + style + clr + '">' + val + "</td>";
        }
      }
      csHtml += "</tr>";
    }
    csHtml += "</tbody></table>";
    document.getElementById("csGrid").innerHTML = csHtml;

    var cmsHtml = '<table class="styled-table" style="width:100%; font-size:0.82rem; text-align:center;">';
    cmsHtml += "<thead><tr><th></th>";
    for (var c3 = 0; c3 < CSV_W; c3++) cmsHtml += "<th>" + c3 + "</th>";
    cmsHtml += "</tr></thead><tbody>";
    for (var t2 = 0; t2 < CSV_D; t2++) {
      cmsHtml += '<tr><td style="font-weight:600;">h' + (t2 + 1) + "</td>";
      for (var c4 = 0; c4 < CSV_W; c4++) {
        var val2 = csvCMSGrid[t2][c4];
        var isHL2 = highlightElem !== undefined && csvColHash[t2][highlightElem] === c4;
        var bg2 = csvCellBg(val2, false);
        var style2 = "background:" + bg2 + ";";
        if (isHL2) style2 += "outline:2px solid var(--green); outline-offset:-2px; font-weight:700;";
        if (isHL2) {
          cmsHtml += '<td style="' + style2 + '">' + val2 +
            '<div style="font-size:0.6rem;opacity:0.6;">+1</div></td>';
        } else {
          cmsHtml += '<td style="' + style2 + '">' + val2 + "</td>";
        }
      }
      cmsHtml += "</tr>";
    }
    cmsHtml += "</tbody></table>";
    document.getElementById("cmsGrid2").innerHTML = cmsHtml;
  }

  function csvShowQuery(idx) {
    var name = csvElements[idx];
    var trueF = csvTrue[name] || 0;
    var csEstimates = [];
    var csDetails = [];
    for (var t = 0; t < CSV_D; t++) {
      var col = csvColHash[t][idx];
      var sv = csvSignHash[t][idx];
      var cell = csvCSGrid[t][col];
      var est = sv * cell;
      csEstimates.push(est);
      csDetails.push("h" + (t + 1) + ": g\u00b7C[" + col + "] = " + (sv > 0 ? "+" : "") + sv + "\u00d7" + cell + " = " + est);
    }
    csEstimates.sort(function (a, b) { return a - b; });
    var csResult = csEstimates[Math.floor(CSV_D / 2)];

    var cmsEstimates = [];
    var cmsDetails = [];
    for (var t2 = 0; t2 < CSV_D; t2++) {
      var col2 = csvColHash[t2][idx];
      var cell2 = csvCMSGrid[t2][col2];
      cmsEstimates.push(cell2);
      cmsDetails.push("h" + (t2 + 1) + ": C[" + col2 + "] = " + cell2);
    }
    var cmsResult = Math.min.apply(null, cmsEstimates);

    document.getElementById("csVsCmsTrueFreq").textContent = trueF;
    document.getElementById("csVsCmsCSEst").textContent = csResult;
    document.getElementById("csVsCmsCMSEst").textContent = cmsResult;
    document.getElementById("csVsCmsCSErr").textContent = (csResult - trueF >= 0 ? "+" : "") + (csResult - trueF);
    document.getElementById("csVsCmsCMSErr").textContent = "+" + (cmsResult - trueF);

    var resultDiv = document.getElementById("csVsCmsQueryResult");
    resultDiv.style.display = "block";
    var zh = typeof getLang === "function" && getLang() === "zh";
    resultDiv.innerHTML =
      '<div style="font-size:0.88rem; margin-bottom:0.5rem;"><strong>' +
      (zh ? "\u67e5\u8be2\u5143\u7d20: " : "Query: ") + '"' + name + '"</strong> \u2014 ' +
      (zh ? "\u771f\u5b9e\u9891\u7387: " : "True frequency: ") + trueF + "</div>" +
      '<div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.82rem;">' +
      '<div><strong style="color:var(--accent);">CountSketch</strong> (' + (zh ? "\u4e2d\u4f4d\u6570" : "median") + ")<br>" +
      csDetails.join("<br>") + "<br><strong>\u2192 " + csResult + "</strong></div>" +
      '<div><strong style="color:var(--green);">CountMinSketch</strong> (' + (zh ? "\u6700\u5c0f\u503c" : "min") + ")<br>" +
      cmsDetails.join("<br>") + "<br><strong>\u2192 " + cmsResult + "</strong></div>" +
      "</div>";
  }

  csvInit();
  csvRenderGrids();

  document.getElementById("btnCsVsCmsAdd").addEventListener("click", function () {
    var idx = parseInt(document.getElementById("csvsCmsElem").value);
    csvInsert(idx);
    csvRenderGrids(idx);
    document.getElementById("csVsCmsStreamLen").textContent = csvStreamLen;
    csvShowQuery(idx);
  });

  document.getElementById("btnCsVsCmsQuery").addEventListener("click", function () {
    var idx = parseInt(document.getElementById("csvsCmsElem").value);
    csvRenderGrids(idx);
    csvShowQuery(idx);
  });

  document.getElementById("btnCsVsCmsReset").addEventListener("click", function () {
    csvInit();
    csvRenderGrids();
    document.getElementById("csVsCmsStreamLen").textContent = "0";
    document.getElementById("csVsCmsTrueFreq").textContent = "\u2014";
    document.getElementById("csVsCmsCSEst").textContent = "\u2014";
    document.getElementById("csVsCmsCMSEst").textContent = "\u2014";
    document.getElementById("csVsCmsCSErr").textContent = "\u2014";
    document.getElementById("csVsCmsCMSErr").textContent = "\u2014";
    document.getElementById("csVsCmsQueryResult").style.display = "none";
  });

renderMath();
})();
