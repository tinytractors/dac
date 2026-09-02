$ErrorActionPreference = 'Continue'

$FontsDir = "assets\fonts"
if (-not (Test-Path $FontsDir)) {
    New-Item -ItemType Directory -Path $FontsDir -Force | Out-Null
}

Write-Host "Downloading fonts from Google Fonts..."
Write-Host ""

# Montserrat 400
try {
    Write-Host "⇓ Montserrat 400..."
    $url = "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg69CK48gIUAEKwdytS1xg.woff2"
    $output = "$FontsDir\montserrat-400.woff2"
    Invoke-WebRequest -Uri $url -OutFile $output -TimeoutSec 30
    Write-Host "✓ Downloaded"
} catch {
    Write-Host "✗ Failed: $_"
}

# Montserrat 600
try {
    Write-Host "⇓ Montserrat 600..."
    $url = "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg69CK48gIUHheuylZ-OvlZQIg.woff2"
    $output = "$FontsDir\montserrat-600.woff2"
    Invoke-WebRequest -Uri $url -OutFile $output -TimeoutSec 30
    Write-Host "✓ Downloaded"
} catch {
    Write-Host "✗ Failed: $_"
}

# Orbitron 700
try {
    Write-Host "⇓ Orbitron 700..."
    $url = "https://fonts.gstatic.com/s/orbitron/v14/yMJ9Y3Z_-0WjfZrRaxw6wUdzNhfC6I9u.woff2"
    $output = "$FontsDir\orbitron-700.woff2"
    Invoke-WebRequest -Uri $url -OutFile $output -TimeoutSec 30
    Write-Host "✓ Downloaded"
} catch {
    Write-Host "✗ Failed: $_"
}

Write-Host ""
Write-Host "Font files in $FontsDir :"
Get-ChildItem "$FontsDir" -ErrorAction SilentlyContinue | ForEach-Object { 
    Write-Host "  $($_.Name) - $($_.Length) bytes"
}
