# Database Setup and Migration Guide

This guide explains how to set up and migrate the Firebase Firestore database for the TapUp project.

## Prerequisites

1. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Project** created at [Firebase Console](https://console.firebase.google.com/)

3. **Login to Firebase**:
   ```bash
   firebase login
   ```

4. **Initialize Firebase in your project** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Use existing `firestore.rules` file (yes)
   - Use existing `firestore.indexes.json` file (yes)

## Files Created

1. **`firestore.rules`** - Security rules for Firestore
2. **`firestore.indexes.json`** - Indexes configuration
3. **`storage.rules`** - Security rules for Firebase Storage
4. **`firebase.json`** - Firebase CLI configuration
5. **`src/database/migrate.ts`** - Migration script (optional, requires Firebase Admin SDK)
6. **`DATABASE.md`** - Database schema documentation

## Deployment Steps

### 1. Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

### 2. Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

**Note**: Indexes may take several minutes to build. You can check the status in the [Firebase Console](https://console.firebase.google.com/project/_/firestore/indexes).

### 3. Deploy Both Rules and Indexes

```bash
firebase deploy --only firestore
```

### 4. Deploy Storage Rules (Optional)

```bash
firebase deploy --only storage
```

## Using the Migration Script (Optional)

The migration script (`src/database/migrate.ts`) requires Firebase Admin SDK and is useful for:
- Seeding initial data (companies, topics)
- Verifying database structure
- Running data migrations

### Setup for Migration Script

1. **Install Firebase Admin SDK** (if using the script):
   ```bash
   npm install firebase-admin
   ```

2. **Get Service Account Key**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely (add to `.gitignore`)

3. **Set Environment Variable**:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
   ```

4. **Run Migration**:
   ```bash
   npx ts-node src/database/migrate.ts
   ```
   
   With seed data:
   ```bash
   npx ts-node src/database/migrate.ts --seed
   ```

**Note**: The migration script is optional. Most projects can work with just security rules and indexes deployed via Firebase CLI.

## Database Structure

The database uses 4 main collections:

1. **`users`** - User profiles
2. **`companies`** - Company information
3. **`topics`** - Learning topics/categories
4. **`taps`** - Learning content (taps)

See `DATABASE.md` for detailed schema documentation.

## Security Rules Overview

- **Users**: Can read any user, but only modify their own profile
- **Companies**: Read access for authenticated users, write access for admins only
- **Topics**: Read access for authenticated users, write access for creators/admins
- **Taps**: Read access for authenticated users, write access for creators/admins

See `firestore.rules` for complete rules.

## Indexes

The following indexes are required for optimal query performance:

- `taps`: `companyCode` + `createdAt`
- `taps`: `topicId` + `createdAt`
- `taps`: `creatorId` + `createdAt`
- `taps`: `companyCode` + `topicId` + `createdAt`
- `companies`: `code`

All indexes are automatically created when you deploy `firestore.indexes.json`.

## Troubleshooting

### Index Build Fails

If index deployment fails:
1. Check Firebase Console for error messages
2. Ensure all referenced fields exist in your documents
3. Wait for indexes to build (can take 5-10 minutes)

### Security Rules Errors

If rules deployment fails:
1. Validate rules syntax: `firebase deploy --only firestore:rules --debug`
2. Test rules in Firebase Console → Firestore → Rules (simulator)

### Permission Denied Errors

If you get permission denied errors:
1. Verify user is authenticated
2. Check user role (ADMIN, CREATOR, USER)
3. Review security rules match the request

## Next Steps

1. Deploy security rules and indexes
2. Test your app with the new rules
3. Monitor Firebase Console for any errors
4. Adjust rules as needed based on your requirements

For more details, see `DATABASE.md`.

