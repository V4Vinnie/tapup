import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { DB, storage } from '../firebaseConfig';
import { deleteObject, ref } from 'firebase/storage';

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
	return _userRef.data();
};

export const fetchUserWatchedFrame = async (frameID) => {
	const docRef = doc(DB, 'users', 'watchedFrames', frameID);
	const _watchedRef = await getDoc(docRef);
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

export const fetchFramesForCreator = async (tapId, topicId, creatorId) => {
	const framesCollec = collection(DB, `taps/${tapId}/topics/${topicId}/frames`);
	const framesQuery = query(framesCollec, where('creator', '==', creatorId));
	const frames = await getDocs(framesQuery);

	if (frames.empty) {
		return null;
	}
	let _frames = [];

	frames.forEach((created) => {
		_frames.push(created.data());
	});

	return _frames;
};

export const updateFrame = async (frameData) => {
	const _data = frameData;
	const docRef = doc(
		DB,
		'taps',
		_data.tapId,
		'topics',
		_data.topicId,
		'frames',
		_data.id
	);
	await setDoc(docRef, _data, { merge: true });
};

export const updateFrameContent = async (frameData) => {
	const docRef = doc(
		DB,
		'taps',
		frameData.tapId,
		'topics',
		frameData.topicId,
		'frames',
		frameData.id
	);
	await setDoc(docRef, frameData, { merge: true });
};

const deleteFrameContent = async (frameID, itemName) => {
	const desertRef = ref(storage, `frames/${frameID}/${itemName}`);
	await deleteObject(desertRef)
		.then(() => {
			console.log('DELETED');
		})
		.catch((error) => {
			console.log(error);
		});
};

export const deleteFrame = async (tapId, topicId, frameId, frameContent) => {
	const docRef = doc(DB, 'taps', tapId, 'topics', topicId, 'frames', frameId);
	await deleteDoc(docRef);
	if (frameContent) {
		for (let index = 0; index < frameContent.length; index++) {
			const element = frameContent[index];
			await deleteFrameContent(frameId, element.content);
		}
	}
};

export const fetchCreator = async (creatorID) => {
	const docRef = doc(DB, 'users', creatorID);
	let creatorName;
	const _userRef = await getDoc(docRef)
		.then(() => (creatorName = _userRef.data().name))
		.catch(() => (creatorName = undefined));
	return creatorName;
};

export const createNewQuestion = async (question) => {
	const docRef = doc(DB, 'questions', question.id);
	await setDoc(docRef, question);
};

export const fetchQuestionForUser = async (userId) => {
	const questionsCollec = collection(DB, `questions`);
	const questionsQuery = query(questionsCollec, where('askedBy', '==', userId));
	const questions = await getDocs(questionsQuery);

	if (questions.empty) {
		return null;
	}
	let _questions = [];

	questions.forEach((created) => {
		_questions.push(created.data());
	});

	return _questions;
};

export const fetchFrameById = async ({ tapId, topicId, id }) => {
	const docRef = doc(DB, `taps/${tapId}/topics/${topicId}/frames/`, id);
	const _frameData = await getDoc(docRef);
	return _frameData.data();
};

export const fetchQuestrionsAskedForUser = async (userId) => {
	const questionsCollec = collection(DB, `questions`);
	const questionsQuery = query(
		questionsCollec,
		where('creatorId', '==', userId)
	);
	const questions = await getDocs(questionsQuery);

	if (questions.empty) {
		return null;
	}
	let _questions = [];

	questions.forEach((created) => {
		_questions.push(created.data());
	});

	return _questions;
};
