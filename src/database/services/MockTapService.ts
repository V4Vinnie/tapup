import { Timestamp } from 'firebase/firestore';

import {
	TChapter,
	TContinueWatchingTap,
	TFrame,
	TProfile,
	TTap,
	TUser,
} from '../../types';
import { getUser } from './UserService';

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

		// wait for 1 second to simulate network delay
		return new Promise<TContinueWatchingTap[] | undefined>((resolve) => {
			setTimeout(() => {
				resolve(tapsWithProgress);
			}, 1000);
		});
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

		return new Promise<{
			[tapId: string]: TTap[];
		}>((resolve) => {
			setTimeout(() => {
				resolve(tapsPerTopic);
			}, 1000);
		});
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
	return new Promise<Map<string, number>>((resolve) => {
		setTimeout(() => {
			resolve(result);
		}, 1000);
	});
};

export const MOCK_FRAMES: TFrame[] = [
	{
		id: '2b4942aa-e129-472d-90f1-23c98bdb2efa',
		media: 'https://picsum.photos/800/1200',
		mediaType: 'IMAGE',
		topicId: 'f0c18c4a-e789-4480-b317-4981f77c22d5',
		tapId: 'ef1f2e34-bad7-4497-a4d7-7f32d128fbc3',
		chapterId: '9ac82149-f2c4-4d69-bf88-3bbf248080e7',
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creationDate: new Timestamp(1, 1),
	},
	{
		id: 'f97431b7-200d-436f-a28c-0e5f00c2b37c',
		media: 'https://picsum.photos/800/1200',
		mediaType: 'IMAGE',
		topicId: 'f0c18c4a-e789-4480-b317-4981f77c22d5',
		tapId: '2d82222f-86a0-41e5-b0a2-d5b66fa47529',
		chapterId: '9ac82149-f2c4-4d69-bf88-3bbf248080e7',
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creationDate: new Timestamp(1, 1),
	},
	{
		id: '7ff44400-6fec-4d4b-b522-8faaed011f28',
		media: 'https://picsum.photos/800/1200',
		mediaType: 'IMAGE',
		topicId: 'f0c18c4a-e789-4480-b317-4981f77c22d5',
		tapId: 'ef1f2e34-bad7-4497-a4d7-7f32d128fbc3',
		chapterId: '9ac82149-f2c4-4d69-bf88-3bbf248080e7',
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creationDate: new Timestamp(1, 1),
	},
	{
		id: '7ff44400-6fec-4d4b-b522-8faaed011f28',
		media: 'https://picsum.photos/800/1200',
		mediaType: 'IMAGE',
		topicId: 'f0c18c4a-e789-4480-b317-4981f77c22d5',
		tapId: 'ef1f2e34-bad7-4497-a4d7-7f32d128fbc3',
		chapterId: '9ac82149-f2c4-4d69-bf88-3bbf248080e7',
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creationDate: new Timestamp(1, 1),
	},
];

const MOCK_CHAPTERS: TChapter[] = [
	{
		id: '9ac82149-f2c4-4d69-bf88-3bbf248080e7',
		name: 'Chapter 1',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris, vitae lacinia eros orci id nisi. Nulla facilisi. Nulla facilisi.',
		frames: MOCK_FRAMES,
		tapId: 'ef1f2e34-bad7-4497-a4d7-7f32d128fbc3',
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creationDate: new Timestamp(1, 1),
	},
	{
		id: '76911ae1-8da7-4274-9b4d-8b20e84546b8',
		name: 'Chapter 2',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris, vitae lacinia eros orci id nisi. Nulla facilisi. Nulla facilisi.',
		frames: MOCK_FRAMES,
		tapId: 'ef1f2e34-bad7-4497-a4d7-7f32d128fbc3',
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creationDate: new Timestamp(1, 1),
	},
];
const MOCK_CHAPTERS_2: TChapter[] = [
	{
		id: 'd8ed5a75-263a-493d-b9fa-dba76e4687c2',
		name: 'Chapter 2',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris, vitae lacinia eros orci id nisi. Nulla facilisi. Nulla facilisi.',
		frames: [
			{
				...MOCK_FRAMES[0],
				tapId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
			},
		],
		tapId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creationDate: new Timestamp(1, 1),
	},
];

export const MOCK_TAPS: TTap[] = [
	{
		id: 'ef1f2e34-bad7-4497-a4d7-7f32d128fbc3',
		fullName: 'Student Entrepreneurship',
		name: 'For students',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris.',
		thumbnail: 'https://picsum.photos/800/1200',
		topicId: 'f0c18c4a-e789-4480-b317-4981f77c22d5',
		chapters: MOCK_CHAPTERS,
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		createdAt: new Timestamp(1, 1),
	},
	{
		id: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		fullName: 'Designing for beginners',
		name: 'For beginners',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris, vitae lacinia eros orci id nisi. Nulla facilisi. Nulla facilisi.',
		thumbnail: 'https://picsum.photos/800/1200',
		topicId: 'f0c18c4a-e789-4480-b317-4981f77c22d5',
		chapters: MOCK_CHAPTERS_2,
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		createdAt: new Timestamp(1, 1),
	},
	{
		id: '2d82222f-86a0-41e5-b0a2-d5b66fa47529',
		fullName: 'Coding for dummies',
		name: 'For dummies',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris, vitae lacinia eros orci id nisi. Nulla facilisi. Nulla facilisi.',
		thumbnail: 'https://picsum.photos/800/1200',
		topicId: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
		chapters: MOCK_CHAPTERS,
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		createdAt: new Timestamp(1, 1),
	},
	{
		id: 'fddcdd46-3d34-41db-ba4c-40bbf2c507f6',
		fullName: 'Marketing for beginners',
		name: 'For beginners',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris, vitae lacinia eros orci id nisi. Nulla facilisi. Nulla facilisi.',
		thumbnail: 'https://picsum.photos/800/1200',
		topicId: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
		chapters: MOCK_CHAPTERS,
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		createdAt: new Timestamp(1, 1),
	},
	{
		id: 'aeb489fd-37a4-453d-8389-2827d7239c0f',
		fullName: 'Marketing for beginners',
		name: 'For beginners',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris, vitae lacinia eros orci id nisi. Nulla facilisi. Nulla facilisi.',
		thumbnail: 'https://picsum.photos/800/1200',
		topicId: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
		chapters: [],
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		createdAt: new Timestamp(1, 1),
	},
];
