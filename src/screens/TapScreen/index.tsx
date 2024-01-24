import { View, Text, SafeAreaView, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import SearchbarHeader from '../../components/SearchbarHeader';
import ProfileHeader from '../../components/ProfileHeader';
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Routes';
import { useTaps } from '../../providers/TapProvider';
import AppHeader from '../../components/AppHeader';
import TagRow from '../../components/TagRow';
import { useNavigation } from '@react-navigation/native';
import { TChapter, TTap } from '../../types';
import { getTapsPerTopicFromProfile } from '../../database/services/MockTapService';
import ChapterRow from '../../components/ChapterRow';
import SectionHeader from '../../components/SectionHeader';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mode, themeColors } from '../../utils/constants';
import ChapterList from '../../components/ChapterList';

type ProfileScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'TapScreen'
>;

const TapScreen = ({ route }: ProfileScreenProps) => {
	const { tap, topic, profile } = route.params;
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [taps, setTaps] = useState<TTap[]>([]);
	const [selectedTap, setSelectedTap] = useState<TTap | null>(null);
	const [listView, setListView] = useState(false);

	useEffect(() => {
		const getTaps = async () => {
			const _taps = await getTapsPerTopicFromProfile(profile);
			if (_taps) setTaps(_taps[topic.id] ?? []);
		};
		getTaps();
	}, [profile]);

	const sortedChapters = useMemo(() => {
		return (selectedTap?.chapters ?? tap.chapters).sort(
			(a, b) => a.creationDate.seconds - b.creationDate.seconds
		);
	}, [selectedTap, tap]);

	const toggleListView = () => {
		setListView(!listView);
	};

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<AppHeader headerWithBack title={topic.name} />
			<ScrollView
				className='w-full'
				contentContainerStyle={{
					alignItems: 'center',
					justifyContent: 'center',
				}}
				showsVerticalScrollIndicator={false}>
				<View className='w-full flex items-center'>
					<ProfileHeader profile={profile} />
					<View className='mt-6 -mb-2'>
						<TagRow
							containerProps={{
								style: {
									marginTop: 0,
								},
							}}
							selectable
							data={taps.sort((a, b) =>
								a.id === tap.id ? -1 : 1
							)}
							setSelected={setSelectedTap}
						/>
					</View>
					<SectionHeader
						title={'Chapters'}
						onPress={toggleListView}
						icon={
							listView ? (
								<MCIcon
									name='table-row'
									size={20}
									color={themeColors[mode].textColor}
								/>
							) : (
								<IonIcon
									name='list-sharp'
									size={20}
									color={themeColors[mode].textColor}
								/>
							)
						}
					/>
					{listView ? (
						<ChapterList chapters={sortedChapters} />
					) : (
						<>
							<ChapterRow chapters={sortedChapters} />
							<View className='w-full px-4 mt-10 mb-8'>
								<Text
									numberOfLines={1}
									className='font-inter-semiBold text-xl text-dark-headerPrimaryColor'>
									More info
								</Text>
								<Text
									numberOfLines={5}
									className='font-inter-regular text-xs text-dark-subTextColor mt-3'>
									{tap.description}
								</Text>
							</View>
						</>
					)}
				</View>
			</ScrollView>
			{/* TODO: Add search in profile functionality */}
		</SafeAreaView>
	);
};

export default TapScreen;
