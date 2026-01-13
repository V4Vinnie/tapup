# Deployment Guide for TapUp

This guide explains deployment options for the TapUp microlearning platform.

## ⚠️ Important: Firebase Hosting Limitation

**Firebase Hosting is for static websites only** - it cannot run Python Flask applications. Your Flask backend needs a different hosting solution.

## Recommended Deployment Options

### Option 1: Google Cloud Run (Recommended for Firebase Users)

**Best for:** Flask apps with Firebase integration, scalable, serverless

**Pros:**
- Integrates well with Firebase
- Serverless (pay per use)
- Automatic scaling
- Supports Docker containers
- Good for video processing workloads

**Steps:**

1. **Create Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (FFmpeg for video processing)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Run Flask app
CMD exec gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 app:app
```

2. **Create .dockerignore:**
```
__pycache__/
*.pyc
*.pyo
*.pyd
.env
.venv/
venv/
downloads/
output/
storage/
.git/
```

3. **Deploy to Cloud Run:**
```bash
# Build and deploy
gcloud run deploy tapup \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 3600 \
  --set-env-vars "OPENAI_API_KEY=your_key"
```

4. **Update Firebase Hosting (for frontend only):**
```javascript
// firebase.json
{
  "hosting": {
    "public": "static",
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "tapup",
          "region": "us-central1"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Option 2: Railway (Easiest)

**Best for:** Quick deployment, simple setup

**Pros:**
- Very easy setup
- Automatic deployments from Git
- Supports Python/Flask natively
- Free tier available
- Built-in environment variables

**Steps:**

1. Push code to GitHub
2. Connect Railway to your repo
3. Add environment variables in Railway dashboard
4. Deploy (automatic)

**Railway automatically detects Flask apps!**

### Option 3: Render

**Best for:** Simple deployment, good free tier

**Pros:**
- Free tier available
- Easy GitHub integration
- Automatic SSL
- Supports background workers

**Steps:**

1. Create account at render.com
2. Connect GitHub repo
3. Select "Web Service"
4. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Environment: Python 3
5. Add environment variables
6. Deploy

### Option 4: Heroku

**Best for:** Established platform, add-ons

**Pros:**
- Well-established platform
- Good documentation
- Many add-ons

**Cons:**
- More expensive
- Free tier discontinued

**Steps:**

1. Install Heroku CLI
2. Create `Procfile`:
```
web: gunicorn app:app
```

3. Deploy:
```bash
heroku create tapup-app
heroku config:set OPENAI_API_KEY=your_key
git push heroku main
```

### Option 5: AWS/GCP with Docker

**Best for:** Full control, production scale

Use AWS Elastic Beanstalk, Google App Engine, or Azure App Service with Docker containers.

## Deployment Checklist

### Before Deploying:

- [ ] Set all environment variables (don't hardcode secrets!)
- [ ] Update `SECRET_KEY` in production
- [ ] Configure CORS for your domain
- [ ] Set up proper Firestore security rules
- [ ] Test video processing (ensure FFmpeg is installed)
- [ ] Configure file storage (downloads/, output/)
- [ ] Set up error logging/monitoring
- [ ] Configure domain name
- [ ] Set up SSL/HTTPS

### Environment Variables Needed:

```bash
# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# OpenAI
OPENAI_API_KEY=

# Flask
SECRET_KEY=  # Generate a secure random key

# Optional: Firebase Admin
FIREBASE_SERVICE_ACCOUNT_PATH=
```

### Production Considerations:

1. **File Storage:**
   - Use Firebase Storage or Cloud Storage for video files
   - Don't store videos on local filesystem (ephemeral in containers)

2. **Video Processing:**
   - Consider using Cloud Functions for video processing
   - Or use a separate worker service (Cloud Run jobs)

3. **Database:**
   - Firestore is already cloud-hosted (no action needed)
   - Ensure proper security rules

4. **CORS:**
   - Update CORS in `app.py` for your production domain

5. **Static Files:**
   - Serve static files from Firebase Hosting or CDN
   - Video files from Cloud Storage

## Hybrid Approach (Recommended)

**Frontend:** Firebase Hosting (static files)
**Backend:** Cloud Run / Railway / Render (Flask API)
**Database:** Firestore (already cloud)
**Storage:** Firebase Storage (for videos)

### Architecture:

```
User → Firebase Hosting (HTML/CSS/JS)
  ↓
Firebase Functions (proxy) OR Direct API calls
  ↓
Cloud Run / Railway (Flask API)
  ↓
Firestore + Firebase Storage
```

## Quick Start: Railway Deployment

1. **Install Railway CLI:**
```bash
npm i -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Initialize:**
```bash
railway init
```

4. **Add environment variables:**
```bash
railway variables set OPENAI_API_KEY=your_key
railway variables set FIREBASE_API_KEY=your_key
# ... etc
```

5. **Deploy:**
```bash
railway up
```

That's it! Railway handles the rest.

## Need Help?

- Check deployment logs for errors
- Ensure FFmpeg is available in your deployment environment
- Verify environment variables are set correctly
- Test API endpoints after deployment
- Check Firestore security rules

