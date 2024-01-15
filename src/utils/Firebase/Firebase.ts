// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDfstOpxkX4OGYooHy67st7DI85Mq_WFTs',
	authDomain: 'tap-up.firebaseapp.com',
	projectId: 'tap-up',
	storageBucket: 'tap-up.appspot.com',
	messagingSenderId: '889175786342',
	appId: '1:889175786342:web:ff935007c2a7583cf27ea7',
	measurementId: 'G-3L1M6N023M',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});

export const storage = getStorage(app);

export const DB = getFirestore(app);
