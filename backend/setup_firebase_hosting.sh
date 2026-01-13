#!/bin/bash
# Setup script for Firebase Hosting deployment

set -e

echo "🚀 Setting up Firebase Hosting for TapUp Frontend"
echo ""

# Check if Railway URL is provided
if [ -z "$RAILWAY_URL" ]; then
    echo "⚠️  RAILWAY_URL not set. Please provide your Railway deployment URL:"
    echo "   export RAILWAY_URL=https://your-app-name.up.railway.app"
    echo ""
    read -p "Enter your Railway URL: " RAILWAY_URL
fi

if [ -z "$RAILWAY_URL" ]; then
    echo "❌ Railway URL is required. Exiting."
    exit 1
fi

echo "✅ Using Railway URL: $RAILWAY_URL"
echo ""

# Create public directory
echo "📁 Creating public directory structure..."
mkdir -p public
mkdir -p public/static/js
mkdir -p public/static/css

# Copy static files
echo "📋 Copying static files..."
cp -r static/* public/static/

# Create config.js with Railway URL
echo "⚙️  Creating API config..."
cat > public/static/js/config.js << EOF
// API Configuration for Firebase Hosting
window.API_BASE_URL = '$RAILWAY_URL';
EOF

echo ""
echo "✅ Build complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update HTML files to include config.js (add <script> tag before other JS files)"
echo "2. Update API calls in JS files to use window.API_BASE_URL"
echo "3. Update Firebase config in HTML files (can't use Flask template syntax)"
echo "4. Run: firebase deploy --only hosting"
echo ""
echo "📚 See FIREBASE_HOSTING_SETUP.md for detailed instructions"

