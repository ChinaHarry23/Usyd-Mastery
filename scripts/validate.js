#!/usr/bin/env node
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.resolve(__dirname, "..");
var errors = [];

function validate(filePath, expectedVars) {
  var rel = path.relative(root, filePath);
  if (!fs.existsSync(filePath)) {
    errors.push(rel + ": file not found");
    return;
  }
  var code = fs.readFileSync(filePath, "utf8");
  
  // Syntax check
  try {
    new vm.Script(code, { filename: rel });
  } catch (e) {
    errors.push(rel + ": SYNTAX ERROR — " + e.message);
    return;
  }
  
  // Run and check exports
  var sandbox = {};
  try {
    vm.runInNewContext(code, sandbox, { filename: rel, timeout: 5000 });
  } catch (e) {
    errors.push(rel + ": RUNTIME ERROR — " + e.message);
    return;
  }
  
  for (var i = 0; i < expectedVars.length; i++) {
    var varName = expectedVars[i].name;
    var type = expectedVars[i].type;
    if (!(varName in sandbox)) {
      errors.push(rel + ": missing global variable '" + varName + "'");
      continue;
    }
    if (type === "array" && !Array.isArray(sandbox[varName])) {
      errors.push(rel + ": '" + varName + "' should be an array");
      continue;
    }
    if (type === "array") {
      var arr = sandbox[varName];
      console.log("  ✓ " + rel + " — " + varName + " has " + arr.length + " entries");
      
      // Validate schema of each entry
      var requiredFields = expectedVars[i].fields || [];
      for (var j = 0; j < arr.length; j++) {
        for (var k = 0; k < requiredFields.length; k++) {
          if (arr[j][requiredFields[k]] === undefined) {
            errors.push(rel + ": entry " + j + " missing field '" + requiredFields[k] + "'");
          }
        }
      }
    }
  }
}

console.log("Validating quiz and flashcard data files...\n");

// Find all data directories
var hubs = ["5270RandomAlgo", "5318ML", "5046NLP", "9001Py"];

hubs.forEach(function(hub) {
  var dataDir = path.join(root, hub, "data");
  if (!fs.existsSync(dataDir)) return;
  
  console.log("[" + hub + "]");
  
  var quizFile = path.join(dataDir, "quiz-data-extract.js");
  if (fs.existsSync(quizFile)) {
    validate(quizFile, [
      { name: "ALL_QUIZ_DATA", type: "array", fields: ["ch", "type", "q", "opts", "answer", "exp"] }
    ]);
  }
  
  var fcFile = path.join(dataDir, "flashcard-data.js");
  if (fs.existsSync(fcFile)) {
    validate(fcFile, [
      { name: "ALL_FLASHCARD_DATA", type: "array", fields: ["ch", "front", "back"] },
      { name: "FLASHCARD_DECK_VERSION", type: "string" }
    ]);
  }
  
  console.log("");
});

// Also validate all JS files in shared/ for syntax
hubs.forEach(function(hub) {
  var sharedDir = path.join(root, hub, "shared");
  if (!fs.existsSync(sharedDir)) return;
  
  fs.readdirSync(sharedDir).forEach(function(file) {
    if (!file.endsWith(".js")) return;
    var filePath = path.join(sharedDir, file);
    var rel = path.relative(root, filePath);
    var code = fs.readFileSync(filePath, "utf8");
    try {
      new vm.Script(code, { filename: rel });
      console.log("  ✓ " + rel + " — syntax OK");
    } catch (e) {
      errors.push(rel + ": SYNTAX ERROR — " + e.message);
    }
  });
});

console.log("\n" + (errors.length === 0 ? "All validations passed! ✓" : errors.length + " error(s) found:"));
errors.forEach(function(e) { console.error("  ✗ " + e); });
process.exit(errors.length > 0 ? 1 : 0);
