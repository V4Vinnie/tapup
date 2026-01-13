# TapUp - Monorepo

This is a monorepo containing both the mobile app (React Native/Expo) and the backend service (Python Flask) for the TapUp microlearning platform.

## Project Structure

```
tapUp/
├── backend/              # Python Flask backend service
│   ├── app.py           # Flask application
│   ├── firebase_service.py  # Firebase integration
│   ├── requirements.txt # Python dependencies
│   ├── templates/       # HTML templates
│   ├── static/          # Static assets
│   ├── output/          # Generated video outputs
│   └── ...
├── src/                 # React Native mobile app
│   ├── components/      # React components
│   ├── screens/         # App screens
│   ├── navigation/     # Navigation setup
│   ├── database/       # Firebase client setup
│   └── ...
├── firebase.json        # Firebase configuration (shared)
├── firestore.rules      # Firestore security rules (shared)
├── firestore.indexes.json  # Firestore indexes (shared)
├── storage.rules        # Storage security rules (shared)
├── package.json         # Node.js dependencies (mobile app)
└── .env                 # Environment variables (shared)
```

## Mobile App (Frontend)

The React Native/Expo mobile application for consuming microlearning content.

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with Firebase configuration:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_DATABASE_URL=your_database_url
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. Run on Android:
   ```bash
   npm run android
   ```

4. Run on iOS:
   ```bash
   npm run ios
   ```

See the main [README.md](README.md) for more details.

## Backend Service

The Python Flask backend service for generating video microlearning content from YouTube videos and other sources.

### Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Ensure `.env` file exists in the project root with:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_SERVICE_ACCOUNT_PATH=path/to/serviceAccountKey.json
   # OR
   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   GEMINI_API_KEY=your_gemini_api_key
   SECRET_KEY=your_secret_key
   ```

5. Run the Flask server:
   ```bash
   python app.py
   # Or with gunicorn for production:
   gunicorn app:app
   ```

### Backend Features

- **Video Generation**: Create microlearning content from YouTube videos
- **Content Processing**: Extract and process video content using AI
- **Firebase Integration**: Save generated videos as "taps" in Firestore
- **REST API**: Endpoints for creating microlearning content

### API Endpoints

- `POST /api/user/create-microlearning` - Create text-based microlearning
- `POST /api/user/from-youtube` - Generate video microlearning from YouTube URL
- `POST /api/user/save-as-tap` - Save generated video as a tap in Firestore

## Firebase Configuration

Both projects share the same Firebase project and database. The Firebase configuration files are at the root level:

- `firebase.json` - Firebase CLI configuration
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore indexes
- `storage.rules` - Firebase Storage rules

### Deploy Firebase Rules

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage

# Deploy everything
firebase deploy
```

## Database Structure

The app uses Firebase Firestore with the following collections:

- **users** - User profiles
- **companies** - Company information
- **topics** - Learning topics/categories
- **taps** - Learning content (where generated videos are stored)

See [DATABASE.md](DATABASE.md) for detailed schema documentation.

## Development Workflow

1. **Mobile App Development**: Work in the root directory, use `npm run android` or `npm run ios`
2. **Backend Development**: Work in the `backend/` directory, use `python app.py`
3. **Shared Configuration**: Firebase configs and `.env` are at the root level
4. **Database Changes**: Update `firestore.rules` and `firestore.indexes.json` at root, then deploy

## Environment Variables

Create a `.env` file in the project root with all required variables. Both the mobile app and backend will read from this file.

## Notes

- The backend saves generated videos to the `taps` collection in Firestore
- Videos are uploaded to Firebase Storage under `videos/{userId}/{tapId}/`
- The mobile app reads taps from Firestore and displays them to users
- Both projects use the same Firebase project for authentication and data storage
