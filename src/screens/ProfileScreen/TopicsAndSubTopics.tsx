import { View, Text } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { TProfile, TTap, TTopic } from '../../types';
import { getTopicsByCreator } from '../../database/services/TopicService';
import TagRow, { TagRowSkeleton } from '../../components/TagRow';
import { getTapsByCreator } from '../../database/services/TapService';
import SectionHeader, {
	SectionHeaderSkeleton,
} from '../../components/SectionHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import ChapterRow from '../../components/ChapterRow';

type Props = {
	profile: TProfile;
};

const TopicsAndSubTopics = ({ profile }: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [topics, setTopics] = useState<TTopic[] | null>(null);
	const [selectedTopic, setSelectedTopic] = useState<TTopic | null>(null);
	const [tapsPerTopic, setTapsPerTopic] = useState<{
		[key: string]: TTap[];
	} | null>(null);

	useEffect(() => {
		getTopicsByCreator(profile).then((_topics) => {
			if (!_topics) return;
			setTopics(_topics);
			setSelectedTopic(_topics[0]);
		});
	}, [profile]);

	useEffect(() => {
		const getTaps = async () => {
			if (selectedTopic) {
				const tapsByCreator = await getTapsByCreator(profile);
				const _tapsPerTopic: { [key: string]: TTap[] } = {};
				tapsByCreator?.forEach((tap) => {
					if (!_tapsPerTopic[tap.topicId]) {
						_tapsPerTopic[tap.topicId] = [];
					}
					_tapsPerTopic[tap.topicId].push(tap);
				});
				setTapsPerTopic(_tapsPerTopic ?? {});
			}
		};
		getTaps();
	}, [selectedTopic]);

	const dataLoading = useMemo(() => {
		return topics === null || tapsPerTopic === null;
	}, [topics, tapsPerTopic]);

	if (dataLoading && topics?.length === 0)
		return (
			<View className='flex-1 items-center justify-center'>
				<Text className='text-dark-textColor font-inter-medium text-xl w-1/2 text-center mt-16'>
					This person has not added any taps yet.
				</Text>
			</View>
		);

	if (dataLoading) return <TopicsAndSubTopicsSkeleton />;
	if (!topics || !tapsPerTopic) return null;
	return (
		<View className='w-full mt-6 mb-8'>
			<TagRow selectable data={topics} setSelected={setSelectedTopic} />
			{selectedTopic &&
				tapsPerTopic[selectedTopic.id]?.map((tap) => (
					<View key={tap.id}>
						<SectionHeader
							title={tap.name}
							onPress={() => {
								navigate(Routes.TAP_SCREEN, {
									selectedTopic,
									initialTap: tap,
									taps: tapsPerTopic[selectedTopic.id] ?? [],
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

const TopicsAndSubTopicsSkeleton = () => {
	return (
		<View className='w-full mt-6 mb-8'>
			<TagRowSkeleton />
			{[1, 2, 3, 4, 5].map((item) => (
				<View key={item}>
					<SectionHeaderSkeleton />
					<ChapterRow loading />
				</View>
			))}
		</View>
	);
};

export default TopicsAndSubTopics;
