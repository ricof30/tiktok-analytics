#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Installing Playwright Chromium browser..."
PLAYWRIGHT_BROWSERS_PATH=/opt/render/.cache/ms-playwright npx playwright install chromium
npx playwright install-deps chromium

echo "Build complete!"
