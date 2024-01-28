import {
	TChapter,
	TContinueWatchingTap,
	TFrame,
	TProfile,
	TTap,
	TTopic,
	TUser,
} from '../../types';
import { getUser } from './UserService';
import { MOCK_FRAMES, MOCK_TAPS, MOCK_TOPICS, MOCK_USERS } from './MockData';

export const getAllTaps = async () => {
	try {
		return MOCK_TAPS;
	} catch (error) {
		console.log('getTaps in MockTapService ', error);
	}
};

export const getUserDiscoverTaps = async (user: TUser) => {
	try {
		// taps that user doesn't have in their continue watching list
		const watchedTaps = (await getTapsWithProgressForUser(user)) ?? [];
		return MOCK_TAPS.filter(
			(tap) => !watchedTaps.find((watchedTap) => watchedTap.id === tap.id)
		);
	} catch (error) {
		console.log('getTaps in MockTapService ', error);
	}
};

const createFrameToChapterMap = (frames: TFrame[]) => {
	const frameToChapterMap = new Map<string, string>();
	frames.forEach((frame) => {
		frameToChapterMap.set(frame.id, frame.chapterId);
	});
	return frameToChapterMap;
};

const createWatchedChapterIds = (
	userData: TUser,
	frameToChapterMap: Map<string, string>
) => {
	const watchedChapterIds = new Set<string>();
	userData.watchedFrameIds.forEach((frameId) => {
		const chapterId = frameToChapterMap.get(frameId);
		if (chapterId) watchedChapterIds.add(chapterId);
	});
	return watchedChapterIds;
};

const calculateProgress = (
	tapChapters: TChapter[],
	userData: TUser,
	frameToChapterMap: Map<string, string>
) => {
	const totalFrames = tapChapters.reduce(
		(total, chapter) => total + chapter.frames.length,
		0
	);
	const watchedFrames = userData.watchedFrameIds.filter(
		(frameId) =>
			frameToChapterMap.get(frameId) &&
			tapChapters.find(
				(chapter) => chapter.id === frameToChapterMap.get(frameId)
			)
	).length;
	return (watchedFrames / totalFrames) * 100;
};

export const getTapsWithProgressForUser = async (user: TUser) => {
	try {
		const userData = await getUser(user.uid);
		if (!userData) throw new Error('User not found');

		const frameToChapterMap = createFrameToChapterMap(MOCK_FRAMES);
		const watchedChapterIds = createWatchedChapterIds(
			userData,
			frameToChapterMap
		);

		const tapsWithProgress = MOCK_TAPS.reduce((acc, tap) => {
			const tapChapters = tap.chapters.filter((chapter) =>
				watchedChapterIds.has(chapter.id)
			);
			if (tapChapters.length > 0) {
				const progress = calculateProgress(
					tapChapters,
					userData,
					frameToChapterMap
				);
				acc.push({ ...tap, progress } as TContinueWatchingTap);
			}
			return acc;
		}, [] as TContinueWatchingTap[]);

		return new Promise<TContinueWatchingTap[]>((resolve) =>
			setTimeout(() => resolve(tapsWithProgress), 1000)
		);
	} catch (error) {
		console.log('getTapsWithProgressForUser in MockTapService ', error);
	}
};

export const getViewsForTap = async (tapId: string) => {
	try {
		return Math.floor(Math.random() * 1000);
	} catch (error) {
		console.log('getViewsForTap in MockTapService ', error);
	}
};

export const getAllTapsForTopic = async (topicId: string) => {
	try {
		return MOCK_TAPS.filter((tap) => tap.topicId === topicId);
	} catch (error) {
		console.log('getAllTapsForTopic in MockTapService ', error);
	}
};

export const getAllTapsForTopics = async (topics: TTopic[]) => {
	try {
		const tapsPerTopic = {} as Record<string, TTap[]>;
		topics.forEach((topic) => {
			tapsPerTopic[topic.id] = MOCK_TAPS.filter(
				(tap) => tap.topicId === topic.id
			);
		});
		return new Promise<{ [key: string]: TTap[] }>((resolve) =>
			setTimeout(() => resolve(tapsPerTopic), 1000)
		);
	} catch (error) {
		console.log('getAllTapsForTopics in MockTapService ', error);
	}
};

export const getTapsPerTopicFromProfile = async (profile: TProfile) => {
	try {
		const tapsPerTopic = {} as Record<string, TTap[]>;
		const frames = profile.madeFrames ?? [];
		frames.forEach((frame) => {
			const tap = MOCK_TAPS.find((tap) => tap.id === frame.tapId);
			if (tap) {
				if (!tapsPerTopic[tap.topicId]) tapsPerTopic[tap.topicId] = [];
				if (tapsPerTopic[tap.topicId].some((t) => t.id === tap.id))
					return;
				tapsPerTopic[tap.topicId].push(tap);
			}
		});

		return new Promise<Record<string, TTap[]>>((resolve) =>
			setTimeout(() => resolve(tapsPerTopic), 1000)
		);
	} catch (error) {
		console.log(
			'getTapsPerTopicFromProfileAndTopic in MockTapService ',
			error
		);
	}
};

export const getProgessForChapters = async (
	user: TUser,
	chapters: TChapter[]
): Promise<Map<string, number>> => {
	if (!user) throw new Error('User not found');
	const result = new Map<string, number>();

	chapters.forEach((chapter) => {
		const chapterFrames = chapter.frames.filter((frame) =>
			user.watchedFrameIds.includes(frame.id)
		);
		const progress = (chapterFrames.length / chapter.frames.length) * 100;
		result.set(chapter.id, progress);
	});
	return new Promise<Map<string, number>>((resolve) =>
		setTimeout(() => resolve(result), 1000)
	);
};

export const getProfileForTap = async (tap: TTap) => {
	try {
		return new Promise<TProfile>((resolve) =>
			setTimeout(() => resolve(MOCK_USERS[0]), 1000)
		);
	} catch (error) {
		console.log('getProfileForTap in MockTapService ', error);
	}
};

export const getTopicFromTap = async (tap: TTap) => {
	try {
		return MOCK_TOPICS.find((topic) => topic.id === tap.topicId);
	} catch (error) {
		console.log('getTopicFromTap in MockTapService ', error);
	}
};
