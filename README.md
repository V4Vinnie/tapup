# TapUp - Microlearning Platform

A complete micro-learning platform that offers next-gen educational content designed for fast consumption. This monorepo contains both the React Native mobile app and the Python Flask backend for video generation and content processing.

## 🚀 Features

### Mobile App (React Native/Expo)
- **Swipe-based Learning**: Consume bite-sized educational content
- **Progress Tracking**: Track your learning progress across taps and chapters
- **Company-based Content**: Access company-specific and public learning content
- **Topic Subscriptions**: Follow topics you're interested in
- **User Profiles**: Manage your profile, badges, and subscriptions

### Backend Service (Python Flask)
- **Video Generation**: Create microlearning videos from YouTube URLs
- **Content Processing**: Generate microlearning modules from text or URLs
- **AI-Powered**: Uses Gemini AI for content summarization and quiz generation
- **Firebase Integration**: Saves generated content as taps in Firestore
- **REST API**: Endpoints for creating and managing microlearning content

## 📁 Project Structure

```
tapUp/
├── backend/              # Python Flask backend service
│   ├── app.py           # Flask application
│   ├── firebase_service.py  # Firebase integration
│   ├── video_microlearning_generator.py  # Video processing
│   ├── microlearning_generator.py  # Text content processing
│   ├── requirements.txt # Python dependencies
│   ├── Dockerfile       # Docker configuration
│   ├── railway.json     # Railway deployment config
│   └── ...
├── src/                 # React Native mobile app
│   ├── components/      # React components
│   ├── screens/         # App screens
│   ├── navigation/     # Navigation setup
│   ├── database/       # Firebase client setup
│   └── ...
├── firebase.json        # Firebase configuration (shared)
├── firestore.rules      # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
├── storage.rules        # Storage security rules
└── package.json         # Node.js dependencies (mobile app)
```

## 🛠️ Setup

### Prerequisites

- **Node.js** and **npm** (for mobile app)
- **Python 3.11+** (for backend)
- **Firebase project** (shared between both)
- **Java 18** (for Android development - see requirements below)

### Mobile App Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file** with Firebase configuration:
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

3. **Run on Android**:
   ```bash
   npm run android
   ```

4. **Run on iOS**:
   ```bash
   npm run ios
   ```

**Note**: This is Expo Dev Client (NOT Expo Go), so you need an Android Emulator from Android Studio.

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (`.env` in project root):
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   SECRET_KEY=your_secret_key
   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   ```

5. **Run Flask server**:
   ```bash
   python app.py
   ```

## 📱 Mobile App Requirements

### Java Setup (for Android)

**Windows**:
1. Search for "Environment variables" in search bar
2. Select "Environment variables"
3. Create a new variable called "JAVA_HOME" for both User and System variables
   - Value: `C:\Program Files\Zulu\zulu-18` (or your Java installation)
4. Under System variables, edit Path and add: `C:\Program Files\Zulu\zulu-18\bin`
5. Restart your CMD

**macOS**: Java should be available via Homebrew or download from [Azul](https://www.azul.com/downloads/?version=java-16-sts&show-old-builds=true#zulu)

## 🔥 Firebase Setup

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed Firebase configuration.

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Create a Firestore database
4. Enable Firebase Storage (for video uploads)
5. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage:rules
   ```

## 🚢 Deployment

### Backend Deployment (Railway)

See [backend/RAILWAY_DEPLOYMENT.md](backend/RAILWAY_DEPLOYMENT.md) for detailed instructions.

1. **Via Railway Dashboard**:
   - Go to [railway.app](https://railway.app)
   - Create new project → Deploy from GitHub
   - Select repository and set root directory to `backend/`
   - Add environment variables
   - Deploy!

2. **Via Railway CLI**:
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

### Mobile App Deployment

Build and deploy via Expo EAS:
```bash
eas build --platform android
eas build --platform ios
```

## 📚 API Endpoints

### Backend API

- `POST /api/user/create-microlearning` - Create text-based microlearning
- `POST /api/user/from-youtube` - Generate video microlearning from YouTube URL
- `POST /api/user/save-as-tap` - Save generated content as tap in Firestore
- `GET /api/health` - Health check endpoint

## 🗄️ Database Structure

The app uses Firebase Firestore with these collections:

- **users** - User profiles and progress
- **companies** - Company information
- **topics** - Learning topics/categories
- **taps** - Learning content (where generated videos are stored)

See [DATABASE.md](DATABASE.md) for detailed schema documentation.

## 🔧 Troubleshooting

### Mobile App
- `java -version` not working: Restart CMD/terminal and code editor
- Build errors: Ensure all dependencies are installed with `npm install`
- Firebase errors: Verify `.env` file has correct Firebase credentials

### Backend
- Import errors: Ensure virtual environment is activated
- Firebase errors: Check service account credentials
- Video processing fails: Verify FFmpeg is installed (included in Dockerfile)

## 📖 Documentation

- [DATABASE.md](DATABASE.md) - Database schema documentation
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Firebase setup guide
- [README_MERGED.md](README_MERGED.md) - Detailed monorepo documentation
- [backend/RAILWAY_DEPLOYMENT.md](backend/RAILWAY_DEPLOYMENT.md) - Railway deployment guide
- [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md) - General deployment options

## 📝 License

MIT License

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- Repository: https://github.com/V4Vinnie/tapup
- Firebase Console: https://console.firebase.google.com/project/tap-up-1a65a
