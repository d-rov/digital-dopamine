#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SRC="$SCRIPT_DIR/public"
DEST="$SCRIPT_DIR/dist"

mkdir -p "$DEST"

cp "$SRC"/manifest.json "$DEST"/
cp "$SRC"/popup.html "$DEST"/
cp "$SRC"/popup.js "$DEST"/