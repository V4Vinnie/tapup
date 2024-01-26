import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import SearchbarHeader from '../../components/SearchbarHeader';
import ProfileHeader from '../../components/ProfileHeader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Routes';
import TopicsAndSubTopics from './TopicsAndSubTopics';

type ProfileScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'ProfileScreen'
>;

const ProfileScreen = ({ route }: ProfileScreenProps) => {
	const { profile } = route.params;

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='px-4'>
				<SearchbarHeader
					autoFocus={false}
					text='Search in profile...'
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
					<ProfileHeader profile={profile} />
					<TopicsAndSubTopics profile={profile} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProfileScreen;
