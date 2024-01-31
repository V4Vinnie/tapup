import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { SafeAreaView } from 'react-native';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import SearchbarHeader from '../../components/SearchbarHeader';
import TagRow from '../../components/TagRow';
import { useTopics } from '../../providers/TopicProvider';
import { TTap, TTopic } from '../../types';
import {
	getAllTapsForTopic,
	getAllTapsForTopics,
} from '../../database/services/TapService';
import SectionHeader from '../../components/SectionHeader';
import ChapterRow from '../../components/ChapterRow';
import { useNavigation } from '@react-navigation/native';

type TopicScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'TopicScreen'
>;

const TopicScreen = ({ route }: TopicScreenProps) => {
	const { topic } = route.params;
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { topics } = useTopics();
	const [selectedTopic, setSelectedTopic] = useState<TTopic | null>(null);
	const [tapsPerTopic, setTapsPerTopic] = useState<{
		[key: string]: TTap[];
	}>({});

	useEffect(() => {
		getAllTapsForTopic(topic.id).then((taps) => {
			if (!taps) return;
			setTapsPerTopic((prev) => ({
				...prev,
				[topic.id]: taps,
			}));
		});
	}, [topic]);

	useEffect(() => {
		getAllTapsForTopics(topics).then((taps) => {
			if (!taps) return;
			const tapsPerTopic: { [key: string]: TTap[] } = {};
			taps.forEach((tap) => {
				if (!tapsPerTopic[tap.topicId]) {
					tapsPerTopic[tap.topicId] = [];
				}
				tapsPerTopic[tap.topicId].push(tap);
			});
			setTapsPerTopic(tapsPerTopic);
		});
	}, [topics]);

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='px-4'>
				<SearchbarHeader
					autoFocus={false}
					text='Search in topics...'
					onSearch={() => {}}
					// TODO: Add search in profile functionality
				/>
			</View>
			<ScrollView
				className='w-full mt-6'
				contentContainerStyle={{
					alignItems: 'center',
					justifyContent: 'center',
				}}
				showsVerticalScrollIndicator={false}>
				<View className='w-full'>
					<Text className='px-4 text-dark-textColor text-2xl font-inter-semiBold text-center mb-4'>
						Topics
					</Text>
					<TagRow
						data={topics}
						selectable
						setSelected={setSelectedTopic}
						initialSelected={topic}
					/>
					{selectedTopic &&
						tapsPerTopic[selectedTopic.id]?.map((tap) => (
							<View key={tap.id}>
								<SectionHeader
									key={tap.id}
									title={tap.name}
									onPress={() => {
										navigate(Routes.TAP_SCREEN, {
											selectedTopic,
											initialTap: tap,
											taps:
												tapsPerTopic[
													selectedTopic.id
												] ?? [],
										});
									}}
								/>
								<ChapterRow chapters={tap.chapters} />
							</View>
						))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default TopicScreen;
