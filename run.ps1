$ErrorActionPreference = "Stop"

Write-Host "== Personal Progress Tracker (Next.js) ==" -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is not installed (node not found). Install Node.js 20+ then re-run."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm is not available (npm not found). Reinstall Node.js then re-run."
}

if (-not (Test-Path -Path ".\node_modules")) {
  Write-Host "Installing dependencies (first run)..." -ForegroundColor Yellow
  npm install
}

Write-Host "Starting dev server..." -ForegroundColor Green
Write-Host "Open: http://localhost:3000" -ForegroundColor Green
npm run dev

