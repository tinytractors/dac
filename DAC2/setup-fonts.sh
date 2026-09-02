#!/bin/bash
# setup-fonts.sh - Download and setup required fonts for Detailed Auto Care website
# This script downloads Montserrat and Orbitron fonts from Google Fonts

set -e

FONTS_DIR="assets/fonts"
GOOGLE_FONTS_URL="https://fonts.gstatic.com/s"

# Create fonts directory
mkdir -p "$FONTS_DIR"

echo "📥 Downloading fonts..."

# Orbitron 700
echo "Downloading Orbitron 700..."
curl -s "https://fonts.gstatic.com/s/orbitron/v14/yMJ9Y3Z_-0WjfZrRaxw6wUdzNhfC6I9u.woff2" \
  -o "$FONTS_DIR/orbitron-700.woff2"

# Montserrat 400
echo "Downloading Montserrat 400..."
curl -s "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg69CK48gIUAEKwdytS1xg.woff2" \
  -o "$FONTS_DIR/montserrat-400.woff2"

# Montserrat 600
echo "Downloading Montserrat 600..."
curl -s "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg69CK48gIUHheuylZ-OvlZQIg.woff2" \
  -o "$FONTS_DIR/montserrat-600.woff2"

echo "✅ Fonts downloaded successfully!"
echo "📍 Location: $FONTS_DIR/"
ls -lh "$FONTS_DIR"

echo ""
echo "Fonts are ready. The HTML will load them from /assets/fonts/"
