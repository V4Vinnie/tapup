#!/usr/bin/env python3
"""
Script to prepare Flask templates for Firebase Hosting
Converts Flask templates to static HTML files
"""

import os
import json
from pathlib import Path
import re

# Get Railway URL from environment or prompt
RAILWAY_URL = os.getenv('RAILWAY_URL', 'https://your-app-name.up.railway.app')
FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID', '')

def get_firebase_config():
    """Get Firebase config from environment or .env file"""
    config = {
        'apiKey': os.getenv('FIREBASE_API_KEY', ''),
        'authDomain': os.getenv('FIREBASE_AUTH_DOMAIN', f'{FIREBASE_PROJECT_ID}.firebaseapp.com'),
        'projectId': os.getenv('FIREBASE_PROJECT_ID', FIREBASE_PROJECT_ID),
        'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET', f'{FIREBASE_PROJECT_ID}.appspot.com'),
        'messagingSenderId': os.getenv('FIREBASE_MESSAGING_SENDER_ID', ''),
        'appId': os.getenv('FIREBASE_APP_ID', '')
    }
    return config

def replace_flask_template(content, firebase_config, railway_url):
    """Replace Flask template syntax with static values"""
    
    # Replace Firebase config
    firebase_config_json = json.dumps(firebase_config, indent=8)
    content = re.sub(
        r"const firebaseConfig = \{\{ firebase_config \| tojson \}\};",
        f"const firebaseConfig = {firebase_config_json};",
        content
    )
    
    # Replace url_for('static', ...) with direct paths
    content = re.sub(
        r"\{\{ url_for\('static', filename='([^']+)'\) \}\}",
        r"/static/\1",
        content
    )
    
    # Replace {% block ... %} and {% endblock %}
    content = re.sub(r"\{\%\s*block\s+(\w+)\s*\%\}", r"<!-- block \1 -->", content)
    content = re.sub(r"\{\%\s*endblock\s*\%\}", r"<!-- endblock -->", content)
    
    # Replace {% extends ... %}
    content = re.sub(r"\{\%\s*extends\s+['\"]([^'\"]+)['\"]\s*\%\}", "", content)
    
    return content

def process_template(template_path, output_path, firebase_config, railway_url):
    """Process a single template file"""
    with open(template_path, 'r') as f:
        content = f.read()
    
    # Replace Flask template syntax
    content = replace_flask_template(content, firebase_config, railway_url)
    
    # Write to output
    with open(output_path, 'w') as f:
        f.write(content)
    
    print(f"✓ Processed: {template_path.name} -> {output_path}")

def update_js_api_urls(js_path, railway_url):
    """Update API URLs in JavaScript files"""
    with open(js_path, 'r') as f:
        content = f.read()
    
    # Replace /api/ with full Railway URL
    content = re.sub(
        r"fetch\(['\"]\/api\/",
        f"fetch('{railway_url}/api/",
        content
    )
    
    # Add API_BASE_URL at the top of create.js
    if 'create.js' in str(js_path):
        if 'window.API_BASE_URL' not in content:
            content = f"// API Configuration\nwindow.API_BASE_URL = '{railway_url}';\n\n{content}"
    
    with open(js_path, 'w') as f:
        f.write(content)
    
    print(f"✓ Updated API URLs in: {js_path.name}")

def main():
    print("🚀 Preparing frontend for Firebase Hosting\n")
    
    # Get configuration
    railway_url = RAILWAY_URL
    if railway_url == 'https://your-app-name.up.railway.app':
        railway_url = input("Enter your Railway URL: ").strip()
        if not railway_url:
            print("❌ Railway URL is required!")
            return
    
    firebase_config = get_firebase_config()
    
    # Create public directory
    public_dir = Path('public')
    public_dir.mkdir(exist_ok=True)
    
    # Copy static files
    print("\n📋 Copying static files...")
    static_dir = Path('static')
    public_static = public_dir / 'static'
    public_static.mkdir(parents=True, exist_ok=True)
    
    # Copy CSS
    if (static_dir / 'css').exists():
        (public_static / 'css').mkdir(exist_ok=True)
        import shutil
        shutil.copytree(static_dir / 'css', public_static / 'css', dirs_exist_ok=True)
    
    # Copy JS (will update API URLs)
    if (static_dir / 'js').exists():
        (public_static / 'js').mkdir(exist_ok=True)
        import shutil
        shutil.copytree(static_dir / 'js', public_static / 'js', dirs_exist_ok=True)
        
        # Update API URLs in JavaScript files
        print("\n⚙️  Updating API URLs in JavaScript...")
        for js_file in (public_static / 'js').glob('*.js'):
            if js_file.name in ['create.js']:
                update_js_api_urls(js_file, railway_url)
    
    # Create config.js
    config_js = public_static / 'js' / 'config.js'
    with open(config_js, 'w') as f:
        f.write(f"// API Configuration\nwindow.API_BASE_URL = '{railway_url}';\n")
    print(f"✓ Created: {config_js}")
    
    # Process templates
    print("\n📄 Processing templates...")
    templates_dir = Path('templates')
    
    # Process base.html first (for reference)
    base_template = templates_dir / 'base.html'
    if base_template.exists():
        with open(base_template, 'r') as f:
            base_content = f.read()
        
        # Create base HTML structure
        base_content = replace_flask_template(base_content, firebase_config, railway_url)
        
        # Add config.js script before auth.js
        base_content = base_content.replace(
            '<script src="/static/js/auth.js">',
            '<script src="/static/js/config.js"></script>\n    <script src="/static/js/auth.js">'
        )
        
        # Process each template that extends base
        template_files = ['index.html', 'register.html', 'login.html', 'dashboard.html', 'create.html']
        
        for template_name in template_files:
            template_path = templates_dir / template_name
            if template_path.exists():
                with open(template_path, 'r') as f:
                    template_content = f.read()
                
                # Extract content between {% block content %} and {% endblock %}
                content_match = re.search(r'\{\%\s*block\s+content\s*\%\}(.*?)\{\%\s*endblock\s*\%\}', template_content, re.DOTALL)
                if content_match:
                    block_content = content_match.group(1)
                else:
                    block_content = template_content
                
                # Extract title
                title_match = re.search(r'\{\%\s*block\s+title\s*\%\}(.*?)\{\%\s*endblock\s*\%\}', template_content)
                title = title_match.group(1) if title_match else f'TapUp - {template_name}'
                
                # Combine base with content
                final_html = base_content.replace('<!-- block content -->', block_content)
                final_html = final_html.replace('{% block title %}TapUp - The Swipe Academy{% endblock %}', title)
                final_html = re.sub(r'\{\%\s*block\s+scripts\s*\%\}.*?\{\%\s*endblock\s*\%\}', '', final_html, flags=re.DOTALL)
                
                # Clean up any remaining template syntax
                final_html = re.sub(r'\{\{.*?\}\}', '', final_html)
                final_html = re.sub(r'\{\%.*?\%\}', '', final_html)
                
                output_path = public_dir / template_name
                with open(output_path, 'w') as f:
                    f.write(final_html)
                
                print(f"✓ Created: {output_path}")
    
    print("\n✅ Frontend prepared for Firebase Hosting!")
    print(f"\n📝 Next steps:")
    print(f"1. Review the files in the 'public' directory")
    print(f"2. Update Firebase config values in HTML files if needed")
    print(f"3. Run: firebase deploy --only hosting")
    print(f"\n⚠️  Note: You may need to manually update Firebase config in the HTML files")

if __name__ == '__main__':
    main()

