@echo off
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm install
)

echo Building DDPU Cloud...
call npm run build

echo Starting production preview...
start "" pwsh -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:4177/'"
call npm run preview:local
pause
