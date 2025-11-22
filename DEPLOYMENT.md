# StreamVault Deployment Guide

## Prerequisites
- Git installed
- GitHub account
- Render.com account (free)

## Deployment Steps

### 1. Prepare Your Repository

First, initialize git if not already done:
```bash
git init
git add .
git commit -m "Initial commit - StreamVault application"
```

### 2. Push to GitHub

Create a new repository on GitHub, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/streamvault.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Render.com

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: streamvault (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Click "Create Web Service"

### 4. Environment Variables (Optional)

In Render dashboard, add these if needed:
- `NODE_ENV`: production

### 5. Data Persistence

⚠️ **Important**: The free tier uses ephemeral storage. Your data file will reset on restarts.

For persistent data, consider:
- Using a database (PostgreSQL, MongoDB)
- Upgrading to a paid plan with persistent disk
- Using external storage (AWS S3, etc.)

## Admin Credentials

Default admin login:
- **Username**: admin
- **Password**: streamvault2024

⚠️ **Change these in production!** Update in `server/routes.ts`:
```typescript
const ADMIN_USERNAME = "your_username";
const ADMIN_PASSWORD = "your_secure_password";
```

## Alternative Deployment Options

### Railway.app
1. Install Railway CLI: `npm i -g @railway/cli`
2. Run: `railway login`
3. Run: `railway init`
4. Run: `railway up`

### Vercel (with serverless functions)
Requires restructuring to use Vercel's serverless architecture.

### Heroku
1. Install Heroku CLI
2. `heroku create streamvault`
3. `git push heroku main`

## Post-Deployment

1. Visit your deployed URL
2. Test the application
3. Login to admin panel at `/admin/login`
4. Import your shows and episodes

## Troubleshooting

- **Build fails**: Check Node version (should be 18+)
- **App crashes**: Check logs in Render dashboard
- **Data lost**: See data persistence section above
