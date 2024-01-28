import { Timestamp } from 'firebase/firestore';
import { TChapter, TFrame, TProfile, TTap, TTopic } from '../../types';

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

export const MOCK_TOPICS: TTopic[] = [
	{
		id: '25b5f4be-bff4-4d5a-a734-b38e3fc1d40b',
		name: 'Coding',
	},
	{
		id: 'f0c18c4a-e789-4480-b317-4981f77c22d5',
		name: 'Entrepreneurship',
	},
	{
		id: '8a415c6b-d8e1-43dd-bbb4-89ac0158caee',
		name: 'Design',
	},
	{
		id: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
		name: 'Marketing',
	},
	{
		id: 'd5b48269-a55c-4524-b473-c19ccf563196',
		name: 'Productivity',
	},
];

export const MOCK_USERS: TProfile[] = [
	{
		uid: 'f315e0a9-b435-4433-9027-17bce156ed5e',
		name: 'John Doe',
		email: 'jhon.doe@gmail.com',
		profilePic: 'https://i.pravatar.cc/300',
		role: 'USER',
		watchedFrameIds: [],
		madeFrames: [
			...MOCK_FRAMES,
			{
				...MOCK_FRAMES[0],
				tapId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
			},
		],
	},
	{
		uid: 'aaf8197b-e091-4575-9aba-b99a57ec6d2e',
		name: 'Other Doe',
		email: 'other.doe@gmail.com',
		profilePic: '',
		role: 'USER',
		watchedFrameIds: [],
	},
];
