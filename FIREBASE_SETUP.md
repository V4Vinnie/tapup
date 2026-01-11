# Firebase Setup Guide

This guide will help you set up Firebase for the TapUp microlearning platform.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard
4. Enable Google Analytics (optional)

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** authentication method
4. Save the changes

## 3. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development) or set up security rules
4. Select a location for your database
5. Click "Enable"

### Firestore Security Rules

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own microlearnings
    match /microlearnings/{microlearningId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

## 4. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "TapUp Web")
5. Copy the Firebase configuration object

## 5. Set Up Environment Variables

Create a `.env` file in the project root:

```env
# Firebase Web App Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Optional: Firebase Admin SDK (for server-side operations)
# Option 1: Path to service account JSON file
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/serviceAccountKey.json

# Option 2: Service account JSON as string (for deployment)
# FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Flask Secret Key
SECRET_KEY=your-secret-key-here-change-in-production

# OpenAI API Key (for microlearning generation)
OPENAI_API_KEY=your_openai_api_key_here
```

## 6. (Optional) Set Up Firebase Admin SDK

For server-side operations (not required for basic functionality):

1. In Firebase Console, go to **Project Settings**
2. Go to **Service Accounts** tab
3. Click "Generate new private key"
4. Save the JSON file securely
5. Set `FIREBASE_SERVICE_ACCOUNT_PATH` in your `.env` file

**Important:** Never commit the service account key to version control!

## 7. Test the Setup

1. Start the Flask application:
   ```bash
   python app.py
   ```

2. Visit `http://localhost:5000`

3. Try registering a new user

4. Check Firebase Console:
   - **Authentication** → Users: Should show your new user
   - **Firestore Database** → `users` collection: Should have a user document

## Troubleshooting

### "Firebase config not provided" warning
- Make sure your `.env` file is in the project root
- Check that all Firebase config variables are set
- Restart the Flask application after updating `.env`

### Authentication errors
- Verify Email/Password authentication is enabled in Firebase Console
- Check that your Firebase config is correct
- Check browser console for detailed error messages

### Firestore permission errors
- Update Firestore security rules (see step 3)
- For development, you can use test mode (less secure)

## Production Checklist

- [ ] Set up proper Firestore security rules
- [ ] Change `SECRET_KEY` to a secure random string
- [ ] Use environment-specific Firebase projects (dev/staging/prod)
- [ ] Set up Firebase Hosting (optional) for static assets
- [ ] Configure CORS properly for your domain
- [ ] Set up Firebase App Check for additional security
- [ ] Enable rate limiting on Firebase Authentication

