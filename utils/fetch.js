import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { DB } from '../firebaseConfig';

export const fetchTaps = async () => {
	const _allTabs = await getDocs(collection(DB, 'taps'));
	let allTabs = [];
	_allTabs.forEach(async (doc) => {
		allTabs.push(doc.data());
	});

	return allTabs;
};

export const fetchTopics = async (tapId) => {
	const _allTopics = await getDocs(collection(DB, `taps/${tapId}/topics`));
	let allTopics = [];
	_allTopics.forEach((doc) => {
		allTopics.push(doc.data());
	});

	return allTopics;
};

export const fetchFrames = async (tapId, topicId) => {
	const _allFrames = await getDocs(
		collection(DB, `taps/${tapId}/topics/${topicId}/frames`)
	);
	let allFrames = [];
	_allFrames.forEach(async (doc) => {
		let frame = { ...doc.data() };
		allFrames.push(frame);
	});

	return allFrames;
};

export const fetchUser = async (userId) => {
	const docRef = doc(DB, 'users', userId);
	const _userRef = await getDoc(docRef);
	console.log('fetchUser', _userRef.data());
	return _userRef.data();
};

export const fetchUserWatchedFrame = async (frameID) => {
	const docRef = doc(DB, 'users', 'watchedFrames', frameID);
	const _watchedRef = await getDoc(docRef);
	console.log('Watched', _watchedRef.data());
	return _watchedRef.data();
};

export const fetchUserAllWatched = async (userId) => {
	const _allFrames = await getDocs(
		collection(DB, `users/${userId}/watchedFrames`)
	);
	let allFrames = [];
	_allFrames.forEach(async (doc) => {
		let frame = { ...doc.data() };
		allFrames.push(frame);
	});

	return allFrames;
};

export const getWatchedFramesByTopicId = async (topicId, userId) => {
	const watchedRef = collection(DB, `users/${userId}/watchedFrames`);
	const watchedQuerry = query(watchedRef, where('topicId', '==', topicId));

	const watchedSnap = await getDocs(watchedQuerry);

	if (watchedSnap.empty) {
		return null;
	}
	let _watchedFrames = [];

	watchedSnap.forEach((watched) => {
		_watchedFrames.push(watched.data());
	});

	return _watchedFrames;
};

export const updateUser = async (user) => {
	const docRef = doc(DB, 'users', user.id);
	await setDoc(docRef, user, { merge: true });
};

export const updateWatchedFrames = async (userId, frameData) => {
	const docRef = doc(DB, 'users', userId, 'watchedFrames', frameData.id);
	await setDoc(docRef, frameData, { merge: true });
};
