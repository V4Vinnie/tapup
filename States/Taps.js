import uuid from 'react-native-uuid';

import { hookstate } from '@hookstate/core';
import { useHookstate } from '@hookstate/core';

const tapsState = hookstate([]);
const wrapTapsState = (s) => ({
	get: () => s.value,
	set: (allTaps) => s.set(allTaps),
	findById: (topicId) => {
		let foundedTopic;
		s.map((tab) => {
			tab.topics.map((topic) => {
				if (topic.id === topicId) {
					foundedTopic = topic;
				}
			});
		});

		return foundedTopic;
	},
});

// The following 2 functions can be exported now:
export const accessGlobalState = () => wrapTapsState(tapsState);
export const useTapsState = () => wrapTapsState(useHookstate(tapsState));

export let Taps = [
	{
		id: uuid.v4(),
		img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
		title: 'AI Based',
		isFeature: true,
		topics: [
			{
				id: uuid.v4(),
				title: 'Ai based test',
				img: 'https://www.howest.be/sites/default/files/images/opleidingen/afstandsonderwijs/artificial-intelligence/artificial-intelligence.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Ai based test2',
				img: 'https://www.howest.be/sites/default/files/images/opleidingen/afstandsonderwijs/artificial-intelligence/artificial-intelligence.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Ai based test3',
				img: 'https://www.howest.be/sites/default/files/images/opleidingen/afstandsonderwijs/artificial-intelligence/artificial-intelligence.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Ai based test4',
				img: 'https://www.howest.be/sites/default/files/images/opleidingen/afstandsonderwijs/artificial-intelligence/artificial-intelligence.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
		],
	},
	{
		id: uuid.v4(),
		img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
		title: 'Student',
		isFeature: false,
		topics: [
			{
				id: uuid.v4(),
				title: 'Student learning',
				img: 'https://registrar.ucsc.edu/images/vertical-two-students-laptop.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Student learning2',
				img: 'https://registrar.ucsc.edu/images/vertical-two-students-laptop.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Student learning3',
				img: 'https://registrar.ucsc.edu/images/vertical-two-students-laptop.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Student learning4',
				img: 'https://registrar.ucsc.edu/images/vertical-two-students-laptop.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
		],
	},
	{
		id: uuid.v4(),
		img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
		title: 'Funding',
		isFeature: false,
		topics: [
			{
				id: uuid.v4(),
				title: 'Funding lesson ',
				img: 'https://www.warringtonva.org.uk/sites/default/files/2022-05/funding.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Funding lesson 2',
				img: 'https://www.warringtonva.org.uk/sites/default/files/2022-05/funding.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Funding lesson 3',
				img: 'https://www.warringtonva.org.uk/sites/default/files/2022-05/funding.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Funding lesson 4',
				img: 'https://www.warringtonva.org.uk/sites/default/files/2022-05/funding.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
		],
	},
	{
		id: uuid.v4(),
		img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
		title: 'Creative',
		isFeature: true,
		topics: [
			{
				id: uuid.v4(),
				title: 'Student learning',
				img: 'https://psmag.com/.image/t_share/MTMxODI3Mjk4OTkwMDgyMDU4/shutterstock_125158133jpg.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Student learning2',
				img: 'https://psmag.com/.image/t_share/MTMxODI3Mjk4OTkwMDgyMDU4/shutterstock_125158133jpg.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Student learning3',
				img: 'https://psmag.com/.image/t_share/MTMxODI3Mjk4OTkwMDgyMDU4/shutterstock_125158133jpg.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Student learning4',
				img: 'https://psmag.com/.image/t_share/MTMxODI3Mjk4OTkwMDgyMDU4/shutterstock_125158133jpg.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
		],
	},
	{
		id: uuid.v4(),
		img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
		title: 'Entrepreneurship',
		isFeature: false,
		topics: [
			{
				id: uuid.v4(),
				title: 'Entrepreneurship ',
				img: 'https://sugermint.com/wp-content/uploads/2022/06/Benefits-of-Entrepreneurship-Development.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Entrepreneurship 2',
				img: 'https://sugermint.com/wp-content/uploads/2022/06/Benefits-of-Entrepreneurship-Development.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Entrepreneurship 3',
				img: 'https://sugermint.com/wp-content/uploads/2022/06/Benefits-of-Entrepreneurship-Development.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Entrepreneurship 4',
				img: 'https://sugermint.com/wp-content/uploads/2022/06/Benefits-of-Entrepreneurship-Development.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
		],
	},
	{
		id: uuid.v4(),
		img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
		title: 'Tap #6',
		isFeature: true,
		topics: [
			{
				id: uuid.v4(),
				title: 'Topic tab ',
				img: 'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Topic tab 2',
				img: 'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Topic tab 3',
				img: 'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
			{
				id: uuid.v4(),
				title: 'Topic tab 4',
				img: 'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg',
				frames: [
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: true,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
					{
						id: uuid.v4(),
						img: 'https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-ai-artificial-intelligent-blue-image_38901.jpg',
						title: 'Frames here',
						isDone: false,
					},
				],
			},
		],
	},
];
