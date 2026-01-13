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
import logging
from pathlib import Path

from agent import ContentScreeningAgent
from microlearning_generator import MicrolearningGenerator
from content_discovery import ContentDiscovery
from video_microlearning_generator import VideoMicrolearningGenerator
from firebase_service import firebase_service

# Load .env from project root (parent directory)
project_root = Path(__file__).parent.parent
env_path = project_root / '.env'
load_dotenv(env_path)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Configure CORS - allow your frontend domain in production
allowed_origins = os.getenv('ALLOWED_ORIGINS', '*').split(',')
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

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
        
        # Optionally save as tap if topicId is provided
        topic_id = data.get('topicId')
        company_code = data.get('companyCode', '')
        if topic_id:
            try:
                tap_id = firebase_service.save_microlearning_as_tap(
                    user_id=user_id,
                    microlearning=microlearning,
                    topic_id=topic_id,
                    company_code=company_code
                )
                if tap_id:
                    microlearning['tap_id'] = tap_id
                    logger.info(f"Also saved microlearning as tap: {tap_id}")
            except Exception as e:
                logger.warning(f"Failed to save microlearning as tap: {e}")
        
        return jsonify({
            'success': True,
            'microlearning': microlearning
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/user/from-youtube', methods=['POST'])
def create_from_youtube():
    """API endpoint to create video microlearning from YouTube URL"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        youtube_url = data.get('youtube_url') or data.get('url')
        target_skill = data.get('target_skill', 'General')
        num_clips = data.get('num_clips', 3)
        
        if not user_id or not youtube_url:
            return jsonify({'error': 'Missing required fields: userId and youtube_url'}), 400
        
        # Validate YouTube URL
        if 'youtube.com' not in youtube_url and 'youtu.be' not in youtube_url:
            return jsonify({'error': 'Invalid YouTube URL'}), 400
        
        # Generate video microlearning
        generator = VideoMicrolearningGenerator(target_skill=target_skill)
        microlearning = generator.create_video_microlearning(
            youtube_url=youtube_url,
            num_clips=num_clips
        )
        
        # Add user_id and ensure ID exists
        microlearning['user_id'] = user_id
        if 'id' not in microlearning:
            microlearning['id'] = str(uuid.uuid4())
        microlearning['created_at'] = datetime.now().isoformat()
        
        # Upload videos to Firebase Storage and save to Firestore
        # Structure: videos/{userId}/{microlearningId}/clips/{clipNumber}_{filename}
        backend_dir = Path(__file__).parent
        output_dir = backend_dir / 'output'
        
        microlearning_id = firebase_service.save_video_microlearning(
            user_id=user_id,
            microlearning=microlearning,
            video_clips_dir=str(output_dir)
        )
        
        if microlearning_id:
            microlearning['id'] = microlearning_id
            logger.info(f"Successfully saved video microlearning {microlearning_id} to Firebase")
        else:
            logger.warning("Failed to save video microlearning to Firebase, but returning data anyway")
        
        # Optionally save as tap if topicId is provided
        topic_id = data.get('topicId')
        company_code = data.get('companyCode', '')
        if topic_id:
            try:
                backend_dir = Path(__file__).parent
                output_dir = backend_dir / 'output'
                
                tap_id = firebase_service.save_video_as_tap(
                    user_id=user_id,
                    video_data=microlearning,
                    topic_id=topic_id,
                    company_code=company_code,
                    video_clips_dir=str(output_dir)
                )
                if tap_id:
                    microlearning['tap_id'] = tap_id
                    logger.info(f"Also saved video microlearning as tap: {tap_id}")
            except Exception as e:
                logger.warning(f"Failed to save video microlearning as tap: {e}")
        
        return jsonify({
            'success': True,
            'microlearning': microlearning
        }), 200
    
    except Exception as e:
        logger.error(f"Error creating video microlearning: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/user/save-as-tap', methods=['POST'])
def save_as_tap():
    """API endpoint to save generated video or microlearning as a tap in Firestore"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        video_data = data.get('video_data')
        microlearning_data = data.get('microlearning_data')
        topic_id = data.get('topicId', '')
        company_code = data.get('companyCode', '')
        
        if not user_id:
            return jsonify({'error': 'Missing required field: userId'}), 400
        
        # Determine if it's a video or text microlearning
        if video_data:
            # Save video as tap
            backend_dir = Path(__file__).parent
            output_dir = backend_dir / 'output'
            
            tap_id = firebase_service.save_video_as_tap(
                user_id=user_id,
                video_data=video_data,
                topic_id=topic_id,
                company_code=company_code,
                video_clips_dir=str(output_dir)
            )
            
            if tap_id:
                logger.info(f"Successfully saved video as tap {tap_id} in Firestore")
                return jsonify({
                    'success': True,
                    'tap_id': tap_id,
                    'message': 'Video saved as tap successfully'
                }), 200
            else:
                return jsonify({'error': 'Failed to save video as tap'}), 500
        
        elif microlearning_data:
            # Save text microlearning as tap
            tap_id = firebase_service.save_microlearning_as_tap(
                user_id=user_id,
                microlearning=microlearning_data,
                topic_id=topic_id,
                company_code=company_code
            )
            
            if tap_id:
                logger.info(f"Successfully saved microlearning as tap {tap_id} in Firestore")
                return jsonify({
                    'success': True,
                    'tap_id': tap_id,
                    'message': 'Microlearning saved as tap successfully'
                }), 200
            else:
                return jsonify({'error': 'Failed to save microlearning as tap'}), 500
        else:
            return jsonify({'error': 'Missing required field: video_data or microlearning_data'}), 400
    
    except Exception as e:
        logger.error(f"Error saving as tap: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200


@app.route('/static/videos/<path:filename>')
def serve_video(filename):
    """Serve video files from output directory"""
    from flask import send_from_directory
    backend_dir = Path(__file__).parent
    output_dir = backend_dir / 'output'
    return send_from_directory(str(output_dir), filename)


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=os.getenv('FLASK_DEBUG', 'False') == 'True', host='0.0.0.0', port=port)

