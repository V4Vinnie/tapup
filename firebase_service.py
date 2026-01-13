"""
Firebase Service for User Management and Data Storage
"""

import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from typing import Optional, Dict, List
from dotenv import load_dotenv
import json

load_dotenv()


class FirebaseService:
    """Service for interacting with Firebase"""
    
    _instance = None
    _db = None
    
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
                # Option 1: Use service account file
                service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
                if service_account_path and os.path.exists(service_account_path):
                    cred = credentials.Certificate(service_account_path)
                    firebase_admin.initialize_app(cred)
                else:
                    # Option 2: Use environment variables
                    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
                    if service_account_json:
                        cred_dict = json.loads(service_account_json)
                        cred = credentials.Certificate(cred_dict)
                        firebase_admin.initialize_app(cred)
                    else:
                        # Option 3: Default credentials (for GCP environments)
                        firebase_admin.initialize_app()
            
            self._db = firestore.client()
        except Exception as e:
            print(f"Warning: Firebase Admin SDK initialization failed: {e}")
            print("Firebase Admin features will be limited. Client-side auth will still work.")
    
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


# Initialize service
firebase_service = FirebaseService()

