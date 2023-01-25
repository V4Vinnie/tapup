import { doc, setDoc } from 'firebase/firestore';
import { DB } from '../firebaseConfig';

export const setUser = async (userData, userId) => {
	const userRef = doc(DB, 'users', userId);
	await setDoc(userRef, userData, { merge: true });
};
