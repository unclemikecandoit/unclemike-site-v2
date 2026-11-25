# Uploads the "new-site" branch to GitHub. Your live site (main branch) is not changed.
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
# Allow GitHub's sign-in window (these may be inherited as "off" from automation tools).
Remove-Item Env:GIT_TERMINAL_PROMPT, Env:GCM_INTERACTIVE, Env:GIT_ASKPASS, Env:SSH_ASKPASS -ErrorAction SilentlyContinue
$env:GCM_INTERACTIVE = 'always'
Set-Location (Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) 'public-branch')
Write-Host "`nUploading the new site to GitHub (branch: new-site)..." -ForegroundColor Cyan
Write-Host "If GitHub asks you to sign in, choose 'Sign in with your browser' and click Authorize.`n"
git push -u origin new-site
if ($LASTEXITCODE -eq 0) { Write-Host "`nDone! Go back to Claude and say 'pushed'. You can close this window." -ForegroundColor Green }
else { Write-Host "`nUpload failed - tell Claude what the message above says." -ForegroundColor Red }
