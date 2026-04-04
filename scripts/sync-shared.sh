#!/bin/bash
# ──────────────────────────────────────────────────────────────
# Verify that no hub directory contains stale copies of canonical shared files.
#
# After the deduplication migration (scripts/migrate-shared-paths.js), all HTML
# pages reference root /shared/ directly. Hub /shared/ directories now contain
# ONLY hub-specific files (study.css, lang-config.js, translations.js, etc.).
#
# This script checks that none of the canonical files have crept back in.
#
# Usage:
#   bash scripts/sync-shared.sh           # report only
#   bash scripts/sync-shared.sh --check   # exit 1 if stale copies found (CI mode)
# ──────────────────────────────────────────────────────────────
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

HUBS=(
  "5270"
  "5318"
  "Comp5046-NLP-Study-Hub"
  "COMP9001-Intro-to-Programming-Study-Hub"
)

# Files that should ONLY live in root /shared/, never in hub /shared/
CANONICAL_FILES=(
  "chat-panel.js"
  "chat-panel.css"
  "mindmap.js"
  "mindmap.css"
  "flashcard-srs.js"
  "progress-tracker.js"
  "lang-toggle.js"
)

MODE="report"
if [ "$1" = "--check" ]; then MODE="check"; fi

stale=0

for hub in "${HUBS[@]}"; do
  dest="$ROOT/$hub/shared"
  [ -d "$dest" ] || continue

  for f in "${CANONICAL_FILES[@]}"; do
    if [ -f "$dest/$f" ]; then
      echo "  ✗ $hub/shared/$f  — stale copy (should be deleted)"
      stale=$((stale + 1))
    fi
  done
done

echo ""
if [ "$stale" -gt 0 ]; then
  echo "$stale stale hub copy/copies found. Delete them — HTML now references root /shared/ directly."
  if [ "$MODE" = "check" ]; then exit 1; fi
else
  echo "All hub directories are clean — no stale shared copies. ✓"
fi
