# Start The Copy application
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

Write-Host "Starting The Copy..." -ForegroundColor Cyan

# Kill existing processes first
Write-Host "   Cleaning up existing processes..." -ForegroundColor Yellow
& "$PSScriptRoot\kill-ports.ps1"
Start-Sleep -Seconds 1

# Start Redis
Write-Host "   Starting Redis..." -ForegroundColor Cyan
try {
    Start-Process -FilePath "$root\redis\redis-server.exe" -WindowStyle Minimized
    Write-Host "   Redis started" -ForegroundColor Green
} catch {
    Write-Host "   Redis failed to start" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# Start Backend
Write-Host "   Starting Backend (port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    '-NoExit', '-Command',
    "Set-Location '$root\backend'; `$env:PORT=3001; pnpm run dev"
)

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "   Starting Frontend (port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    '-NoExit', '-Command',
    "Set-Location '$root\frontend'; `$env:PORT=5000; pnpm run dev"
)

Write-Host ""
Write-Host "Application started successfully!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5000" -ForegroundColor White
