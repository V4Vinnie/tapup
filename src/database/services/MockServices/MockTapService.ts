import {
	TChapter,
	TContinueWatchingTap,
	TFrame,
	TTap,
	TTopic,
	TProfile,
} from '../../../types';
import { getProfile } from '../UserService';
import { MOCK_FRAMES, MOCK_TAPS, MOCK_TOPICS, MOCK_USERS } from './MockData';

export const getAllTaps = async () => {
	try {
		return MOCK_TAPS;
	} catch (error) {
		console.log('getTaps in MockTapService ', error);
	}
};

export const getProfileDiscoverTaps = async (user: TProfile) => {
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

export const getTapsWithProgressForUser = async (user: TProfile) => {
	try {
		const userData = await getProfile(user.uid);
		if (!userData) throw new Error('User not found');
		const watchedFrames = userData.watchedFrames ?? [];
		const watchedTaps = watchedFrames.map((frame) => {
			return MOCK_TAPS.find((tap) => tap.id === frame.tapId) as TTap;
		});
		const tapsWithProgress = watchedTaps.map((tap) => {
			const watchedFrames = tap.chapters.reduce(
				(acc: number, chapter: TChapter) => {
					const frames = chapter.frames.filter((frame) =>
						userData.watchedFrames.some(
							(watchedFrame) => watchedFrame.frameId === frame.id
						)
					);
					return acc + frames.length;
				},
				0
			);
			const totalFrames = tap.chapters.reduce(
				(acc, chapter) => acc + chapter.frames.length,
				0
			);
			const progress = (watchedFrames / totalFrames) * 100;
			return { ...tap, progress };
		});

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

export const getTapsByCreator = async (profile: TProfile) => {
	try {
		const tapsPerTopic = {} as Record<string, TTap[]>;
		MOCK_TAPS.filter((tap) => tap.creatorId === profile.uid).forEach(
			(tap) => {
				if (!tapsPerTopic[tap.topicId]) tapsPerTopic[tap.topicId] = [];
				tapsPerTopic[tap.topicId].push(tap);
			}
		);

		return new Promise<Record<string, TTap[]>>((resolve) =>
			setTimeout(() => resolve(tapsPerTopic), 1000)
		);
	} catch (error) {
		console.log('getTapsByCreatorAndTopic in MockTapService ', error);
	}
};

export const getProgressForChapters = async (
	user: TProfile,
	chapters: TChapter[]
): Promise<Map<string, number>> => {
	if (!user) throw new Error('User not found');
	const result = new Map<string, number>();

	chapters.forEach((chapter) => {
		const chapterFrames = chapter.frames.filter((frame) =>
			user.watchedFrames.some(
				(watchedFrame) => watchedFrame.frameId === frame.id
			)
		);
		const progress = (chapterFrames.length / chapter.frames.length) * 100;
		result.set(chapter.chapterId, progress);
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
