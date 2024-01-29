import {
	UserCredential,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { DB, auth } from '../Firebase';
import { COLLECTIONS } from '../../utils/constants';
import { TUser } from '../../types';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../Firebase';
import * as FileSystem from 'expo-file-system';

const STORE_PROFILE_IMAGE = (uid: string, extention: string) => `users/${uid}/profilePicture.${extention}`

export async function loginUser(
	email: string,
	password: string
): Promise<UserCredential> {
	return new Promise(async (resolve, reject) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email.toLowerCase(),
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
	password: string,
	profileImage?: string
): Promise<UserCredential> {
	return new Promise(async (resolve, reject) => {
		if (name == '' || name.length < 2 || email == '' || password == '') {
			reject('Please fill all the fields');
			return;
		}
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email.toLowerCase(),
				password
			);
			const url = profileImage ? await saveImage(profileImage, userCredential.user.uid) : '';
			await setDoc(doc(DB, COLLECTIONS.USERS, userCredential.user.uid), {
				name: name,
				profilePic: url,
				email: email,
				role: 'USER',

				watchedFrames: [],
			});
			resolve(userCredential);
		} catch (error) {
			reject(error);
		}
	});
}

export async function saveImage(image: string, uid: string) {
	try {
		const {uri} = await FileSystem.getInfoAsync(image)
			const blob: Blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function() {
				  resolve(xhr.response);
				};
				xhr.onerror = function() {
				  reject(new TypeError('Network request failed'));
				};
				xhr.responseType = 'blob';
				xhr.open('GET', uri, true);
				xhr.send(null);
			  });
			const extention = image.split('.')[image.split('.').length - 1];
			const imageRef = ref(storage, STORE_PROFILE_IMAGE(uid, extention));
			await uploadBytes(imageRef, blob);
			return getDownloadURL(imageRef);
	} catch (error) {
		console.error('saveImage in UserService ', error);
	}
}

export async function sendForgotPasswordEmail(email: string) {
	return sendPasswordResetEmail(auth, email);
}

export async function getUser(uid: string) {
	try {
		const user = await getDoc(doc(DB, COLLECTIONS.USERS, uid));
		return user.data() as TUser;
	} catch (error) {
		console.error('getUser in UserService ', error);
		return null;
	}
}

export function onUser(userId: string, callback: (user: TUser) => void) {
	try {
		const userRef = doc(DB, COLLECTIONS.USERS, userId);
		return onSnapshot(userRef, (userDoc) => {
			callback({ ...userDoc.data(), uid: userDoc.id } as TUser);
		});
	} catch (error) {
		console.error('onUser in UserService ', error);
	}
}
