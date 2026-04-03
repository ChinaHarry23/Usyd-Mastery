/**
 * Usyd Mastery — Storage adapter
 * Uses IndexedDB for large data with localStorage fallback.
 * API mirrors localStorage: getItem/setItem/removeItem (async with Promises).
 * For backward compatibility, also syncs to localStorage on write.
 */
(function() {
  "use strict";

  var DB_NAME = "usyd_mastery";
  var DB_VERSION = 1;
  var STORE_NAME = "kv";
  var db = null;
  var useIDB = false;

  function openDB() {
    return new Promise(function(resolve, reject) {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function(e) {
        var database = e.target.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = function(e) {
        resolve(e.target.result);
      };
      req.onerror = function() {
        resolve(null);
      };
    });
  }

  function idbGet(key) {
    return new Promise(function(resolve, reject) {
      if (!db) {
        resolve(null);
        return;
      }
      try {
        var tx = db.transaction(STORE_NAME, "readonly");
        var store = tx.objectStore(STORE_NAME);
        var req = store.get(key);
        req.onsuccess = function() { resolve(req.result !== undefined ? req.result : null); };
        req.onerror = function() { resolve(null); };
      } catch (e) {
        resolve(null);
      }
    });
  }

  function idbSet(key, value) {
    return new Promise(function(resolve, reject) {
      if (!db) {
        resolve(false);
        return;
      }
      try {
        var tx = db.transaction(STORE_NAME, "readwrite");
        var store = tx.objectStore(STORE_NAME);
        store.put(value, key);
        tx.oncomplete = function() { resolve(true); };
        tx.onerror = function() { resolve(false); };
      } catch (e) {
        resolve(false);
      }
    });
  }

  function idbRemove(key) {
    return new Promise(function(resolve) {
      if (!db) { resolve(false); return; }
      try {
        var tx = db.transaction(STORE_NAME, "readwrite");
        var store = tx.objectStore(STORE_NAME);
        store.delete(key);
        tx.oncomplete = function() { resolve(true); };
        tx.onerror = function() { resolve(false); };
      } catch (e) {
        resolve(false);
      }
    });
  }

  var MasteryStorage = {
    ready: false,

    init: function() {
      return openDB().then(function(database) {
        if (database) {
          db = database;
          useIDB = true;
        }
        MasteryStorage.ready = true;
        return MasteryStorage;
      });
    },

    getItem: function(key) {
      if (useIDB) {
        return idbGet(key).then(function(val) {
          if (val !== null) return val;
          // Fallback: migrate from localStorage
          try {
            var lsVal = localStorage.getItem(key);
            if (lsVal !== null) {
              idbSet(key, lsVal);
              return lsVal;
            }
          } catch (e) {}
          return null;
        });
      }
      return Promise.resolve(function() {
        try { return localStorage.getItem(key); } catch (e) { return null; }
      }());
    },

    setItem: function(key, value) {
      // Always sync to localStorage for backward compatibility
      try { localStorage.setItem(key, value); } catch (e) {}
      if (useIDB) {
        return idbSet(key, value);
      }
      return Promise.resolve(true);
    },

    removeItem: function(key) {
      try { localStorage.removeItem(key); } catch (e) {}
      if (useIDB) {
        return idbRemove(key);
      }
      return Promise.resolve(true);
    },

    // Synchronous fallback for code that can't use promises
    getItemSync: function(key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },

    setItemSync: function(key, value) {
      try { localStorage.setItem(key, value); } catch (e) {}
    }
  };

  window.MasteryStorage = MasteryStorage;

  // Auto-init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() { MasteryStorage.init(); });
  } else {
    MasteryStorage.init();
  }
})();
