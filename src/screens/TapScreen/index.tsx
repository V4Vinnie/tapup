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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { TChapter, TTap, TUser } from '../../types';
import ChapterRow from '../../components/ChapterRow';
import SectionHeader from '../../components/SectionHeader';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mode, themeColors } from '../../utils/constants';
import ChapterList from '../../components/ChapterList';
import { useAuth } from '../../providers/AuthProvider';
import { getProgessForChapters } from '../../database/services/MockTapService';
import { onUser } from '../../database/services/UserService';

type ProfileScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'TapScreen'
>;

const TapScreen = ({ route }: ProfileScreenProps) => {
	const { user } = useAuth();
	const { initialTap, selectedTopic, taps, profile } = route.params;
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const isFocused = useIsFocused();
	const [selectedTap, setSelectedTap] = useState<TTap | null>(null);
	const [progress, setProgress] = useState<Map<string, number>>(new Map());
	const [listView, setListView] = useState(false);
	const [loading, setLoading] = useState(true);

	const sortedChapters = useMemo(() => {
		return (selectedTap?.chapters ?? initialTap.chapters).sort(
			(a, b) => a.creationDate.seconds - b.creationDate.seconds
		);
	}, [selectedTap, initialTap]);

	useEffect(() => {
		if (!user?.uid || !sortedChapters) return;
		const getProgress = (user: TUser) => {
			getProgessForChapters(user, sortedChapters).then((progress) => {
				if (progress) setProgress(progress);
				setLoading(false);
			});
		};
		if (isFocused) getProgress(user);
		onUser(user.uid, getProgress);
	}, [isFocused, user, sortedChapters]);

	const toggleListView = () => {
		setListView(!listView);
	};

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<AppHeader headerWithBack title={selectedTopic.name} />
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
								a.id === initialTap.id ? -1 : 1
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
						<ChapterList
							chapterProgress={progress}
							chapters={sortedChapters}
							loading={loading}
						/>
					) : (
						<>
							<ChapterRow
								chapterProgress={progress}
								chapters={sortedChapters}
								loading={loading}
							/>
							<View className='w-full px-4 mt-10 mb-8'>
								<Text
									numberOfLines={1}
									className='font-inter-semiBold text-xl text-dark-headerPrimaryColor'>
									More info
								</Text>
								<Text
									numberOfLines={5}
									className='font-inter-regular text-xs text-dark-subTextColor mt-3'>
									{initialTap.description}
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
