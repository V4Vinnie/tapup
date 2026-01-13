# TapUp Database Schema Documentation

This document describes the Firebase Firestore database structure for the TapUp application.

## Collections

### 1. `users`

Stores user profile information.

**Document ID**: User UID (from Firebase Auth)

**Fields**:
```typescript
{
  uid: string;                    // User ID (same as document ID)
  name: string;                   // Username
  email: string;                  // User email
  role: 'USER' | 'ADMIN' | 'CREATOR';  // User role
  fullName: string;               // Full name
  companyInfo: {
    companyCode: string;          // Company code reference
    jobType: string;              // Job title/type
    companyRole?: 'EMPLOYER' | 'EMPLOYEE';  // Role in company
  };
  watchedChapters: string[];      // Array of completed chapter IDs
  progress: Record<string, number>;  // Progress per chapter {chapterId: frameIndex}
  topicSubscriptionIds?: string[];   // Subscribed topic IDs
  userSubscriptionIds?: string[];    // Following user IDs
  badges?: Array<{                 // User badges
    id: string;
    img: string;
    name: string;
  }>;
}
```

**Indexes Required**: None (queries use document ID)

**Security Rules**: 
- Read: Authenticated users can read any user
- Write: Users can only write their own document

---

### 2. `companies`

Stores company information.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  code: string;          // Unique company code
  name: string;          // Company name
  primaryColor: string;  // Primary brand color
  logo: string;          // Logo URL
}
```

**Indexes Required**: 
- `code` (for queries by company code)

**Security Rules**:
- Read: Authenticated users
- Write: Admins only

---

### 3. `topics`

Stores learning topics/categories.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  name: string;  // Topic name
}
```

**Indexes Required**: None (typically queried by ID)

**Security Rules**:
- Read: Authenticated users
- Write: Creators and Admins

---

### 4. `taps`

Stores learning content (taps).

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  name: string;              // Tap name
  fullName: string;          // Full display name
  description: string;       // Tap description
  thumbnail: string;         // Thumbnail image URL
  chapters: Array<{          // Learning chapters
    chapterId: string;
    name: string;
    frames: Array<{          // Story frames
      id: string;
      createdAt: Timestamp;
      type: 'PHOTO' | 'VIDEO' | 'QUESTION' | 'PHOTO_QUESTION';
      // Additional fields based on type
    }>;
    tapId: string;
    creatorId: string;
  }>;
  topicId: string;           // Reference to topic
  companyCode: string;       // Reference to company
  creatorId: string;         // User ID who created the tap
  createdAt: Timestamp;      // Creation timestamp
}
```

**Indexes Required**:
- `companyCode` + `createdAt` (for company taps queries)
- `topicId` + `createdAt` (for topic taps queries)
- `creatorId` + `createdAt` (for creator taps queries)
- `companyCode` + `topicId` + `createdAt` (compound query)

**Security Rules**:
- Read: Authenticated users
- Write: Creators and Admins (only creator can update their own taps)

---

## Storage Structure

### Firebase Storage

**Profile Pictures**: `users/{uid}/profilePicture.{ext}`

---

## Security Rules

Security rules are defined in `firestore.rules`. Key principles:

1. **Authentication Required**: Most operations require authentication
2. **User Ownership**: Users can only modify their own profiles
3. **Role-Based Access**: 
   - `ADMIN`: Full access to all collections
   - `CREATOR`: Can create/update taps and topics
   - `USER`: Read access, can update own profile

---

## Indexes

Indexes are defined in `firestore.indexes.json`. Required indexes:

1. **taps**: `companyCode` + `createdAt`
2. **taps**: `topicId` + `createdAt`
3. **taps**: `creatorId` + `createdAt`
4. **taps**: `companyCode` + `topicId` + `createdAt`
5. **companies**: `code`

---

## Migration Scripts

Use the migration script in `src/database/migrate.ts` to:

- Verify database structure
- Seed initial data (companies, topics)
- Run database migrations

**Usage**:
```bash
# With Firebase Admin SDK
npx ts-node src/database/migrate.ts

# With seed data
npx ts-node src/database/migrate.ts --seed
```

---

## Deployment

### Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

### Deploy Both
```bash
firebase deploy --only firestore
```

---

## Data Relationships

```
Company (code)
  └── Users (companyInfo.companyCode)
  └── Taps (companyCode)

Topic (id)
  └── Taps (topicId)

User (uid)
  ├── Taps created (creatorId)
  ├── Subscribed Topics (topicSubscriptionIds)
  └── Following Users (userSubscriptionIds)
```

---

## Notes

- All timestamps use Firestore `Timestamp` type
- Document IDs are typically auto-generated except for users (which use auth UID)
- Progress tracking uses chapter IDs as keys in the progress object
- Watched chapters are tracked as an array of chapter IDs

