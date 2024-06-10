/* eslint-disable global-require */
import { STORAGE_KEY } from '@birdwingo/core/constants';
import { ProgressStorageProps } from '@birdwingo/core/dto/helpersDTO';
import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from 'firebase/firestore';
import { COLLECTIONS } from '../../utils/constants';
import { TProfile } from '../../types';
import { DB } from '../../database/Firebase';

export const clearProgressStorage = async () => {
	try {
		const AsyncStorage =
			require('@react-native-async-storage/async-storage').default;

		return AsyncStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		return null;
	}
};

export const getProgressStorage = async (
	userId: string
): Promise<ProgressStorageProps> => {
	try {
		const AsyncStorage =
			require('@react-native-async-storage/async-storage').default;

		const progress = await AsyncStorage.getItem(STORAGE_KEY);
		return progress ? JSON.parse(progress) : {};
	} catch (error) {
		return {};
	}
};

const getProgressStorageFromFirebase = async (
	userId: string
): Promise<ProgressStorageProps> => {
	try {
		const userRef = doc(DB, COLLECTIONS.USERS, userId);
		const userDoc = await getDoc(userRef);
		const profile = { ...userDoc.data(), uid: userDoc.id } as TProfile;
		console.log(
			'progress in getProgressStorageFromFirebase ',
			profile.progress
		);
		return profile.progress ?? {};
	} catch (error) {
		console.error('getProgressStorageFromFirebase ', error);
		return {};
	}
};

const setProgressStorageToFirebase = async (
	userId: string,
	progress: ProgressStorageProps
) => {
	try {
		const userRef = doc(DB, COLLECTIONS.USERS, userId);
		await updateDoc(userRef, { progress });
		console.log('progress in setProgressStorageToFirebase ', progress);
	} catch (error) {
		console.error('setProgressStorageToFirebase ', error);
	}
};

export const setProgressStorage = async (
	userId: string,
	chaperId: string,
	lastSeen: string
) => {
	const progress = await getProgressStorage(userId);
	progress[chaperId] = lastSeen;
	try {
		const AsyncStorage =
			require('@react-native-async-storage/async-storage').default;

		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
		await setProgressStorageToFirebase(userId, progress);

		return progress;
	} catch (error) {
		return {};
	}
};
