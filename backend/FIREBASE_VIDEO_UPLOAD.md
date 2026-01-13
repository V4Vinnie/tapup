# Firebase Video Upload Implementation

## Overview

The code has been updated to upload generated microlearning videos to Firebase Storage in a structure compatible with the Storythingbe/tapUp project.

## Structure

### Firebase Storage Path Structure
```
videos/
  {userId}/
    {microlearningId}/
      clips/
        {clipNumber}_{filename}.mp4
```

Example:
```
videos/
  abc123/
    ml_xyz789/
      clips/
        1_clip_001.mp4
        2_clip_002.mp4
        3_clip_003.mp4
```

### Firestore Document Structure

The microlearning document in Firestore includes:
```json
{
  "id": "ml_xyz789",
  "user_id": "abc123",
  "title": "Video Title",
  "type": "video",
  "clips": [
    {
      "clip_number": 1,
      "video_file": "clip_001.mp4",
      "video_url": "https://firebasestorage.googleapis.com/...",
      "video_storage_path": "videos/abc123/ml_xyz789/clips/1_clip_001.mp4",
      "start_time": 0.0,
      "end_time": 30.0,
      "duration": 30.0,
      "description": "Clip description"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  ...
}
```

## Implementation Details

### 1. Firebase Service Updates (`firebase_service.py`)

Added two new methods:

#### `upload_video_to_storage()`
- Uploads a single video file to Firebase Storage
- Creates public URLs for video access
- Structures paths according to Storythingbe/tapUp format

#### `save_video_microlearning()`
- Uploads all video clips to Firebase Storage
- Saves microlearning metadata to Firestore
- Updates clip objects with Firebase Storage URLs

### 2. API Endpoint Updates (`app.py`)

The `/api/user/from-youtube` endpoint now:
1. Generates video microlearning
2. Uploads all video clips to Firebase Storage
3. Saves complete microlearning to Firestore
4. Returns microlearning with Firebase Storage URLs

## Configuration

### Required Environment Variables

```bash
# Firebase Storage
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Firebase Service Account (for Admin SDK)
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json
# OR
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
```

### Firebase Storage Security Rules

Update your Firebase Storage rules to allow authenticated uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload videos
    match /videos/{userId}/{microlearningId}/{allPaths=**} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Usage

### Automatic Upload

When a video microlearning is created via `/api/user/from-youtube`, videos are automatically:
1. Generated locally in the `output/` directory
2. Uploaded to Firebase Storage
3. Saved to Firestore with Firebase URLs

### Manual Upload

You can also manually upload videos:

```python
from firebase_service import firebase_service

# Upload a single clip
video_url = firebase_service.upload_video_to_storage(
    local_file_path="/path/to/clip.mp4",
    user_id="user123",
    microlearning_id="ml456",
    clip_number=1
)

# Save complete video microlearning
microlearning_id = firebase_service.save_video_microlearning(
    user_id="user123",
    microlearning=microlearning_dict,
    video_clips_dir="/path/to/output"
)
```

## Benefits

1. **Centralized Storage**: Videos stored in Firebase Storage instead of local filesystem
2. **Public URLs**: Videos accessible via public URLs
3. **Scalable**: Firebase Storage handles large files and high traffic
4. **Compatible**: Structure matches Storythingbe/tapUp project
5. **Organized**: Videos organized by user and microlearning ID

## Error Handling

- If Firebase Storage upload fails, the system falls back to local file paths
- Errors are logged but don't prevent microlearning creation
- Videos are still accessible via `/static/videos/` endpoint as fallback

## Next Steps

1. Configure `FIREBASE_STORAGE_BUCKET` in your environment
2. Set up Firebase Storage security rules
3. Test video upload with a sample YouTube URL
4. Verify videos are accessible via Firebase Storage URLs
