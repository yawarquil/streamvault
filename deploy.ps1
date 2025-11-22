# StreamVault Deployment Script

Write-Host "🚀 StreamVault Deployment Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if git is available
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please restart your terminal or add Git to PATH" -ForegroundColor Red
    Write-Host "   Git is usually installed at: C:\Program Files\Git\cmd" -ForegroundColor Yellow
    exit 1
}

# Initialize git if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host "`n📦 Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Add all files
Write-Host "`n📝 Adding files to git..." -ForegroundColor Cyan
git add .

# Commit
Write-Host "`n💾 Creating commit..." -ForegroundColor Cyan
git commit -m "Initial commit - StreamVault application"

# Add remote (if not exists)
Write-Host "`n🔗 Setting up remote repository..." -ForegroundColor Cyan
$remoteExists = git remote | Select-String "origin"
if (-not $remoteExists) {
    git remote add origin https://github.com/yawarquil/streamvault.git
    Write-Host "✅ Remote added" -ForegroundColor Green
} else {
    Write-Host "✅ Remote already exists" -ForegroundColor Green
}

# Set main branch
Write-Host "`n🌿 Setting main branch..." -ForegroundColor Cyan
git branch -M main

# Push to GitHub
Write-Host "`n⬆️  Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "   (You may need to authenticate)" -ForegroundColor Yellow
git push -u origin main

Write-Host "`n✅ Code pushed to GitHub successfully!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Go to https://render.com and sign up/login" -ForegroundColor White
Write-Host "   2. Click 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "   3. Connect your GitHub account" -ForegroundColor White
Write-Host "   4. Select the 'streamvault' repository" -ForegroundColor White
Write-Host "   5. Render will auto-detect settings from render.yaml" -ForegroundColor White
Write-Host "   6. Click 'Create Web Service'" -ForegroundColor White
Write-Host "   7. Wait 5-10 minutes for deployment" -ForegroundColor White
Write-Host "`n🎉 Your app will be live at: https://streamvault.onrender.com (or similar)" -ForegroundColor Green
