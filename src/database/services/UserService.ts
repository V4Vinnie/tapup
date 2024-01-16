import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { DB, auth } from '../Firebase';
import { COLLECTIONS } from '../../utils/constants';
import { TUser } from '../../types';

export async function loginUser(email: string, password: string) {
	return new Promise(async (resolve, reject) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			resolve(userCredential);
		} catch (error) {
			reject(error);
		}
	});
}

export async function registerUser(
	name: string,
	email: string,
	password: string
) {
	return new Promise(async (resolve, reject) => {
		if (name == '' || name.length < 2 || email == '' || password == '') {
			reject('Please fill all the fields');
			return;
		}
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await updateProfile(userCredential.user, {
				displayName: name,
			});
			await setDoc(doc(DB, COLLECTIONS.USERS, userCredential.user.uid), {
				name: name,
				email: email,
			});
			resolve(userCredential);
		} catch (error) {
			reject(error);
		}
	});
}

export async function sendForgotPasswordEmail(email: string) {
	return sendPasswordResetEmail(auth, email);
}

export async function getUser(id: string) {
	try {
		const user = await getDoc(doc(DB, COLLECTIONS.USERS, id));
		return user.data() as TUser;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export function onUser(userId: string, callback: (user: TUser) => void) {
	const userRef = doc(DB, COLLECTIONS.USERS, userId);
	return onSnapshot(userRef, (userDoc) => {
		callback(userDoc.data() as TUser);
	});
}
