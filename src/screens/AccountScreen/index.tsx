import React from 'react';
import {
	Animated,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { useAuth } from '../../providers/AuthProvider';
import SectionHeader from '../../components/SectionHeader';
import ProfileHeader from '../../components/ProfileHeader';
import AccountHeader from '../../components/AccountHeader';

type Props = {};

/*
--- TODO ---
TODO: fix logout error with firebase permissions
TODO: style user information (AccountHeader)
TODO: style logout
*/

const AccountScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { handleLogout, user } = useAuth();

	function logout(): void {
		handleLogout();
	}

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<ScrollView
				className='w-full'
				contentContainerStyle={{
					alignItems: 'center',
					justifyContent: 'center',
				}}
				showsVerticalScrollIndicator={false}>
				<View className='w-full'>
					<SectionHeader title='Your account' />
					<AccountHeader name='Jan Janssens' imageUrl='https://i.pravatar.cc/300' />
					<TouchableOpacity
						className='bg-orange-600 py-3 px-6 rounded-lg mt-5'
						onPress={logout}>
						<Text className='text-white text-lg font-bold'>Logout</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default AccountScreen;