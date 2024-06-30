import {
	TChapter,
	TContinueWatchingTap,
	TProfile,
	TTap,
	TTopic,
} from '../../types';
import { getProfile } from './UserService';
import {
	collection,
	doc,
	documentId,
	getDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { DB } from '../Firebase';
import { COLLECTIONS } from '../../utils/constants';

export const getAllTaps = async () => {
	try {
		const tapsRef = collection(DB, COLLECTIONS.TAPS);
		const allTaps = await getDocs(tapsRef);
		return allTaps.docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data(),
			} as TTap;
		});
	} catch (error) {
		console.log('getTaps in TapService ', error);
	}
};

export const getProfileDiscoverTaps = async (user: TProfile) => {
	// taps that user doesn't have in their continue watching list
	try {
		const tapsRef = collection(DB, COLLECTIONS.TAPS);
		const watchedTapIds = user.watchedFrames.map((frame) => frame.tapId);
		if (watchedTapIds.length === 0) {
			const allTaps = await getDocs(tapsRef);
			return allTaps.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data(),
				} as TTap;
			});
		} else {
			const _query = query(
				tapsRef,
				where(documentId(), 'not-in', watchedTapIds)
			);
			const discoverTapsSnapshot = await getDocs(_query);
			return discoverTapsSnapshot.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data(),
				} as TTap;
			});
		}
	} catch (error) {
		console.log('getTaps in TapService ', error);
	}
};

export const getTapsWithProgressForUser = async (user: TProfile) => {
	try {
		const userData =
			user.watchedFrames?.length === 0
				? await getProfile(user.uid)
				: user;
		if (!userData) throw new Error('User not found');

		const watchedTaps = await getWatchedTapsForUser(userData);

		// Get tap with progress
		return watchedTaps.map((tap) => {
			const framesWatched = userData.watchedFrames.filter(
				(frame) => frame.tapId === tap.id
			);
			const amountOfTapFrames = tap.chapters.reduce(
				(total: number, chapter: TChapter) =>
					total + chapter.frames.length,
				0
			);
			const progress = (framesWatched.length / amountOfTapFrames) * 100;

			return {
				...tap,
				progress,
			} as TContinueWatchingTap;
		});
	} catch (error) {
		console.log('getTapsWithProgressForUser in TapService ', error);
	}
};

export const getViewsForTap = async (tapId: string) => {
	try {
		const tapRef = doc(DB, COLLECTIONS.TAPS, tapId);
		const tapDoc = await getDoc(tapRef);
		const tapData = { id: tapDoc.id, ...tapDoc.data() } as TTap;
		const frames = tapData.chapters.map((chapter) => chapter.frames).flat();
		return frames.reduce(
			(total, frame) => total + (frame.watchedBy?.length ?? 0),
			0
		);
	} catch (error) {
		console.log('getViewsForTap in TapService ', error);
	}
};

export const getAllTapsForTopic = async (topicId: string) => {
	try {
		const tapsRef = collection(DB, COLLECTIONS.TAPS);
		const _query = query(tapsRef, where('topicId', '==', topicId));
		const tapsSnapshot = await getDocs(_query);
		return tapsSnapshot.docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data(),
			} as TTap;
		});
	} catch (error) {
		console.log('getAllTapsForTopic in TapService ', error);
	}
};

export const getAllTapsForTopics = async (topics: TTopic[]) => {
	try {
		const tapsRef = collection(DB, COLLECTIONS.TAPS);
		const topicIds = topics.map((topic) => topic.id);
		if (topicIds.length === 0) return [];
		const _query = query(tapsRef, where('topicId', 'in', topicIds));
		const tapsSnapshot = await getDocs(_query);
		return tapsSnapshot.docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data(),
			} as TTap;
		});
	} catch (error) {
		console.log('getAllTapsForTopics in TapService ', error);
	}
};

export const getTapsByCreator = async (profile: TProfile) => {
	try {
		const tapsRef = collection(DB, COLLECTIONS.TAPS);
		const _query = query(tapsRef, where('creatorId', '==', profile.uid));
		const tapsSnapshot = await getDocs(_query);
		return tapsSnapshot.docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data(),
			} as TTap;
		});
	} catch (error) {
		console.log('getTapsByCreatorAndTopic in TapService ', error);
	}
};

export const getProgressForChapters = (
    user: TProfile,
    chapters: TChapter[]
) => {
    if (!user) throw new Error('User not found');
    const result = new Map<string, number>();

    chapters.forEach((chapter) => {
        const amountOfFrames = chapter.frames.length;
        const amountOfFramesWatched = chapter.frames.filter((frame) =>
            (user.watchedFrames || []).find(
                (watchedFrame) => watchedFrame.frameId === frame.id
            )
        ).length;
        const progress = (amountOfFramesWatched / amountOfFrames) * 100;
        result.set(chapter.chapterId, progress);
    });
    return result;
};

export const getTopicFromTap = async (tap: TTap) => {
	try {
		const topicRef = doc(DB, COLLECTIONS.TOPICS, tap.topicId);
		const topicDoc = await getDoc(topicRef);
		return {
			id: topicDoc.id,
			...topicDoc.data(),
		} as TTopic;
	} catch (error) {
		console.log('getTopicFromTap in TapService ', error);
	}
};

async function getWatchedTapsForUser(userData: TProfile) {
	const tapsRef = collection(DB, COLLECTIONS.TAPS);
	const tapIds = [
		...new Set(userData.watchedFrames.map((frame) => frame.tapId)),
	];
	if (tapIds.length === 0) return [];
	const _query = query(tapsRef, where(documentId(), 'in', tapIds));
	const watchedTapsSnapshot = await getDocs(_query);
	const watchedTapsData = watchedTapsSnapshot.docs.map((doc) => doc.data());
	return watchedTapsData;
}
