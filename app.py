"""
Flask Web Application for TapUp Microlearning Platform
"""

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import os
from dotenv import load_dotenv
from datetime import datetime
import json
import uuid

from agent import ContentScreeningAgent
from microlearning_generator import MicrolearningGenerator
from content_discovery import ContentDiscovery

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
CORS(app)

# Firebase configuration (will be loaded from environment)
FIREBASE_CONFIG = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID")
}


@app.route('/')
def index():
    """Home page"""
    return render_template('index.html', firebase_config=FIREBASE_CONFIG)


@app.route('/register')
def register():
    """Registration page"""
    return render_template('register.html', firebase_config=FIREBASE_CONFIG)


@app.route('/login')
def login():
    """Login page"""
    return render_template('login.html', firebase_config=FIREBASE_CONFIG)


@app.route('/dashboard')
def dashboard():
    """User dashboard"""
    return render_template('dashboard.html', firebase_config=FIREBASE_CONFIG)


@app.route('/create')
def create():
    """Create microlearning page"""
    return render_template('create.html', firebase_config=FIREBASE_CONFIG)


@app.route('/api/user/create-microlearning', methods=['POST'])
def create_microlearning():
    """API endpoint to create a microlearning"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        title = data.get('title')
        content = data.get('content')
        target_skill = data.get('target_skill', 'General')
        url = data.get('url', '')
        description = data.get('description', '')
        
        if not user_id or not title or not content:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Initialize microlearning generator
        generator = MicrolearningGenerator(target_skill=target_skill)
        
        # Create microlearning
        microlearning = generator.create_microlearning(
            title=title,
            content=content,
            url=url,
            description=description
        )
        
        # Add user_id and unique ID
        microlearning['user_id'] = user_id
        microlearning['id'] = str(uuid.uuid4())
        microlearning['created_at'] = datetime.now().isoformat()
        
        return jsonify({
            'success': True,
            'microlearning': microlearning
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/user/from-url', methods=['POST'])
def create_from_url():
    """API endpoint to create microlearning from URL"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        url = data.get('url')
        target_skill = data.get('target_skill', 'General')
        
        if not user_id or not url:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Fetch content from URL
        discovery = ContentDiscovery()
        content_item = discovery.discover_from_website(url, max_items=1)
        
        if not content_item:
            return jsonify({'error': 'Could not fetch content from URL'}), 400
        
        item = content_item[0]
        full_content = discovery.fetch_full_content(item)
        
        if not full_content or len(full_content) < 100:
            return jsonify({'error': 'Insufficient content from URL'}), 400
        
        # Generate microlearning
        generator = MicrolearningGenerator(target_skill=target_skill)
        microlearning = generator.create_microlearning(
            title=item.title,
            content=full_content,
            url=url,
            description=item.description
        )
        
        # Add user_id and unique ID
        microlearning['user_id'] = user_id
        microlearning['id'] = str(uuid.uuid4())
        microlearning['created_at'] = datetime.now().isoformat()
        
        return jsonify({
            'success': True,
            'microlearning': microlearning
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)

