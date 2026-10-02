@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or later is required.
  pause
  exit /b 1
)

if not exist ".env" (
  echo.
  echo [Quick Deck GAME DEV]
  echo .env was not found.
  echo Copy .env.example to .env and set OPENAI_API_KEY.
  echo AI chat will be unavailable until configured.
  echo.
)

start "" "http://127.0.0.1:4173/game-dev.html"

if exist ".env" (
  node --env-file=.env quickdeck-server.mjs
) else (
  node quickdeck-server.mjs
)

pause
