#!/usr/bin/env bash
# Creates the web version of the intro video from the untouched original.
# Input : assets/video.mp4          (original, never modified, never committed)
# Output: public/video/intro.mp4    (generated, git-ignored, upload separately to demo/production)
set -euo pipefail
cd "$(dirname "$0")/.."
IN="assets/video.mp4"
OUT="public/video/intro.mp4"
[ -f "$IN" ] || { echo "Missing $IN"; exit 1; }
mkdir -p public/video
ffmpeg -y -v error -stats -i "$IN" \
  -vf "scale=-2:720" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 27 -maxrate 1800k -bufsize 3600k \
  -c:a aac -b:a 96k -ac 2 \
  -movflags +faststart \
  "$OUT"
ls -lh "$OUT"
