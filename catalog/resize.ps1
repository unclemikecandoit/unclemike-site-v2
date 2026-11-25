param([string]$Manifest)
# Reads JSON [{in, out, size}] and writes JPEGs flattened on white, EXIF-rotated.
Add-Type -AssemblyName System.Drawing
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 84L
$list = Get-Content $Manifest -Raw | ConvertFrom-Json
foreach ($j in $list) {
  if ((Test-Path $j.out) -and ((Get-Item $j.out).LastWriteTime -gt (Get-Item -LiteralPath $j.in).LastWriteTime)) { continue }
  try {
  $img = [System.Drawing.Image]::FromFile($j.in)
  $null = $img.Width
  foreach ($pi in $img.PropertyItems) { if ($pi.Id -eq 0x112) { switch ($pi.Value[0]) { 3 { $img.RotateFlip('Rotate180FlipNone') } 6 { $img.RotateFlip('Rotate90FlipNone') } 8 { $img.RotateFlip('Rotate270FlipNone') } } } }
  $r = [math]::Min([double]1, [double]$j.size / [double][math]::Max($img.Width, $img.Height))
  $w = [int]($img.Width * $r); $h = [int]($img.Height * $r)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp); $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($img, 0, 0, $w, $h)
  New-Item -ItemType Directory -Force (Split-Path $j.out) | Out-Null
  $bmp.Save($j.out, $enc, $ep); $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  } catch { [Console]::Error.WriteLine("FAILED $($j.in) -> $($_.Exception.Message)"); $failed = $true }
  [GC]::Collect()
}
if ($failed) { exit 1 }
