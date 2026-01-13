#!/bin/bash
# Script to build frontend for Firebase Hosting

echo "Building frontend for Firebase Hosting..."

# Create public directory
mkdir -p public

# Copy templates to public (as HTML files)
cp templates/index.html public/
cp templates/register.html public/
cp templates/login.html public/
cp templates/dashboard.html public/
cp templates/create.html public/
cp templates/base.html public/

# Copy static files
cp -r static public/

# Create templates directory structure in public for compatibility
mkdir -p public/templates
cp templates/*.html public/templates/

# Create config.js with API URL
cat > public/static/js/config.js << EOF
// API Configuration
window.API_BASE_URL = '${API_BASE_URL:-https://your-railway-app.up.railway.app}';
EOF

echo "Frontend built successfully!"
echo "API URL: ${API_BASE_URL:-https://your-railway-app.up.railway.app}"
echo "Don't forget to update API_BASE_URL with your Railway URL!"

