"""
Firebase Service for User Management and Data Storage
"""

import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
import os
from typing import Optional, Dict, List
from dotenv import load_dotenv
import json
import logging
import uuid
import sys
from pathlib import Path

# Load .env from project root (parent directory)
project_root = Path(__file__).parent.parent
env_path = project_root / '.env'
load_dotenv(env_path)

logger = logging.getLogger(__name__)


class FirebaseService:
    """Service for interacting with Firebase"""
    
    _instance = None
    _db = None
    _bucket = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirebaseService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if already initialized
            if not firebase_admin._apps:
                storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET")
                # Option 1: Use service account file
                service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
                if service_account_path and os.path.exists(service_account_path):
                    cred = credentials.Certificate(service_account_path)
                    if storage_bucket:
                        firebase_admin.initialize_app(cred, {'storageBucket': storage_bucket})
                    else:
                        firebase_admin.initialize_app(cred)
                else:
                    # Option 2: Use environment variables
                    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
                    if service_account_json:
                        cred_dict = json.loads(service_account_json)
                        cred = credentials.Certificate(cred_dict)
                        if storage_bucket:
                            firebase_admin.initialize_app(cred, {'storageBucket': storage_bucket})
                        else:
                            firebase_admin.initialize_app(cred)
                    else:
                        # Option 3: Default credentials (for GCP environments)
                        if storage_bucket:
                            firebase_admin.initialize_app(options={'storageBucket': storage_bucket})
                        else:
                            firebase_admin.initialize_app()
            
            self._db = firestore.client()
            
            # Initialize storage bucket
            storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET")
            if storage_bucket:
                self._bucket = storage.bucket(storage_bucket)
            else:
                logger.warning("FIREBASE_STORAGE_BUCKET not set, video uploads will be disabled")
        except Exception as e:
            logger.warning(f"Firebase Admin SDK initialization failed: {e}")
            logger.warning("Firebase Admin features will be limited. Client-side auth will still work.")
    
    def create_user_record(self, user_id: str, email: str, display_name: str = "") -> bool:
        """Create a user record in Firestore"""
        try:
            if not self._db:
                return False
            
            user_ref = self._db.collection('users').document(user_id)
            user_ref.set({
                'email': email,
                'display_name': display_name,
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP
            })
            return True
        except Exception as e:
            print(f"Error creating user record: {e}")
            return False
    
    def save_microlearning(self, user_id: str, microlearning: Dict) -> Optional[str]:
        """Save a microlearning to Firestore"""
        try:
            if not self._db:
                return None
            
            microlearning['user_id'] = user_id
            microlearning['created_at'] = firestore.SERVER_TIMESTAMP
            
            ml_ref = self._db.collection('microlearnings').document()
            ml_ref.set(microlearning)
            return ml_ref.id
        except Exception as e:
            print(f"Error saving microlearning: {e}")
            return None
    
    def get_user_microlearnings(self, user_id: str) -> List[Dict]:
        """Get all microlearnings for a user"""
        try:
            if not self._db:
                return []
            
            ml_ref = self._db.collection('microlearnings')
            query = ml_ref.where('user_id', '==', user_id).order_by('created_at', direction=firestore.Query.DESCENDING)
            docs = query.stream()
            
            microlearnings = []
            for doc in docs:
                ml_data = doc.to_dict()
                ml_data['id'] = doc.id
                # Convert timestamp to string if present
                if 'created_at' in ml_data:
                    ml_data['created_at'] = ml_data['created_at'].isoformat() if hasattr(ml_data['created_at'], 'isoformat') else str(ml_data['created_at'])
                microlearnings.append(ml_data)
            
            return microlearnings
        except Exception as e:
            print(f"Error getting user microlearnings: {e}")
            return []
    
    def delete_microlearning(self, microlearning_id: str, user_id: str) -> bool:
        """Delete a microlearning"""
        try:
            if not self._db:
                return False
            
            ml_ref = self._db.collection('microlearnings').document(microlearning_id)
            doc = ml_ref.get()
            
            if doc.exists:
                ml_data = doc.to_dict()
                if ml_data.get('user_id') == user_id:
                    ml_ref.delete()
                    return True
            
            return False
        except Exception as e:
            print(f"Error deleting microlearning: {e}")
            return False
    
    def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user data"""
        try:
            if not self._db:
                return None
            
            user_ref = self._db.collection('users').document(user_id)
            doc = user_ref.get()
            
            if doc.exists:
                user_data = doc.to_dict()
                user_data['id'] = doc.id
                return user_data
            return None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    def upload_video_to_storage(self, local_file_path: str, user_id: str, microlearning_id: str, clip_number: int = None) -> Optional[str]:
        """
        Upload a video file to Firebase Storage
        
        Structure: videos/{userId}/{microlearningId}/{filename}
        For clips: videos/{userId}/{microlearningId}/clips/{clipNumber}_{filename}
        
        Args:
            local_file_path: Path to local video file
            user_id: User ID
            microlearning_id: Microlearning ID
            clip_number: Optional clip number for video clips
        
        Returns:
            Public URL of uploaded video, or None if upload failed
        """
        try:
            if not self._bucket:
                logger.warning("Firebase Storage bucket not initialized")
                return None
            
            if not os.path.exists(local_file_path):
                logger.error(f"Video file not found: {local_file_path}")
                return None
            
            # Get filename
            filename = os.path.basename(local_file_path)
            
            # Structure path like Storythingbe/tapUp: videos/{userId}/{microlearningId}/{filename}
            if clip_number is not None:
                # For clips: videos/{userId}/{microlearningId}/clips/{clipNumber}_{filename}
                blob_name = f"videos/{user_id}/{microlearning_id}/clips/{clip_number}_{filename}"
            else:
                # For main video: videos/{userId}/{microlearningId}/{filename}
                blob_name = f"videos/{user_id}/{microlearning_id}/{filename}"
            
            # Upload file
            blob = self._bucket.blob(blob_name)
            blob.upload_from_filename(local_file_path)
            
            # Make blob publicly readable
            blob.make_public()
            
            # Get public URL
            public_url = blob.public_url
            
            logger.info(f"Uploaded video to Firebase Storage: {blob_name}")
            return public_url
            
        except Exception as e:
            logger.error(f"Error uploading video to Firebase Storage: {e}")
            return None
    
    def save_video_microlearning(self, user_id: str, microlearning: Dict, video_clips_dir: str = None) -> Optional[str]:
        """
        Save a video microlearning to Firestore and upload videos to Firebase Storage
        
        Args:
            user_id: User ID
            microlearning: Microlearning dictionary with clips
            video_clips_dir: Directory containing video clip files (default: 'output')
        
        Returns:
            Microlearning document ID, or None if save failed
        """
        try:
            if not self._db:
                return None
            
            # Generate microlearning ID if not present
            microlearning_id = microlearning.get('id') or str(uuid.uuid4())
            microlearning['id'] = microlearning_id
            
            # Set default clips directory (relative to backend directory)
            if video_clips_dir is None:
                backend_dir = Path(__file__).parent
                video_clips_dir = backend_dir / 'output'
                video_clips_dir = str(video_clips_dir)
            
            # Upload video clips to Firebase Storage
            if 'clips' in microlearning and isinstance(microlearning['clips'], list):
                updated_clips = []
                for clip in microlearning['clips']:
                    if 'video_file' in clip:
                        video_filename = clip['video_file']
                        local_video_path = os.path.join(video_clips_dir, video_filename)
                        
                        # Upload to Firebase Storage
                        clip_number = clip.get('clip_number', len(updated_clips) + 1)
                        firebase_url = self.upload_video_to_storage(
                            local_file_path=local_video_path,
                            user_id=user_id,
                            microlearning_id=microlearning_id,
                            clip_number=clip_number
                        )
                        
                        # Update clip with Firebase Storage URL
                        updated_clip = clip.copy()
                        if firebase_url:
                            updated_clip['video_url'] = firebase_url
                            updated_clip['video_storage_path'] = f"videos/{user_id}/{microlearning_id}/clips/{clip_number}_{video_filename}"
                        else:
                            # Fallback to local path if upload fails
                            updated_clip['video_url'] = f"/static/videos/{video_filename}"
                        
                        updated_clips.append(updated_clip)
                    else:
                        updated_clips.append(clip)
                
                microlearning['clips'] = updated_clips
            
            # Save to Firestore
            microlearning['user_id'] = user_id
            microlearning['created_at'] = firestore.SERVER_TIMESTAMP
            
            ml_ref = self._db.collection('microlearnings').document(microlearning_id)
            ml_ref.set(microlearning)
            
            logger.info(f"Saved video microlearning to Firestore: {microlearning_id}")
            return microlearning_id
            
        except Exception as e:
            logger.error(f"Error saving video microlearning: {e}")
            return None
    
    def save_video_as_tap(
        self,
        user_id: str,
        video_data: Dict,
        topic_id: str,
        company_code: str = "",
        video_clips_dir: str = None
    ) -> Optional[str]:
        """
        Save a generated video as a tap in the taps collection.
        
        This method converts video microlearning data to the TapUp taps format
        and stores it in the Firestore 'taps' collection.
        
        Note: Generated videos are automatically made available to ALL companies
        by setting companyCode to an empty string.
        
        Args:
            user_id: User ID (creator ID)
            video_data: Dictionary containing video information with clips
            topic_id: Topic ID for the tap
            company_code: Company code (ignored - videos are available to all companies)
            video_clips_dir: Directory containing video clip files (default: 'output')
        
        Returns:
            Tap document ID, or None if save failed
        
        Example video_data structure:
        {
            'name': 'Video Title',
            'description': 'Video description',
            'thumbnail': 'thumbnail_url',
            'clips': [
                {
                    'video_file': 'clip_1.mp4',
                    'title': 'Clip 1 Title',
                    'description': 'Clip 1 description',
                    ...
                },
                ...
            ]
        }
        """
        try:
            if not self._db:
                logger.error("Firestore database not initialized")
                return None
            
            # Generate tap ID
            tap_id = video_data.get('id') or str(uuid.uuid4())
            
            # Set default clips directory (relative to backend directory)
            if video_clips_dir is None:
                backend_dir = Path(__file__).parent
                video_clips_dir = backend_dir / 'output'
                video_clips_dir = str(video_clips_dir)
            
            # Convert clips to frames in a chapter
            frames = []
            if 'clips' in video_data and isinstance(video_data['clips'], list):
                for idx, clip in enumerate(video_data['clips']):
                    frame_id = clip.get('id') or str(uuid.uuid4())
                    clip_number = clip.get('clip_number', idx + 1)
                    
                    # Upload video to Firebase Storage if video_file exists
                    video_url = None
                    if 'video_file' in clip:
                        video_filename = clip['video_file']
                        local_video_path = os.path.join(video_clips_dir, video_filename)
                        
                        if os.path.exists(local_video_path):
                            # Upload to Firebase Storage
                            firebase_url = self.upload_video_to_storage(
                                local_file_path=local_video_path,
                                user_id=user_id,
                                microlearning_id=tap_id,
                                clip_number=clip_number
                            )
                            if firebase_url:
                                video_url = firebase_url
                    
                    # Create frame object
                    frame = {
                        'id': frame_id,
                        'createdAt': firestore.SERVER_TIMESTAMP,
                        'type': 'VIDEO',
                        'videoUrl': video_url or clip.get('video_url', ''),
                        'title': clip.get('title', clip.get('name', f'Clip {clip_number}')),
                        'description': clip.get('description', ''),
                        'thumbnail': clip.get('thumbnail', video_data.get('thumbnail', '')),
                    }
                    
                    # Add any additional clip data
                    if 'transcript' in clip:
                        frame['transcript'] = clip['transcript']
                    if 'duration' in clip:
                        frame['duration'] = clip['duration']
                    
                    frames.append(frame)
            
            # Add quiz questions as QUESTION frames if they exist
            if 'quiz_questions' in video_data and isinstance(video_data['quiz_questions'], list):
                question_frames = self._convert_quiz_to_question_frames(video_data['quiz_questions'])
                frames.extend(question_frames)
            
            # Create chapter from all frames
            chapter_id = str(uuid.uuid4())
            chapter = {
                'chapterId': chapter_id,
                'name': video_data.get('name', 'Main Chapter'),
                'frames': frames,
                'tapId': tap_id,
                'creatorId': user_id
            }
            
            # Create tap document
            # Use empty string for companyCode to make it available to all companies
            tap_data = {
                'name': video_data.get('name', 'Untitled Tap'),
                'fullName': video_data.get('fullName', video_data.get('name', 'Untitled Tap')),
                'description': video_data.get('description', ''),
                'thumbnail': video_data.get('thumbnail', ''),
                'chapters': [chapter],
                'topicId': topic_id,
                'companyCode': '',  # Empty string makes it available to all companies
                'creatorId': user_id,
                'createdAt': firestore.SERVER_TIMESTAMP
            }
            
            # Save to Firestore taps collection
            tap_ref = self._db.collection('taps').document(tap_id)
            tap_ref.set(tap_data)
            
            logger.info(f"Saved video as tap in Firestore: {tap_id}")
            return tap_id
            
        except Exception as e:
            logger.error(f"Error saving video as tap: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return None
    
    def _convert_quiz_to_question_frames(self, quiz_questions: List[Dict]) -> List[Dict]:
        """
        Convert quiz questions to QUESTION type frames for taps.
        
        Args:
            quiz_questions: List of quiz question dictionaries
            
        Returns:
            List of QUESTION frame dictionaries
        """
        question_frames = []
        
        for quiz in quiz_questions:
            frame_id = quiz.get('id') or str(uuid.uuid4())
            
            # Handle different quiz question formats
            if 'options' in quiz and isinstance(quiz['options'], dict):
                # Format from video_microlearning_generator (A, B, C, D options)
                options_dict = quiz['options']
                answers = []
                correct_answer_index = 0
                
                # Convert options dict to answers array
                option_labels = ['A', 'B', 'C', 'D']
                for idx, label in enumerate(option_labels):
                    if label in options_dict:
                        answers.append(options_dict[label])
                        # Check if this is the correct answer
                        if quiz.get('correct_answer') == label:
                            correct_answer_index = len(answers) - 1
                
                question_frame = {
                    'id': frame_id,
                    'createdAt': firestore.SERVER_TIMESTAMP,
                    'type': 'QUESTION',
                    'question': quiz.get('question', ''),
                    'description': quiz.get('description', ''),
                    'answers': answers,
                    'correctAnswer': correct_answer_index
                }
            elif 'answer' in quiz:
                # Format from microlearning_generator (simple Q&A)
                # Convert to multiple choice with the answer as option 0
                question_frame = {
                    'id': frame_id,
                    'createdAt': firestore.SERVER_TIMESTAMP,
                    'type': 'QUESTION',
                    'question': quiz.get('question', ''),
                    'description': quiz.get('description', ''),
                    'answers': [quiz.get('answer', '')],
                    'correctAnswer': 0
                }
            else:
                # Fallback: create a simple question frame
                question_frame = {
                    'id': frame_id,
                    'createdAt': firestore.SERVER_TIMESTAMP,
                    'type': 'QUESTION',
                    'question': quiz.get('question', ''),
                    'description': quiz.get('description', ''),
                    'answers': [],
                    'correctAnswer': 0
                }
            
            question_frames.append(question_frame)
        
        return question_frames
    
    def save_microlearning_as_tap(
        self,
        user_id: str,
        microlearning: Dict,
        topic_id: str,
        company_code: str = ""
    ) -> Optional[str]:
        """
        Save a text-based microlearning with quizzes as a tap in the taps collection.
        
        Note: Generated microlearning content is automatically made available to ALL companies
        by setting companyCode to an empty string.
        
        Args:
            user_id: User ID (creator ID)
            microlearning: Dictionary containing microlearning content with quiz_questions
            topic_id: Topic ID for the tap
            company_code: Company code (ignored - content is available to all companies)
        
        Returns:
            Tap document ID, or None if save failed
        
        Example microlearning structure:
        {
            'title': 'Learning Title',
            'description': 'Description',
            'content': 'Main content...',
            'quiz_questions': [
                {
                    'question': 'What is...?',
                    'answer': 'Correct answer'
                },
                ...
            ]
        }
        """
        try:
            if not self._db:
                logger.error("Firestore database not initialized")
                return None
            
            # Generate tap ID
            tap_id = microlearning.get('id') or str(uuid.uuid4())
            
            # Create frames from content and quiz questions
            frames = []
            
            # Add content as text frames (if needed) or combine into description
            # For now, we'll create QUESTION frames from quiz questions
            
            # Convert quiz questions to QUESTION frames
            if 'quiz_questions' in microlearning and isinstance(microlearning['quiz_questions'], list):
                question_frames = self._convert_quiz_to_question_frames(microlearning['quiz_questions'])
                frames.extend(question_frames)
            
            # If no frames were created, create at least one placeholder frame
            if not frames:
                # Create a simple text frame or question frame
                frames.append({
                    'id': str(uuid.uuid4()),
                    'createdAt': firestore.SERVER_TIMESTAMP,
                    'type': 'QUESTION',
                    'question': microlearning.get('title', 'Review Question'),
                    'description': microlearning.get('content', microlearning.get('summary', '')),
                    'answers': [],
                    'correctAnswer': 0
                })
            
            # Create chapter from frames
            chapter_id = str(uuid.uuid4())
            chapter = {
                'chapterId': chapter_id,
                'name': microlearning.get('title', 'Main Chapter'),
                'frames': frames,
                'tapId': tap_id,
                'creatorId': user_id
            }
            
            # Create tap document
            # Use empty string for companyCode to make it available to all companies
            tap_data = {
                'name': microlearning.get('title', 'Untitled Tap'),
                'fullName': microlearning.get('title', 'Untitled Tap'),
                'description': microlearning.get('description', microlearning.get('summary', '')),
                'thumbnail': microlearning.get('thumbnail', ''),
                'chapters': [chapter],
                'topicId': topic_id,
                'companyCode': '',  # Empty string makes it available to all companies
                'creatorId': user_id,
                'createdAt': firestore.SERVER_TIMESTAMP
            }
            
            # Save to Firestore taps collection
            tap_ref = self._db.collection('taps').document(tap_id)
            tap_ref.set(tap_data)
            
            logger.info(f"Saved microlearning as tap in Firestore: {tap_id}")
            return tap_id
            
        except Exception as e:
            logger.error(f"Error saving microlearning as tap: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return None


# Initialize service
firebase_service = FirebaseService()

