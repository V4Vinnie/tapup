import { Timestamp } from 'firebase/firestore';

import { TTap } from '../../types';

export const getTaps = async () => {
	return MOCK_TAPS;
};

const MOCK_TAPS: TTap[] = [
	{
		id: '97bbf6d3-8873-47e2-a6cf-5f535bb8e8e7',
		name: 'Tap 1',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl nec sagittis dapibus, urna nisi ultricies mauris.',
		thumbnail: 'https://picsum.photos/800/1200',
		topicId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		chapterIds: ['fddcdd46-3d34-41db-ba4c-40bbf2c507f6'],
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
		chapterIds: ['2d82222f-86a0-41e5-b0a2-d5b66fa47529'],
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
		chapterIds: ['fddcdd46-3d34-41db-ba4c-40bbf2c507f6'],
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
		chapterIds: ['2d82222f-86a0-41e5-b0a2-d5b66fa47529'],
		companyId: '0b57b80f-e3b5-4048-b8e7-73fe4b0b160a',
		createdAt: new Timestamp(1, 1),
	},
];
