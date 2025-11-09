# Convert video to optimized MP4 with high quality
$inputVideo = "K:\New folder (48)\downloads\يعرض الآن  l منورة بأهلها l شاهد VIP.mp4"
$outputVideo = "K:\New folder (48)\downloads\promise-video-optimized.mp4"

Write-Host "Converting video to optimized MP4..." -ForegroundColor Cyan

# Using ffmpeg for high quality conversion
ffmpeg -i $inputVideo `
  -c:v libx264 `
  -preset slow `
  -crf 18 `
  -c:a aac `
  -b:a 192k `
  -movflags +faststart `
  -pix_fmt yuv420p `
  $outputVideo

Write-Host "Conversion complete!" -ForegroundColor Green
Write-Host "Output: $outputVideo" -ForegroundColor White
