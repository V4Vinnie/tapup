# Railway Deployment Guide for TapUp Backend

This guide explains how to deploy the TapUp backend to Railway.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Railway CLI** (optional but recommended):
   ```bash
   npm i -g @railway/cli
   ```

## Quick Deployment Steps

### Option 1: Deploy via Railway Dashboard (Easiest)

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Create New Project**: Click "New Project"
3. **Deploy from GitHub**:
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend/` directory as the root
   - Railway will auto-detect it's a Python/Flask app

4. **Configure Environment Variables**:
   - Go to your service → Variables
   - Add all required environment variables (see below)

5. **Deploy**: Railway will automatically build and deploy!

### Option 2: Deploy via Railway CLI

1. **Login to Railway**:
   ```bash
   railway login
   ```

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Initialize Railway project**:
   ```bash
   railway init
   ```

4. **Set environment variables**:
   ```bash
   railway variables set FIREBASE_API_KEY=your_key
   railway variables set FIREBASE_AUTH_DOMAIN=your_domain
   railway variables set FIREBASE_PROJECT_ID=tap-up-1a65a
   railway variables set FIREBASE_STORAGE_BUCKET=your_bucket
   railway variables set FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   railway variables set FIREBASE_APP_ID=your_app_id
   railway variables set GEMINI_API_KEY=your_gemini_key
   railway variables set SECRET_KEY=your_secret_key
   railway variables set PORT=8080
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

## Required Environment Variables

Add these in Railway Dashboard → Your Service → Variables:

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=tap-up-1a65a
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Firebase Admin (choose one method)
# Option 1: Service Account File Path (if uploaded)
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json

# Option 2: Service Account JSON (recommended for Railway)
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}

# AI/ML Services
GEMINI_API_KEY=your_gemini_api_key

# Flask Configuration
SECRET_KEY=your_secure_random_secret_key
PORT=8080

# CORS (optional, defaults to *)
ALLOWED_ORIGINS=https://yourdomain.com,https://app.tapup.com
```

## Railway Configuration

The project includes:
- **Dockerfile**: For containerized deployment
- **railway.json**: Railway-specific configuration
- **Procfile**: Process configuration
- **.dockerignore**: Excludes unnecessary files from Docker build

## Deployment Notes

1. **Port Configuration**: Railway automatically sets the `PORT` environment variable. The app uses `PORT` or defaults to 8080.

2. **Build Process**: Railway will:
   - Detect the Dockerfile
   - Build the Docker image
   - Install all Python dependencies
   - Install FFmpeg (required for video processing)
   - Start the Flask app with Gunicorn

3. **Video Processing**: FFmpeg is installed in the Dockerfile, so video processing will work.

4. **File Storage**: 
   - Local files (downloads/, output/) are ephemeral
   - Videos should be uploaded to Firebase Storage (handled by `firebase_service.py`)

5. **Auto-Deploy**: If connected to GitHub, Railway will auto-deploy on every push to your main branch.

## Verifying Deployment

After deployment:

1. **Check Logs**: Railway Dashboard → Your Service → Deployments → View Logs
2. **Test Health Endpoint**: `https://your-app.railway.app/api/health`
3. **Test API**: Try creating a microlearning via the API endpoints

## Custom Domain (Optional)

1. Go to Railway Dashboard → Your Service → Settings → Networking
2. Click "Generate Domain" or add a custom domain
3. Railway provides free SSL certificates automatically

## Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure all dependencies in `requirements.txt` are valid
- Verify Dockerfile syntax

### App Crashes
- Check runtime logs
- Verify all environment variables are set
- Ensure Firebase credentials are correct

### Video Processing Fails
- Verify FFmpeg is installed (it's in the Dockerfile)
- Check that Firebase Storage is configured
- Verify FIREBASE_STORAGE_BUCKET is set

### Port Issues
- Railway sets PORT automatically, don't hardcode it
- The app uses `os.getenv('PORT', 5000)` which should work

## Updating Deployment

To update your deployment:

1. **Via Git**: Just push to your connected branch, Railway auto-deploys
2. **Via CLI**: `railway up` from the backend directory
3. **Manual**: Railway Dashboard → Deployments → Redeploy

## Cost

Railway offers:
- **Free Tier**: $5 credit/month
- **Pay-as-you-go**: After free tier
- Check current pricing at railway.app/pricing

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check deployment logs for specific errors
