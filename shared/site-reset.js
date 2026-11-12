/* ================================================================
   site-reset.js — Complete client-state purge for Usyd Mastery
   ================================================================

   Canonical location: /shared/site-reset.js

   The site keeps state in four places:

     1. localStorage   — progress, flashcard SRS, language, chat config
     2. IndexedDB      — the "usyd_mastery" mirror written by storage.js
     3. Cache Storage  — the service worker's precache and runtime cache
     4. A service worker registration that keeps serving the cache

   The dashboard's "Reset all progress" button only removed two
   localStorage keys, so language, chat configuration, SRS state, the
   IndexedDB mirror and the service-worker cache all survived. This module
   is the one place that clears all four, so a learner (or a developer
   reviewing a cold start) can genuinely return to a first-run state.

   ── Usage ────────────────────────────────────────────────────────

     SiteReset.inspect()          → Promise<{ localStorage: [keys],
                                              databases: [names],
                                              caches: [names],
                                              sw: [scopes] }>
     SiteReset.purgeAll()         → Promise<{ removed: {...} }>
     SiteReset.reloadFresh()      → purge, then reload with ?fresh=0

   ── Zero-click purge ─────────────────────────────────────────────

   Append `?fresh=1` to any page URL (e.g. /COMP5047/?fresh=1). The purge
   runs before first paint and the page reloads clean. This is the fastest
   way to reproduce a brand-new-visitor experience.
   ================================================================ */

(function () {
  "use strict";

  /* Namespaces this app writes. Anything matching is removed; anything
     else in localStorage belongs to another site on the same origin and is
     left alone. */
  var KEY_PATTERNS = [
    /^comp\d+_/,          // comp5270_progress, comp5047_lang, …
    /^elec\d+_/,
    /^info\d+_/,
    /^root_lang$/,
    /^studyhub_progress$/,
    /^custom_progress$/,
    /^srs_/,              // srs_state_ch1, srs_test
    /^chat_config$/
  ];

  /* IndexedDB databases the app creates. */
  var DB_PATTERNS = [/^usyd_mastery$/];

  function matches(name, patterns) {
    return patterns.some(function (re) {
      return re.test(name);
    });
  }

  /* A content pack picks its own storage key, which the fixed patterns above
     cannot know. Read it from whatever the page declared so "Reset all
     progress" also clears a hub that was generated into this site. */
  function declaredPatterns() {
    var extra = [];
    function add(key) {
      if (!key || typeof key !== "string") return;
      extra.push(new RegExp("^" + key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "_"));
    }
    try {
      var t = window.PROGRESS_TRACKER_CONFIG;
      if (t && t.storageKey) add(t.storageKey);
      var d = window.DASHBOARD_CONFIG;
      if (d) {
        [d.progressKey, d.flashcardsKey, d.langKey].forEach(function (k) {
          if (k) add(String(k).replace(/_(progress|flashcards|lang)$/, ""));
        });
      }
      var c = window.CHAT_STORAGE_KEY;
      if (c) add(String(c).replace(/_chat_config$/, ""));
    } catch (e) {
      /* a page with no config simply adds nothing */
    }
    return extra;
  }

  function patterns() {
    return KEY_PATTERNS.concat(declaredPatterns());
  }

  function lsKeys() {
    var out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && matches(k, patterns())) out.push(k);
      }
    } catch (e) {
      /* storage disabled (private mode / blocked cookies) */
    }
    return out;
  }

  function listDatabases() {
    return new Promise(function (resolve) {
      if (!window.indexedDB || typeof indexedDB.databases !== "function") {
        // Safari and Firefox did not expose databases() for a long time; fall
        // back to the one name we know we create.
        resolve(["usyd_mastery"]);
        return;
      }
      indexedDB
        .databases()
        .then(function (dbs) {
          resolve(
            dbs
              .map(function (d) {
                return d.name;
              })
              .filter(function (n) {
                return n && matches(n, DB_PATTERNS);
              })
          );
        })
        .catch(function () {
          resolve(["usyd_mastery"]);
        });
    });
  }

  function deleteDatabase(name) {
    return new Promise(function (resolve) {
      var req;
      try {
        req = indexedDB.deleteDatabase(name);
      } catch (e) {
        resolve(false);
        return;
      }
      req.onsuccess = function () {
        resolve(true);
      };
      req.onerror = function () {
        resolve(false);
      };
      req.onblocked = function () {
        // Another tab still holds a connection; the delete completes once it
        // closes, so report it as not-yet-done rather than hanging.
        resolve(false);
      };
    });
  }

  function listCaches() {
    if (!window.caches) return Promise.resolve([]);
    return caches.keys().catch(function () {
      return [];
    });
  }

  function listRegistrations() {
    if (!navigator.serviceWorker || !navigator.serviceWorker.getRegistrations) {
      return Promise.resolve([]);
    }
    return navigator.serviceWorker.getRegistrations().catch(function () {
      return [];
    });
  }

  function inspect() {
    return Promise.all([listDatabases(), listCaches(), listRegistrations()]).then(function (r) {
      return {
        localStorage: lsKeys(),
        databases: r[0],
        caches: r[1],
        sw: r[2].map(function (reg) {
          return (reg.scope || "").replace(location.origin, "") || "/";
        })
      };
    });
  }

  function purgeAll() {
    var removed = { localStorage: [], databases: [], caches: [], sw: [] };

    /* 1. localStorage */
    lsKeys().forEach(function (k) {
      try {
        localStorage.removeItem(k);
        removed.localStorage.push(k);
      } catch (e) {
        /* ignore */
      }
    });

    /* 2. IndexedDB + 3. Cache Storage + 4. service worker */
    return Promise.all([listDatabases(), listCaches(), listRegistrations()])
      .then(function (r) {
        var dbs = r[0];
        var cacheNames = r[1];
        var regs = r[2];

        return Promise.all([
          Promise.all(
            dbs.map(function (n) {
              return deleteDatabase(n).then(function (ok) {
                if (ok) removed.databases.push(n);
              });
            })
          ),
          window.caches
            ? Promise.all(
                cacheNames.map(function (n) {
                  return caches.delete(n).then(function (ok) {
                    if (ok) removed.caches.push(n);
                  });
                })
              )
            : Promise.resolve(),
          Promise.all(
            regs.map(function (reg) {
              return reg.unregister().then(function (ok) {
                if (ok) removed.sw.push((reg.scope || "").replace(location.origin, "") || "/");
              });
            })
          )
        ]);
      })
      .then(function () {
        return { removed: removed };
      });
  }

  function reloadFresh() {
    return purgeAll().then(function () {
      var url = new URL(location.href);
      url.searchParams.delete("fresh");
      location.replace(url.toString());
    });
  }

  /* ── Service worker registration ──────────────────────────────── */

  /*
   * Registration used to live in root-portal.js only, with an absolute path.
   * Two consequences: a visitor who deep-links straight into a chapter page
   * never got offline support at all, and hosting the site under a sub-path
   * (a GitHub Pages project site, say) registered a worker with the wrong
   * scope. Registering from here — this module loads on the portal, every hub
   * home page, every tool page and every chapter page — fixes both.
   */
  function swUrl() {
    // Resolve ../sw.js next to the shared/ directory this file lives in.
    var script = document.currentScript;
    if (script && script.src) {
      return script.src.replace(/shared\/site-reset\.js(\?.*)?$/, "sw.js");
    }
    return "sw.js";
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol === "file:") return; // SW needs http(s)
    navigator.serviceWorker.register(swUrl(), { updateViaCache: "none" }).then(function (reg) {
      reg.update();
    }).catch(function () {
      /* offline support is a bonus; never surface a failure to the learner */
    });
  }

  /* ── ?fresh=1 — purge before the page settles ─────────────────── */

  function handleFreshParam() {
    var params;
    try {
      params = new URLSearchParams(location.search);
    } catch (e) {
      return false;
    }
    if (params.get("fresh") !== "1") return false;
    reloadFresh();
    return true;
  }

  window.SiteReset = {
    inspect: inspect,
    purgeAll: purgeAll,
    reloadFresh: reloadFresh,
    register: registerServiceWorker,
    keyPatterns: KEY_PATTERNS,
    dbPatterns: DB_PATTERNS
  };

  if (handleFreshParam()) return; // a purge is about to reload the page
  registerServiceWorker();
})();
