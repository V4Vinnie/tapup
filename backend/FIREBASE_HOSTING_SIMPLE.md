# Simple Guide: Deploy Frontend to Firebase Hosting

Since your backend is on Railway, here's the simplest way to deploy the frontend to Firebase Hosting.

## ⚠️ Important Note

Your app uses **Flask templates** which need to be converted to static HTML for Firebase Hosting. This guide will help you do that.

## Quick Setup

### 1. Get Your Railway URL

1. Go to Railway dashboard
2. Click on your deployed service
3. Copy the public URL (e.g., `https://your-app.up.railway.app`)
4. Set it as an environment variable:
   ```bash
   export RAILWAY_URL=https://your-app.up.railway.app
   ```

### 2. Install Firebase CLI

```bash
npm install -g firebase-tools
npx firebase-tools login
```

### 3. Initialize Firebase Hosting

```bash
npx firebase-tools init hosting
```

When prompted:
- Select your Firebase project
- Public directory: `public`
- Single-page app: `Yes`
- Auto-build: `No`

### 4. Prepare Frontend

**Option A: Use the Python script (Recommended)**

```bash
python3 prepare_firebase_hosting.py
```

This script will:
- Copy static files to `public/` directory
- Convert Flask templates to static HTML
- Update API URLs to point to Railway
- Create config.js with Railway URL

**Option B: Manual Setup**

1. Create `public` directory:
   ```bash
   mkdir -p public/static
   ```

2. Copy static files:
   ```bash
   cp -r static/* public/static/
   ```

3. **Update JavaScript files** - Replace `/api/user/` with your Railway URL:
   - Edit `public/static/js/create.js`
   - Find: `fetch('/api/user/from-youtube'`
   - Replace: `fetch('https://your-railway-url.up.railway.app/api/user/from-youtube'`

4. **Update HTML files** - Replace Flask template syntax:
   - Remove `{{ firebase_config | tojson }}`
   - Add actual Firebase config values
   - Remove `{{ url_for(...) }}` and use direct paths

### 5. Update Firebase Config in HTML

You need to replace the Flask template syntax with actual values. 

Edit each HTML file in `public/` and replace:
```javascript
const firebaseConfig = {{ firebase_config | tojson }};
```

With:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

You can get these values from your `.env` file or Firebase Console.

### 6. Update CORS in Railway

In Railway, add environment variable:
```
ALLOWED_ORIGINS=https://your-project.web.app,https://your-project.firebaseapp.com
```

This allows your Firebase Hosting domain to access the Railway API.

### 7. Deploy to Firebase Hosting

```bash
npx firebase-tools deploy --only hosting
```

## Troubleshooting

### "API calls failing"
- Check CORS settings in Railway
- Verify API URLs in JavaScript files
- Check browser console for errors

### "Firebase not initializing"
- Verify Firebase config is correct in HTML
- Check Firebase SDK scripts are loaded
- Check browser console for errors

### "404 errors"
- Make sure all files are in `public/` directory
- Check file paths in HTML files
- Verify Firebase Hosting configuration

## Alternative: Keep Everything on Railway

Since Railway can serve Flask apps perfectly (including templates), you might want to keep everything on Railway for simplicity. This avoids:
- Converting templates
- Managing two deployments
- CORS configuration
- API URL management

Railway serves Flask apps with templates - no changes needed!

