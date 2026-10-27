#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/output"
COUNT=$(grep -c '<section class="slide' "$ROOT/slides/slides.html")
for i in $(seq 1 "$COUNT"); do
  google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 \
    --window-size=1080,1350 --virtual-time-budget=5000 \
    --screenshot="$ROOT/output/slide-$(printf '%02d' "$i").png" \
    "file://$ROOT/slides/slides.html?slide=$i" 2>/dev/null
done
