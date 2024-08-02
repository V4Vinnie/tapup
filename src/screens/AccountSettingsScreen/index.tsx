import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { useAuth } from '../../providers/AuthProvider';
import ProfileHeader from '../../components/ProfileHeader';
import AppButton from '../../components/AppButton';
import AppHeader from '../../components/AppHeader';
import SettingsTab from './SettingsTab';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { mode, themeColors } from '../../utils/constants';
import ProfilePicture from '../SignupScreen/ProfilePicture';

type Props = {};

const AccountSettingsScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();
	const [userDetails, setUserDetails] = React.useState({
		name: user?.fullName || '',
		email: user?.email || '',
		profilePic: user?.profilePic || '',
	});

	function save(): void {
		// updateUser(userDetails);
	}

	return (
		<SafeAreaView className='flex-1 bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='flex-1 w-full'>
				<AppHeader title='Account Settings' headerWithBack />
				<ScrollView
					className='w-full'
					showsVerticalScrollIndicator={false}>
					<View className='w-full px-8 pt-8 h-3/5 flex flex-col justify-between'>
						<ProfilePicture
							image={{ uri: userDetails.profilePic }}
							setImage={(image) =>
								setUserDetails({
									...userDetails,
									profilePic: image,
								})
							}
						/>
						<AppButton
							title='Save'
							onPress={save}
							buttonProps={{
								className: 'mt-8',
							}}
						/>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default AccountSettingsScreen;
