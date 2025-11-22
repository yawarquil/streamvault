# StreamVault Deployment Script - Simple Version

Write-Host "StreamVault Deployment" -ForegroundColor Cyan
Write-Host "=====================`n" -ForegroundColor Cyan

# Initialize git
Write-Host "Initializing Git..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "Adding files..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit - StreamVault application"

# Add remote
Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/yawarquil/streamvault.git

# Set main branch
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "(You may need to authenticate)" -ForegroundColor Cyan
git push -u origin main

Write-Host "`nDone! Code pushed to GitHub" -ForegroundColor Green
Write-Host "`nNext: Deploy on Render.com" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com" -ForegroundColor White
Write-Host "2. Click 'New +' -> 'Web Service'" -ForegroundColor White
Write-Host "3. Connect GitHub and select 'streamvault'" -ForegroundColor White
Write-Host "4. Click 'Create Web Service'" -ForegroundColor White
