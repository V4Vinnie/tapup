import { View, Text, SafeAreaView, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import ProfileHeader, {
	ProfileHeaderSkeleton,
} from '../../components/ProfileHeader';
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Routes';
import AppHeader from '../../components/AppHeader';
import TagRow, { TagRowSkeleton } from '../../components/TagRow';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ChapterRow from '../../components/ChapterRow';
import SectionHeader from '../../components/SectionHeader';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mode, themeColors } from '../../utils/constants';
import ChapterList from '../../components/ChapterList';
import { useAuth } from '../../providers/AuthProvider';
import {
	getAllTapsForTopic,
	getProgressForChapters,
} from '../../database/services/TapService';
import { onUser } from '../../database/services/UserService';
import { TProfile, TTap } from '../../types';
import { getProfileForTap } from '../../database/services/ProfileService';

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
	const [tapProfile, setTapProfile] = useState<TProfile | null>(null);
	const [selectedTap, setSelectedTap] = useState<TTap | null>(null);
	const [progress, setProgress] = useState<Map<string, number>>(new Map());
	const [allTaps, setAllTaps] = useState<TTap[] | null>(null);
	const [listView, setListView] = useState(false);
	const [loading, setLoading] = useState(true);

	const sortedChapters = useMemo(() => {
		return (selectedTap?.chapters ?? initialTap.chapters).sort(
			(a, b) =>
				a.frames[a.frames.length - 1].createdAt.seconds -
				b.frames[b.frames.length - 1].createdAt.seconds
		);
	}, [selectedTap, initialTap]);

	useEffect(() => {
		if (!user?.uid || !sortedChapters) return;
		const getProgress = (user: TProfile) => {
			const progress = getProgressForChapters(user, sortedChapters);
			if (progress) setProgress(progress);
			setLoading(false);
		};
		if (isFocused) getProgress(user);
		onUser(user.uid, getProgress);
	}, [isFocused, user, sortedChapters]);

	useEffect(() => {
		const getTapProfile = async () => {
			if (!profile) {
				const _tapProfile = await getProfileForTap(
					selectedTap ?? initialTap
				);
				if (_tapProfile) {
					setTapProfile(_tapProfile);
				}
			} else {
				setTapProfile(profile);
			}
		};
		getTapProfile();
	}, [profile, selectedTap]);

	useEffect(() => {
		const getAllTaps = async () => {
			if (taps) {
				setAllTaps(taps);
			} else {
				const _allTaps = await getAllTapsForTopic(selectedTopic.id);
				if (_allTaps) setAllTaps(_allTaps);
			}
		};
		getAllTaps();
	}, [taps, tapProfile, selectedTopic]);

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
					{tapProfile ? (
						<ProfileHeader profile={tapProfile} />
					) : (
						<ProfileHeaderSkeleton />
					)}
					<View className='mt-6 -mb-2'>
						{allTaps ? (
							<TagRow
								containerProps={{
									style: {
										marginTop: 0,
									},
								}}
								selectable
								data={allTaps}
								setSelected={setSelectedTap}
								initialSelected={initialTap}
							/>
						) : (
							<TagRowSkeleton />
						)}
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
		</SafeAreaView>
	);
};

export default TapScreen;
