import { initializeApp } from 'firebase/app';
import {
	getAuth,
	initializeAuth,
	getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { AsyncStorage } from 'react-native';

// Initialize Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyDfstOpxkX4OGYooHy67st7DI85Mq_WFTs',
	authDomain: 'tap-up.firebaseapp.com',
	projectId: 'tap-up',
	storageBucket: 'tap-up.appspot.com',
	messagingSenderId: '889175786342',
	appId: '1:889175786342:web:ff935007c2a7583cf27ea7',
	measurementId: 'G-3L1M6N023M',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const DB = getFirestore(app);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
