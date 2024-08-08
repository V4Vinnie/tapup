import {
	UserCredential,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	updateEmail,
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
	//profileImage: string,
	company: TCompany | null,
	fullName: string,
	jobType: string
): Promise<TProfile> {
	return new Promise(async (resolve, reject) => {
		if (
			!name ||
			name.length < 2 ||
			!email ||
			!password ||
			//!profileImage ||
			!fullName ||
			!jobType
		) {
			reject(
				"Make sure to use a valid email and a password with at least 6 characters. Don't forget your profile picture!"
			);
			return;
		}
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email.toLowerCase(),
				password
			);
			if (!userCredential.user) {
				reject('Error creating user');
				return;
			}
			const userAuthId = userCredential.user.uid;
			//const url = await saveImage(profileImage, userAuthId);
			//if (!url) {
			//	reject('Error saving image');
			//	return;
			//}
			const profile: TProfile = {
				uid: userAuthId,
				name: name,
				//profilePic: url,
				email: email,
				role: 'USER',
				watchedChapters: [],
				progress: {},
				companyInfo: {
					companyCode: company?.code ?? '',
					jobType: jobType,
					companyRole: 'EMPLOYEE',
				},
				fullName,
			};
			setDoc(doc(DB, COLLECTIONS.USERS, userAuthId), profile).then(() => {
				resolve({ ...userCredential.user, ...profile });
			});
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
}

export async function saveImage(image: string, uid: string) {
    try {
        if (!image) {
            throw new Error('Image URI is null or undefined');
        }

        const fileInfo = await FileSystem.getInfoAsync(image);
        if (!fileInfo.exists) {
            throw new Error('Image file does not exist');
        }

        const response = await fetch(image);
        const blob = await response.blob();

        if (!blob) {
            throw new Error('Failed to create blob from image');
        }

        const extension = image.split('.').pop() || 'jpg';
        const imageRef = ref(storage, STORE_PROFILE_IMAGE(uid, extension));
        await uploadBytes(imageRef, blob);
        return getDownloadURL(imageRef);
    } catch (error) {
        console.error('saveImage in UserService ', error);
        throw error;
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

export async function updateUser<K extends keyof TProfile>(
	userid: string,
	key: K,
	value: TProfile[K]
) {
	if (key === 'email') {
		try {
			await updateEmail(auth.currentUser!, value as string);
			return await updateDoc(doc(DB, COLLECTIONS.USERS, userid), {
				[key]: value,
			});
		} catch (message) {
			return console.error(message);
		}
	} else {
		return updateDoc(doc(DB, COLLECTIONS.USERS, userid), {
			[key]: value,
		});
	}
}

export async function changeProfilePicture(image: string, uid: string) {
	try {
		const url = await saveImage(image, uid);
		updateDoc(doc(DB, COLLECTIONS.USERS, uid), {
			profilePic: url,
		});
		return url;
	} catch (error) {
		console.error('changeProfilePicture in UserService ', error);
	}
}

export async function setCompanyCodeInProfile(
	user: TProfile,
	companyCode: string
) {
	try {
		updateDoc(doc(DB, COLLECTIONS.USERS, user.uid), {
			companyInfo: {
				companyCode,
				jobType: user.companyInfo.jobType ?? '',
				companyRole: user.companyInfo.companyRole,
			},
		});
	} catch (error) {
		console.error('setCompanyCodeInProfile in UserService ', error);
	}
}