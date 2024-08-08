import { TCompany, TProfile, TTap, TTopic } from '../../types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { DB } from '../Firebase';
import { COLLECTIONS } from '../../utils/constants';

export const getAllTaps = async (company: TCompany): Promise<TTap[]> => {
	try {
		const tapsRef = collection(DB, COLLECTIONS.TAPS);
		const _query = query(tapsRef, where('companyCode', '==', company.code));
		const allTaps = await getDocs(_query);
		if (allTaps.empty) return [];
		return allTaps.docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data(),
			} as TTap;
		});
	} catch (error) {
		console.log('getAllTaps in TapService ', error);
		return [];
	}
};

export const getProcessPercentageForTaps = (user: TProfile, taps: TTap[]) => {
	return taps.reduce(
		(acc, tap) => {
			const chapters = tap.chapters ?? [];
			const watchedChapters = user.watchedChapters || [];
			const chaptersForTap = chapters.filter((chapter) =>
				watchedChapters.includes(chapter.chapterId)
			);
			const amountOfChapters = chapters.length;
			const amountOfChaptersWatched = chaptersForTap.length;
			const percentage =
				(amountOfChaptersWatched / amountOfChapters) * 100;
			acc[tap.id] = percentage;
			return acc;
		},
		{} as Record<string, number>
	);
};

// export const getViewsForTap = async (tapId: string) => {
// 	try {
// 		const tapRef = doc(DB, COLLECTIONS.TAPS, tapId);
// 		const tapDoc = await getDoc(tapRef);
// 		const tapData = { id: tapDoc.id, ...tapDoc.data() } as TTap;
// 		const frames = tapData.chapters.map((chapter) => chapter.frames).flat();
// 		return frames.reduce(
// 			(total, frame) => total + (frame.watchedBy?.length ?? 0),
// 			0
// 		);
// 	} catch (error) {
// 		console.log('getViewsForTap in TapService ', error);
// 	}
// };

export const getAllTapsForTopic = (topicId: string, taps: TTap[]) => {
	return taps.filter((tap) => tap.topicId === topicId);
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

export const getTopicFromTap = (tap: TTap, topics: TTopic[]) => {
	return topics.find((topic) => topic.id === tap.topicId);
};

function getWatchedTapsForUser(user: TProfile, taps: TTap[]) {
	const watchedChapters = user.watchedChapters ?? [];
	const watchedTaps = taps.filter((tap) => {
		const chapters = tap.chapters;
		const chaptersForTap = chapters.filter((chapter) =>
			watchedChapters.includes(chapter.chapterId)
		);
		return chaptersForTap.length === chapters.length;
	});
	return watchedTaps;
}

export const getUnwatchedTaps = (user: TProfile, taps: TTap[]) => {
	const watchedTaps = getWatchedTapsForUser(user, taps);
	return taps.filter(
		(tap) => !watchedTaps.find((watchedTap) => watchedTap.id === tap.id)
	);
};

export const getBusyWatchingTaps = (user: TProfile, taps: TTap[]) => {
	// taps that are not fully watched
	const tapsProgress = getProcessPercentageForTaps(user, taps);
	return taps.filter(
		(tap) => tapsProgress[tap.id] > 0 && tapsProgress[tap.id] < 100
	);
};
