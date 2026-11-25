# Sets the private settings for the PREVIEW site on Cloudflare.
# Run from the working-copy folder:  powershell -ExecutionPolicy Bypass -File tools\set-preview-secrets.ps1
# Nothing you type is shown on screen or saved on this computer.
$ErrorActionPreference = 'Stop'
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
Set-Location (Split-Path $PSScriptRoot -Parent)

function Read-Secret([string]$prompt) {
  $sec = Read-Host -Prompt $prompt -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}
function Save-Secret([string]$name, [string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) { Write-Host "  Skipped $name (left blank)." -ForegroundColor Yellow; return }
  $value.Trim() | npx wrangler secret put $name -c wrangler.site.jsonc -e preview 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) { Write-Host "  Saved $name." -ForegroundColor Green } else { Write-Host "  Could not save $name - tell Claude." -ForegroundColor Red }
}

Write-Host "`n=== Uncle Mike preview site: private settings ===`n" -ForegroundColor Cyan
Write-Host "1) STUDIO PASSWORD - pick a new one (at least 12 characters). Don't reuse another password."
do {
  $p1 = Read-Secret '   Studio password'
  $p2 = Read-Secret '   Type it again'
  if ($p1 -ne $p2) { Write-Host '   They did not match - try again.' -ForegroundColor Yellow }
  elseif ($p1.Length -lt 12) { Write-Host '   Please use at least 12 characters.' -ForegroundColor Yellow; $p1 = $null }
} while ($p1 -ne $p2 -or -not $p1)
Save-Secret 'OWNER_PASSWORD' $p1
Remove-Variable p1, p2

Write-Host "`n2) SQUARE SANDBOX (test mode - no real money)."
Write-Host "   At developer.squareup.com: open your application -> switch the top toggle to 'Sandbox'."
Write-Host "   Credentials page -> 'Sandbox Access token'.  Locations page -> the sandbox 'Location ID'."
Save-Secret 'SQUARE_ACCESS_TOKEN' (Read-Secret '   Sandbox access token (starts with EAAA)')
Save-Secret 'SQUARE_LOCATION_ID' (Read-Secret '   Sandbox location ID')

Write-Host "`nDone. Go back to Claude and say 'secrets set'.`n" -ForegroundColor Cyan
