# Download YouTube video using yt-dlp
# Install: winget install yt-dlp

$videoUrl = "https://youtu.be/PDKNa3MQ4mU"
$outputPath = "$PSScriptRoot\..\downloads"

if (-not (Test-Path $outputPath)) {
    New-Item -ItemType Directory -Path $outputPath | Out-Null
}

Write-Host "Downloading video..." -ForegroundColor Cyan

# Refresh PATH in current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Use full path if command not found
$ytdlp = Get-Command yt-dlp -ErrorAction SilentlyContinue
if (-not $ytdlp) {
    $ytdlp = "$env:LOCALAPPDATA\Microsoft\WinGet\Links\yt-dlp.exe"
}

& $ytdlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" `
    -o "$outputPath\%(title)s.%(ext)s" `
    $videoUrl

Write-Host "Download complete!" -ForegroundColor Green
