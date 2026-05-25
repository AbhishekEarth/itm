# PostgreSQL ngrok TCP tunnel
# Run this to expose port 5432 to the internet for remote team members
# Requires ngrok account — get a free authtoken at https://ngrok.com

$ngrokPath = "$env:LOCALAPPDATA\ngrok\ngrok.exe"
$ngrokZip  = "$env:TEMP\ngrok.zip"

if (-not (Test-Path $ngrokPath)) {
    Write-Host "Downloading ngrok..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip" -OutFile $ngrokZip
    Expand-Archive -Path $ngrokZip -DestinationPath "$env:LOCALAPPDATA\ngrok" -Force
    Remove-Item $ngrokZip
    Write-Host "ngrok downloaded." -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting PostgreSQL tunnel on port 5432..." -ForegroundColor Cyan
Write-Host "NOTE: If this is your first run, set your authtoken first:" -ForegroundColor Yellow
Write-Host "  $ngrokPath config add-authtoken <YOUR_TOKEN>" -ForegroundColor Yellow
Write-Host ""
Write-Host "Share the TCP address shown below with your team." -ForegroundColor Green
Write-Host "They update their .env DATABASE_URL to use that host:port instead of localhost:5432" -ForegroundColor Green
Write-Host ""

& $ngrokPath tcp 5432
