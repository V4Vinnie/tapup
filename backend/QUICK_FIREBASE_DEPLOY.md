# Quick Firebase Hosting Deployment

Since you already have Railway backend deployed, here's the fastest way to deploy frontend to Firebase Hosting.

## Step 1: Get Your Railway URL

Copy your Railway deployment URL (e.g., `https://tapup-production.up.railway.app`)

## Step 2: Install & Login to Firebase

```bash
npm install -g firebase-tools
npx firebase-tools login
```

## Step 3: Initialize Hosting

```bash
npx firebase-tools init hosting
```

Select:
- Your Firebase project
- Public directory: `public`
- Single-page app: `Yes`
- Auto-build: `No`

## Step 4: Build Frontend (Manual)

Since Flask templates won't work, you need static HTML:

1. **Create directories:**
```bash
mkdir -p public/static/js public/static/css
```

2. **Copy static files:**
```bash
cp -r static/* public/static/
```

3. **Update API URL in create.js:**
```bash
# Edit public/static/js/create.js
# Replace: fetch('/api/user/from-youtube'
# With: fetch('YOUR_RAILWAY_URL/api/user/from-youtube'
```

4. **Create static HTML files** (simplified versions without Flask syntax)

## Step 5: Configure CORS in Railway

Add environment variable in Railway:
```
ALLOWED_ORIGINS=https://your-project.web.app,https://your-project.firebaseapp.com
```

## Step 6: Deploy

```bash
npx firebase-tools deploy --only hosting
```

## ⚠️ Note

This requires manual HTML conversion since Flask templates don't work with static hosting. For easier setup, consider keeping everything on Railway!

