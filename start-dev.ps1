param(
  [string] $BackendPath = "$PSScriptRoot\backend",
  [string] $FrontendPath = "$PSScriptRoot\frontend",
  [int] $BackendPort = 3001,
  [int] $FrontendPort = 5000
)

Write-Output "Launching Backend and Frontend in separate PowerShell windows..." -ForegroundColor Yellow

# Backend window (auto-fallback from BackendPort implemented in server.ts)
Start-Process pwsh -ArgumentList @(
  '-NoExit', '-Command',
  "Set-Location '$BackendPath'; $env:PORT=$BackendPort; pnpm run dev"
)

# Frontend window (auto-fallback implemented in scripts/dev-with-fallback.js)
Start-Process pwsh -ArgumentList @(
  '-NoExit', '-Command',
  "Set-Location '$FrontendPath'; $env:PORT=$FrontendPort; pnpm run dev"
)

Write-Output "Backend starting from port $BackendPort; Frontend starting from port $FrontendPort" -ForegroundColor Green
