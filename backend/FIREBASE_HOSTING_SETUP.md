# Firebase Hosting Setup Guide for Frontend

This guide will help you deploy the frontend to Firebase Hosting while keeping the backend on Railway.

## Prerequisites

1. ✅ Railway backend deployed and running
2. ✅ Firebase project created
3. ✅ Firebase CLI installed

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase

```bash
firebase login
```

## Step 3: Initialize Firebase Hosting

```bash
firebase init hosting
```

When prompted:
- **Select your Firebase project** (the one you're using for Firestore)
- **Public directory:** `public`
- **Single-page app:** `Yes`
- **Set up automatic builds:** `No` (we'll build manually)

## Step 4: Get Your Railway API URL

1. Go to your Railway dashboard
2. Click on your deployed service
3. Copy the **public URL** (e.g., `https://your-app-name.up.railway.app`)
4. Save this URL - you'll need it in the next step

## Step 5: Build Frontend

Since Flask serves templates dynamically, we need to create a static version. However, Firebase Hosting can serve static HTML files directly.

### Option A: Simple Static Build (Recommended)

1. **Create a build script** (already created: `build_frontend.sh`)

2. **Set your Railway API URL:**
```bash
export API_BASE_URL=https://your-app-name.up.railway.app
```

3. **Run the build:**
```bash
chmod +x build_frontend.sh
./build_frontend.sh
```

4. **Manually update API URLs in JavaScript files:**
   - Edit `public/static/js/create.js`
   - Edit `public/static/js/dashboard.js`
   - Replace `/api/user/` with `${API_BASE_URL}/api/user/`

### Option B: Update JavaScript Files Directly

Since the backend is on Railway, update the API calls in your JavaScript files:

**Edit `static/js/create.js`:**

Find:
```javascript
const response = await fetch('/api/user/from-youtube', {
```

Replace with:
```javascript
const API_BASE_URL = 'https://your-app-name.up.railway.app';
const response = await fetch(`${API_BASE_URL}/api/user/from-youtube`, {
```

Do this for all `/api/` calls in:
- `static/js/create.js`
- `static/js/dashboard.js`

**Alternative: Use Environment Variable**

Create `public/static/js/config.js`:
```javascript
window.API_BASE_URL = 'https://your-app-name.up.railway.app';
```

Then in your JS files:
```javascript
const API_BASE_URL = window.API_BASE_URL || '';
const response = await fetch(`${API_BASE_URL}/api/user/from-youtube`, {
```

## Step 6: Update Firebase Config in Templates

Since Firebase config is injected by Flask, you need to:

1. **Option A: Hardcode in templates** (not recommended - exposes keys)

2. **Option B: Use environment variables** (recommended)

   Update `templates/base.html` to read from environment:
   ```html
   <script>
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     
     if (firebaseConfig.apiKey) {
       firebase.initializeApp(firebaseConfig);
       window.auth = firebase.auth();
       window.db = firebase.firestore();
     }
   </script>
   ```

3. **Option C: Use Firebase Hosting environment variables** (best)

   Firebase Hosting doesn't support environment variables directly, but you can:
   - Use Firebase Functions to inject config
   - Or use a separate config file
   - Or build the config at build time

## Step 7: Copy Files to Public Directory

```bash
# Copy templates (will need to be converted to static HTML)
cp -r templates/* public/templates/ 2>/dev/null || true

# Copy static files
cp -r static public/

# Copy HTML files (need to update API URLs and Firebase config)
cp templates/index.html public/
cp templates/register.html public/
cp templates/login.html public/
cp templates/dashboard.html public/
cp templates/create.html public/
```

## Step 8: Update HTML Files

Since Flask templates won't work in static hosting, you need to:

1. **Update Firebase config** in each HTML file
2. **Update API URLs** in JavaScript references
3. **Remove Flask template syntax** (`{{ ... }}`)

## Step 9: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

## Quick Setup Script

Here's a complete script to set everything up:

```bash
#!/bin/bash

# Set your Railway API URL
RAILWAY_URL="https://your-app-name.up.railway.app"

# Create public directory
mkdir -p public
mkdir -p public/static/js
mkdir -p public/static/css

# Copy static files
cp -r static/* public/static/

# Copy templates
cp templates/*.html public/

# Create config.js
cat > public/static/js/config.js << EOF
window.API_BASE_URL = '$RAILWAY_URL';
EOF

# Update HTML files to include config.js
# (You'll need to manually add <script src="/static/js/config.js"></script> to base.html)

echo "Build complete! Now update API URLs in JavaScript files."
echo "Then run: firebase deploy --only hosting"
```

## Important Notes

### CORS Configuration

Make sure your Railway backend allows requests from your Firebase Hosting domain:

In `app.py`, update CORS:
```python
allowed_origins = [
    'https://your-project.web.app',
    'https://your-project.firebaseapp.com',
    'http://localhost:5000'  # for local development
]
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
```

### Firebase Config

You'll need to include Firebase config in each HTML file since Flask templates won't work.

### Video Files

Video files served from `/static/videos/` will need to be:
- Stored in Firebase Storage
- Or served from Railway
- Or use a CDN

## Troubleshooting

### "API calls failing"
- Check CORS settings in Railway backend
- Verify API_BASE_URL is correct
- Check browser console for errors

### "Firebase not initializing"
- Verify Firebase config is included in HTML
- Check Firebase project settings
- Ensure Firebase SDK scripts are loaded

### "404 errors"
- Check that all files are in `public/` directory
- Verify file paths in HTML are correct
- Check Firebase Hosting logs

## Alternative: Simpler Approach

Since your app uses Flask templates, consider keeping the frontend on Railway too:

1. Railway can serve both frontend and backend
2. No need to separate deployment
3. Templates work as-is
4. Simpler configuration

Railway can serve Flask apps that include templates - you don't need Firebase Hosting unless you specifically want to separate them.

