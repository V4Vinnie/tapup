import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import SearchbarHeader from '../../components/SearchbarHeader';
import ProfileHeader from '../../components/ProfileHeader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Routes';

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
					{/* TOPICS and SUBTOPICS */}
				</View>
			</ScrollView>
			{/* TODO: Add search in profile functionality */}
		</SafeAreaView>
	);
};

export default ProfileScreen;
