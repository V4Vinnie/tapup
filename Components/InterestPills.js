import { View } from 'react-native';
import { useTaps } from '../Providers/TapsProvider';
import { useEffect, useState } from 'react';
import { fetchTaps, fetchTopics } from '../utils/fetch';
import { IntrestPill } from '../Views/Profile/IntrestPill';
import { Text } from 'react-native';
import { BoldText } from './Text/BoldText';

export const InterestPills = ({ clickTopic, selectedTopics }) => {
	const { taps, setTaps } = useTaps();

	useEffect(() => {
		const getTaps = async () => {
			const Taps = await fetchTaps();

			const _taps = [];

			for (let i = 0; i < Taps.length; i++) {
				let tap = Taps[i];
				let _topics = await fetchTopics(tap.id);

				tap.topics = _topics;

				_taps.push(tap);
			}
			setTaps(_taps);
		};

		if (!taps) {
			getTaps();
		}
	}, []);

	return (
		<View
			style={{
				flexDirection: 'row',
				flexWrap: 'wrap',
				justifyContent: 'center',
			}}
		>
			{taps ? (
				taps.map((tap) =>
					tap.topics.map((topic) => (
						<IntrestPill
							key={topic.id}
							topic={topic}
							isSelected={selectedTopics.includes(topic.id)}
							onPillClick={clickTopic}
						/>
					))
				)
			) : (
				<BoldText>Loading</BoldText>
			)}
		</View>
	);
};
