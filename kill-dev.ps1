param(
  [int[]] $Ports = (3001..3020) + (5000..5020)
)

Write-Host "Killing listeners on ports: $($Ports -join ', ')" -ForegroundColor Yellow

foreach ($p in $Ports) {
  try {
    $conns = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
    if ($conns) {
      $pids = $conns | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique
      foreach ($pid in $pids) {
        try {
          Write-Host "Stopping PID $pid (port $p)" -ForegroundColor Cyan
          Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        } catch {}
      }
    }
  } catch {}
}

Write-Host "Done." -ForegroundColor Green


