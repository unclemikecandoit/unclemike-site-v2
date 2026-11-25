# Private settings for the REAL site (unclemike-site). Nothing typed here is saved on this computer.
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
Set-Location (Split-Path $PSScriptRoot -Parent)
function Read-Secret([string]$prompt) {
  $sec = Read-Host -Prompt $prompt -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}
function Save-Secret([string]$name, [string]$value) {
  $value | npx wrangler secret put $name -c wrangler.site.jsonc -e production 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) { Write-Host "  Saved $name." -ForegroundColor Green; return $true } else { Write-Host "  Could not save $name - tell Claude." -ForegroundColor Red; return $false }
}

Write-Host "`n=== REAL site: private settings ===`n" -ForegroundColor Cyan
Write-Host "1) STUDIO PASSWORD for the real site. You can use the SAME password as the preview."
do {
  $p1 = Read-Secret '   Studio password'; $p2 = Read-Secret '   Type it again'
  if ($p1 -ne $p2) { Write-Host '   They did not match - try again.' -ForegroundColor Yellow }
  elseif ($p1.Length -lt 12) { Write-Host '   Please use at least 12 characters.' -ForegroundColor Yellow; $p1 = $null }
} while ($p1 -ne $p2 -or -not $p1)
$null = Save-Secret 'OWNER_PASSWORD' $p1
Remove-Variable p1, p2

Write-Host "`n2) SQUARE PRODUCTION token (real payments)."
Write-Host "   In the Square page: switch the top toggle to 'Production' -> Credentials -> 'Production Access token' -> copy icon."
Write-Host "   If it only shows dots with no copy icon, click 'Replace' ONLY if you are sure nothing else uses it" -ForegroundColor Yellow
Write-Host "   (your current live checkout uses this token - replacing it would break the old site until we switch)." -ForegroundColor Yellow
Write-Host "   Click in THIS window and right-click once to paste (you will see it this time).`n"
while ($true) {
  $tok = (Read-Host '   Paste production token, then press Enter').Trim()
  if (-not $tok) { continue }
  try {
    $r = Invoke-RestMethod 'https://connect.squareup.com/v2/locations' -Headers @{ Authorization = "Bearer $tok"; 'Square-Version' = '2026-01-22' }
    $locs = @($r.locations | Where-Object { $_.status -eq 'ACTIVE' })
    if ($locs.Count -eq 1) { $loc = $locs[0].id; Write-Host "`n   Square accepted it. Location: $($locs[0].name)" -ForegroundColor Green }
    else {
      Write-Host "`n   Square accepted it. Which location should online orders go to?" -ForegroundColor Green
      for ($i = 0; $i -lt $locs.Count; $i++) { Write-Host ("     {0}) {1}" -f ($i + 1), $locs[$i].name) }
      $n = [int](Read-Host '   Number'); $loc = $locs[$n - 1].id
    }
    break
  } catch {
    try { Invoke-RestMethod 'https://connect.squareupsandbox.com/v2/locations' -Headers @{ Authorization = "Bearer $tok"; 'Square-Version' = '2026-01-22' } | Out-Null
          Write-Host "   That is the SANDBOX (test) token. Switch the Square page to 'Production' first." -ForegroundColor Yellow }
    catch { Write-Host "   Square did not accept that. Copy it again with the copy icon and paste once." -ForegroundColor Yellow }
  }
}
Clear-Host
Write-Host "`n=== REAL site: private settings ===`n" -ForegroundColor Cyan
$ok = (Save-Secret 'SQUARE_ACCESS_TOKEN' $tok) -and (Save-Secret 'SQUARE_LOCATION_ID' $loc)
Remove-Variable tok
if ($ok) { Write-Host "`nDone. Go back to Claude and say 'production set'. You can close this window.`n" -ForegroundColor Green }
