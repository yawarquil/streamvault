# Push StreamVault to GitHub

## Prerequisites

### 1. Install Git
Download and install Git from: https://git-scm.com/download/win

During installation:
- ✅ Use default settings
- ✅ Select "Git from the command line and also from 3rd-party software"
- ✅ Use "Checkout Windows-style, commit Unix-style line endings"

After installation, **restart your terminal/IDE**.

### 2. Create GitHub Account
If you don't have one: https://github.com/signup

---

## Step-by-Step Guide

### Step 1: Initialize Git Repository

Open PowerShell in the StreamVault folder and run:

```bash
git init
```

### Step 2: Create .gitignore

A `.gitignore` file already exists in your project with:
```
node_modules/
dist/
.env
*.log
.DS_Store
```

### Step 3: Stage All Files

```bash
git add .
```

### Step 4: Create First Commit

```bash
git commit -m "Initial commit: StreamVault streaming platform"
```

### Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `StreamVault` (or any name you prefer)
3. **Description:** "Free streaming platform for TV shows and movies"
4. **Visibility:** Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

### Step 6: Add Remote and Push

GitHub will show you commands. Use these (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/StreamVault.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/yawar/StreamVault.git
git branch -M main
git push -u origin main
```

### Step 7: Enter GitHub Credentials

When prompted:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (not your password)

#### How to Create Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. **Note:** "StreamVault access"
4. **Expiration:** 90 days (or custom)
5. **Scopes:** Check ✅ `repo` (full control of private repositories)
6. Click "Generate token"
7. **Copy the token** (you won't see it again!)
8. Use this token as your password when pushing

---

## Quick Commands Reference

### After Initial Setup

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

### Common Workflows

**Adding new features:**
```bash
git add .
git commit -m "Add live search results feature"
git push
```

**Fixing bugs:**
```bash
git add .
git commit -m "Fix category page filtering"
git push
```

**Updating metadata:**
```bash
git add .
git commit -m "Update episode titles and descriptions from TMDB"
git push
```

---

## Important Notes

### Files to Keep Private

Your `.gitignore` already excludes:
- ✅ `node_modules/` - Dependencies (too large)
- ✅ `.env` - Environment variables (secrets)
- ✅ `dist/` - Build output
- ✅ `*.log` - Log files

### Sensitive Data

**Before pushing, make sure:**
- ❌ No API keys in code (use environment variables)
- ❌ No passwords or secrets
- ❌ No personal data

**Your TMDB API key** is currently in `update-episode-thumbnails.cjs` and `update-episode-info.cjs`. You should:

1. Create `.env` file:
```env
TMDB_API_KEY=920654cb695ee99175e53d6da8dc2edf
```

2. Update scripts to use environment variable:
```javascript
const TMDB_API_KEY = process.env.TMDB_API_KEY;
```

3. Add `.env` to `.gitignore` (already done)

---

## Troubleshooting

### "git: command not found"
- Install Git from https://git-scm.com/download/win
- Restart terminal after installation

### "Permission denied"
- Use Personal Access Token instead of password
- Make sure token has `repo` scope

### "Repository already exists"
- Use a different repository name
- Or delete the existing repository on GitHub

### "Failed to push"
- Check internet connection
- Verify remote URL: `git remote -v`
- Try: `git push -f origin main` (force push, use carefully)

---

## Repository Structure

Your GitHub repository will contain:

```
StreamVault/
├── client/              # React frontend
├── server/              # Express backend
├── shared/              # Shared types
├── data/                # JSON database
├── bulk-imports/        # Episode import files
├── package.json         # Dependencies
├── README.md            # Project documentation
└── .gitignore          # Ignored files
```

---

## Next Steps After Pushing

1. **Add README badges** (optional)
   - Build status
   - License
   - Version

2. **Enable GitHub Pages** (optional)
   - For documentation

3. **Set up GitHub Actions** (optional)
   - Automated testing
   - Deployment

4. **Invite collaborators** (optional)
   - Settings → Collaborators

---

## Example Commit Messages

Good commit messages:
- ✅ "Add live search results dropdown"
- ✅ "Fix category page filtering by show.category"
- ✅ "Update episode metadata from TMDB API"
- ✅ "Add romance, thriller, and crime categories"

Bad commit messages:
- ❌ "Update"
- ❌ "Fix bug"
- ❌ "Changes"

---

## GitHub Repository Settings

After pushing, configure:

1. **About section:**
   - Description: "Free streaming platform for TV shows and movies"
   - Website: Your deployed URL
   - Topics: `streaming`, `react`, `typescript`, `express`, `movies`, `tv-shows`

2. **README.md:**
   - Add screenshots
   - Installation instructions
   - Features list
   - Tech stack

3. **License:**
   - Choose appropriate license (MIT, Apache, etc.)

---

**Ready to push? Follow the steps above!** 🚀
