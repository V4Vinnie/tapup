# Quick Start: Deploy Frontend to Firebase Hosting

Since you already have Railway backend deployed, follow these steps to deploy the frontend to Firebase Hosting.

## ⚠️ Important Consideration

Your app uses **Flask templates** which won't work with Firebase Hosting (static only). You have two options:

### Option 1: Keep Everything on Railway (Easiest) ✅
Railway can serve your Flask app with templates - no changes needed!

### Option 2: Deploy Frontend to Firebase Hosting (Requires Refactoring)

This requires converting Flask templates to static HTML. Continue if you want to separate frontend/backend.

## Quick Setup for Firebase Hosting

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
npx firebase-tools login
```

### 2. Initialize Firebase Hosting
```bash
npx firebase-tools init hosting
```
- Select your Firebase project
- Public directory: `public`
- Single-page app: `Yes`
- Auto-build: `No`

### 3. Get Your Railway URL
Copy your Railway deployment URL (e.g., `https://your-app.up.railway.app`)

### 4. Run Setup Script
```bash
export RAILWAY_URL=https://your-app.up.railway.app
./setup_firebase_hosting.sh
```

### 5. Manual Steps Required

Since Flask templates don't work with static hosting, you need to:

1. **Update JavaScript API calls** to use Railway URL:
   - Edit `public/static/js/create.js`
   - Edit `public/static/js/dashboard.js`
   - Replace `/api/user/` with `${window.API_BASE_URL}/api/user/`

2. **Update Firebase config** in HTML files:
   - Remove Flask template syntax `{{ firebase_config | tojson }}`
   - Add actual Firebase config values directly in HTML

3. **Update CORS in Railway backend:**
   - Add your Firebase Hosting domain to allowed origins
   - Update `app.py` CORS configuration

### 6. Deploy
```bash
npx firebase-tools deploy --only hosting
```

## Recommendation

**Keep everything on Railway!** It's simpler because:
- ✅ Templates work as-is
- ✅ No refactoring needed
- ✅ API calls work automatically
- ✅ Single deployment
- ✅ Easier to maintain

Railway serves Flask apps perfectly - you don't need Firebase Hosting unless you specifically want to separate frontend/backend.

## If You Still Want Firebase Hosting

See `FIREBASE_HOSTING_SETUP.md` for detailed step-by-step instructions including:
- How to convert templates to static HTML
- How to update API calls
- How to configure CORS
- How to handle Firebase config

