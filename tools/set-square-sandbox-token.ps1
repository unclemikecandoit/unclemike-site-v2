# Saves the Square SANDBOX token for the preview site, after checking it with Square.
$ErrorActionPreference = 'Stop'
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
Set-Location (Split-Path $PSScriptRoot -Parent)
Write-Host "`n=== Square sandbox token ===" -ForegroundColor Cyan
Write-Host "In the Square page: Sandbox -> Credentials -> 'Sandbox Access token' -> click the copy icon."
Write-Host "Then click in THIS window and right-click once to paste. (You will see the token this time.)`n"
while ($true) {
  $tok = (Read-Host 'Paste token here, then press Enter').Trim()
  if (-not $tok) { continue }
  try {
    $r = Invoke-RestMethod 'https://connect.squareupsandbox.com/v2/locations' -Headers @{ Authorization = "Bearer $tok"; 'Square-Version' = '2026-01-22' }
    $loc = ($r.locations | Where-Object { $_.status -eq 'ACTIVE' } | Select-Object -First 1).id
    Write-Host "`nSquare accepted it. Sandbox location: $loc" -ForegroundColor Green
    break
  } catch {
    if ($tok -like 'sandbox-sq0idb*') { Write-Host "That is the Application ID (top row). Copy the 'Sandbox Access token' row instead." -ForegroundColor Yellow }
    else {
      try { Invoke-RestMethod 'https://connect.squareup.com/v2/locations' -Headers @{ Authorization = "Bearer $tok"; 'Square-Version' = '2026-01-22' } | Out-Null
            Write-Host "That is your PRODUCTION (real money) token. Switch the Square page to 'Sandbox' first." -ForegroundColor Yellow }
      catch { Write-Host "Square did not accept that token. Copy it again with the copy icon and paste once." -ForegroundColor Yellow }
    }
  }
}
Clear-Host
$tok | npx wrangler secret put SQUARE_ACCESS_TOKEN -c wrangler.site.jsonc -e preview 2>&1 | Out-Null
$ok1 = $LASTEXITCODE -eq 0
$loc | npx wrangler secret put SQUARE_LOCATION_ID -c wrangler.site.jsonc -e preview 2>&1 | Out-Null
$ok2 = $LASTEXITCODE -eq 0
Remove-Variable tok
if ($ok1 -and $ok2) { Write-Host "`nSaved. Go back to Claude and say 'token fixed'. You can close this window.`n" -ForegroundColor Green }
else { Write-Host "`nCould not save - tell Claude.`n" -ForegroundColor Red }
