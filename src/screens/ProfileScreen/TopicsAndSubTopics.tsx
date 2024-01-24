import { View, Text } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { TProfile, TTap, TTopic } from '../../types';
import { getTopicsFromProfile } from '../../database/services/MockTopicService';
import TagRow from '../../components/TagRow';
import { FlatList } from 'react-native-gesture-handler';
import { getTapsPerTopicFromProfile } from '../../database/services/MockTapService';
import SectionHeader from '../../components/SectionHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import TapRow from '../../components/TapRow';
import ChapterRow from '../../components/ChapterRow';

type Props = {
	profile: TProfile;
};

const TopicsAndSubTopics = ({ profile }: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [topics, setTopics] = useState<TTopic[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<TTopic | null>(null);
	const [tapsPerTopic, setTapsPerTopic] = useState<{ [key: string]: TTap[] }>(
		{}
	);

	useEffect(() => {
		const getTopics = async () => {
			const _topics = await getTopicsFromProfile(profile);
			setTopics(_topics ?? []);
		};
		getTopics();
	}, [profile]);

	useEffect(() => {
		const getTaps = async () => {
			if (selectedTopic) {
				const _tapsPerTopic = await getTapsPerTopicFromProfile(profile);
				setTapsPerTopic(_tapsPerTopic ?? {});
			}
		};
		getTaps();
	}, [selectedTopic]);

	return topics.length === 0 ? (
		<View className='flex-1 items-center justify-center'>
			<Text className='text-dark-textColor font-inter-medium text-xl w-1/2 text-center mt-16'>
				This person has not added any taps yet.
			</Text>
		</View>
	) : (
		<View className='w-full mt-6 mb-8'>
			<TagRow selectable data={topics} setSelected={setSelectedTopic} />
			{selectedTopic &&
				tapsPerTopic[selectedTopic.id]?.map((tap) => (
					<View key={tap.id}>
						<SectionHeader
							title={tap.name}
							onPress={() => {
								navigate(Routes.TAP_SCREEN, {
									topic: selectedTopic,
									tap,
									profile,
								});
							}}
						/>
						<ChapterRow chapters={tap.chapters} />
					</View>
				))}
		</View>
	);
};

export default TopicsAndSubTopics;
