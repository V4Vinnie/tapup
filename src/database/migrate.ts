/**
 * Database Migration Script for TapUp Firebase Firestore
 * 
 * This script helps initialize and migrate data to Firebase Firestore.
 * Run this script using Node.js with Firebase Admin SDK or through Firebase CLI.
 * 
 * Usage:
 *   - For Node.js: npx ts-node src/database/migrate.ts
 *   - For Firebase CLI: firebase deploy --only firestore
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { COLLECTIONS } from '../utils/constants';
import { TCompany, TTopic } from '../types';

// Initialize Firebase Admin (requires service account key)
// For local development, set GOOGLE_APPLICATION_CREDENTIALS environment variable
// or use applicationDefault() credentials
let db: FirebaseFirestore.Firestore;

try {
  if (getApps().length === 0) {
    initializeApp({
      // Uncomment and configure if using service account
      // credential: cert(require('path/to/serviceAccountKey.json'))
    });
  }
  db = getFirestore();
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  console.log('Note: This script requires Firebase Admin SDK.');
  console.log('For client-side migrations, use the client SDK functions instead.');
  process.exit(1);
}

/**
 * Seed initial companies
 */
export async function seedCompanies(companies: TCompany[]): Promise<void> {
  console.log('Seeding companies...');
  const batch = db.batch();
  
  for (const company of companies) {
    const companyRef = db.collection(COLLECTIONS.COMPANIES).doc();
    batch.set(companyRef, company);
  }
  
  await batch.commit();
  console.log(`✓ Seeded ${companies.length} companies`);
}

/**
 * Seed initial topics
 */
export async function seedTopics(topics: Omit<TTopic, 'id'>[]): Promise<void> {
  console.log('Seeding topics...');
  const batch = db.batch();
  
  for (const topic of topics) {
    const topicRef = db.collection(COLLECTIONS.TOPICS).doc();
    batch.set(topicRef, topic);
  }
  
  await batch.commit();
  console.log(`✓ Seeded ${topics.length} topics`);
}

/**
 * Verify database structure
 */
export async function verifyDatabaseStructure(): Promise<void> {
  console.log('Verifying database structure...');
  
  const collections = [COLLECTIONS.USERS, COLLECTIONS.TAPS, COLLECTIONS.TOPICS, COLLECTIONS.COMPANIES];
  
  for (const collectionName of collections) {
    try {
      const snapshot = await db.collection(collectionName).limit(1).get();
      console.log(`✓ Collection '${collectionName}' exists (${snapshot.size} documents)`);
    } catch (error) {
      console.error(`✗ Collection '${collectionName}' error:`, error);
    }
  }
}

/**
 * Example seed data
 */
const exampleCompanies: TCompany[] = [
  {
    code: 'DEMO001',
    name: 'Demo Company',
    primaryColor: '#ff197c',
    logo: 'https://example.com/logo.png',
  },
];

const exampleTopics: Omit<TTopic, 'id'>[] = [
  {
    name: 'Technology',
  },
  {
    name: 'Business',
  },
  {
    name: 'Design',
  },
];

/**
 * Main migration function
 */
export async function runMigration(seedData: boolean = false): Promise<void> {
  console.log('🚀 Starting database migration...\n');
  
  try {
    // Verify structure
    await verifyDatabaseStructure();
    
    // Seed data if requested
    if (seedData) {
      console.log('\n📦 Seeding initial data...');
      await seedCompanies(exampleCompanies);
      await seedTopics(exampleTopics);
    }
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  const seedData = process.argv.includes('--seed');
  runMigration(seedData)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

