import { Timestamp } from 'firebase/firestore';

import {
	TChapter,
	TContinueWatchingTap,
	TFrame,
	TTap,
	TUser,
} from '../../types';
import { getUser } from './UserService';

export const getTaps = async () => {
	return MOCK_TAPS;
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
		return new Promise<TContinueWatchingTap[]>((resolve) => {
			setTimeout(() => {
				resolve(tapsWithProgress);
			}, 1000);
		});
	} catch (error) {
		console.log('getTapsWithProgressForUser in MockTapService ', error);
	}
};

const MOCK_FRAMES: TFrame[] = [
	{
		id: '2b4942aa-e129-472d-90f1-23c98bdb2efa',
		media: 'https://picsum.photos/800/1200',
		mediaType: 'IMAGE',
		chapterId: '9ac82149-f2c4-4d69-bf88-3bbf248080e7',
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creationDate: new Timestamp(1, 1),
	},
	{
		id: 'f97431b7-200d-436f-a28c-0e5f00c2b37c',
		media: 'https://picsum.photos/800/1200',
		mediaType: 'IMAGE',
		chapterId: '9ac82149-f2c4-4d69-bf88-3bbf248080e7',
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creationDate: new Timestamp(1, 1),
	},
	{
		id: '7ff44400-6fec-4d4b-b522-8faaed011f28',
		media: 'https://picsum.photos/800/1200',
		mediaType: 'IMAGE',
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
		tapId: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
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
		frames: [MOCK_FRAMES[0]],
		tapId: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
		creatorId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		creationDate: new Timestamp(1, 1),
	},
];

const MOCK_TAPS: TTap[] = [
	{
		id: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
		name: 'Tap 1',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris.',
		thumbnail: 'https://picsum.photos/800/1200',
		topicId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		chapters: MOCK_CHAPTERS,
		companyId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		createdAt: new Timestamp(1, 1),
	},
	{
		id: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		name: 'Tap 2',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris, vitae lacinia eros orci id nisi. Nulla facilisi. Nulla facilisi.',
		thumbnail: 'https://picsum.photos/800/1200',
		topicId: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
		chapters: MOCK_CHAPTERS_2,
		companyId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		createdAt: new Timestamp(1, 1),
	},
	{
		id: '2d82222f-86a0-41e5-b0a2-d5b66fa47529',
		name: 'Tap 3',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris, vitae lacinia eros orci id nisi. Nulla facilisi. Nulla facilisi.',
		thumbnail: 'https://picsum.photos/800/1200',
		topicId: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
		chapters: MOCK_CHAPTERS,
		companyId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		createdAt: new Timestamp(1, 1),
	},
	{
		id: 'fddcdd46-3d34-41db-ba4c-40bbf2c507f6',
		name: 'Tap 4',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris, vitae lacinia eros orci id nisi. Nulla facilisi. Nulla facilisi.',
		thumbnail: 'https://picsum.photos/800/1200',
		topicId: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
		chapters: MOCK_CHAPTERS,
		companyId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		createdAt: new Timestamp(1, 1),
	},
];
