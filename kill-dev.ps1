param(
  [int[]] $Ports = (3001..3020) + (5000..5020)
)

Write-Output "Killing listeners on ports: $($Ports -join ', ')"

foreach ($p in $Ports) {
  try {
    $conns = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
    if ($conns) {
      $pids = $conns | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique
      foreach ($procId in $pids) {
        try {
          Write-Output "Stopping PID $procId (port $p)"
          Stop-Process -Id $procId -Force -ErrorAction Stop
        } catch {
          Write-Error "Failed to stop process $procId: $_"
        }
      }
    }
  } catch {
    Write-Error "Error checking port $p: $_"
  }
}

Write-Output "Done."