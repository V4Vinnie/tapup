import {
	UserCredential,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { DB, auth } from '../Firebase';
import { COLLECTIONS } from '../../utils/constants';
import { TCompany, TProfile } from '../../types';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../Firebase';
import * as FileSystem from 'expo-file-system';
import { addFirebaseSubscription } from '../../utils/firebaseSubscriptions';

const STORE_PROFILE_IMAGE = (uid: string, extention: string) =>
	`users/${uid}/profilePicture.${extention}`;

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
	profileImage: string,
	company: TCompany,
	fullName: string,
	jobType: string
): Promise<UserCredential> {
	return new Promise(async (resolve, reject) => {
		if (
			!name ||
			name.length < 2 ||
			!email ||
			!password ||
			!profileImage ||
			!company ||
			!fullName ||
			!jobType
		) {
			reject('Please fill all the fields');
			return;
		}
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email.toLowerCase(),
				password
			);
			const userAuthId = userCredential.user.uid;
			const url = profileImage
				? await saveImage(profileImage, userAuthId)
				: '';
			setDoc(doc(DB, COLLECTIONS.USERS, userAuthId), {
				uid: userAuthId,
				name: name,
				profilePic: url,
				email: email,
				role: 'USER',
				watchedFrames: [],
				progress: {},
				companyInfo: {
					companyCode: company.code,
					jobType: jobType,
				},
				fullName,
			} as TProfile).then(() => {
				resolve(userCredential);
			});
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
}

export async function saveImage(image: string, uid: string) {
	try {
		const { uri } = await FileSystem.getInfoAsync(image);
		const blob: Blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function () {
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

export async function getProfile(uid: string) {
	try {
		const user = await getDoc(doc(DB, COLLECTIONS.USERS, uid));
		return user.data() as TProfile;
	} catch (error) {
		console.error('getProfile in UserService ', error);
		return null;
	}
}

export function onUser(userId: string, callback: (user: TProfile) => void) {
	try {
		const userRef = doc(DB, COLLECTIONS.USERS, userId);
		const sub = onSnapshot(userRef, (userDoc) => {
			callback({ ...userDoc.data(), uid: userDoc.id } as TProfile);
		});
		addFirebaseSubscription(sub);
		return sub;
	} catch (error) {
		console.error('onUser in UserService ', error);
	}
}

export function updateUser<K extends keyof TProfile>(
	userid: string,
	key: K,
	value: TProfile[K]
) {
	return updateDoc(doc(DB, COLLECTIONS.USERS, userid), {
		[key]: value,
	});
}
