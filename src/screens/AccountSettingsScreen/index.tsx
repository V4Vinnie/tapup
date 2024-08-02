import React, { useEffect } from 'react';
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { mode, themeColors } from '../../utils/constants';
import ProfilePicture from '../SignupScreen/ProfilePicture';
import ChangeSetting from './ChangeSetting';
import { assets } from '../../../assets/Assets';

type Props = {};

const AccountSettingsScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user, handleUpdateUser } = useAuth();
	const [userDetails, setUserDetails] = React.useState({
		name: user?.name || '',
		email: user?.email || '',
		profilePic: user?.profilePic || '',
		fullName: user?.fullName || '',
	});

	return (
		<SafeAreaView className='flex-1 bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='flex-1 w-full'>
				<AppHeader title='Account Settings' headerWithBack />
				<ScrollView
					className='w-full'
					showsVerticalScrollIndicator={false}>
					<View className='px-8 pt-8 h-3/5 flex flex-col justify-between'>
						<ProfilePicture
							image={
								userDetails.profilePic
									? { uri: userDetails.profilePic }
									: assets.profile_placeholder
							}
							setImage={(image) =>
								setUserDetails({
									...userDetails,
									profilePic: image,
								})
							}
						/>
						<ChangeSetting
							icon={
								<MaterialCommunityIcons
									name='account'
									size={20}
									color={themeColors[mode].textColor}
								/>
							}
							maxChars={20}
							title='Username'
							value={userDetails.name}
							onChange={(text) => {
								handleUpdateUser(user?.uid!, 'name', text);
								setUserDetails({
									...userDetails,
									name: text,
								});
							}}
							description='This is the name that will be displayed on your profile.'
						/>
						<ChangeSetting
							icon={
								<MaterialCommunityIcons
									name='email'
									size={20}
									color={themeColors[mode].textColor}
								/>
							}
							maxChars={20}
							title='Email'
							value={userDetails.email}
							onChange={(text) => {
								handleUpdateUser(user?.uid!, 'email', text);
								setUserDetails({
									...userDetails,
									email: text,
								});
							}}
						/>
						<ChangeSetting
							icon={
								<FontAwesome5
									name='user-tie'
									size={20}
									color={themeColors[mode].textColor}
								/>
							}
							maxChars={20}
							title='Full Name'
							value={userDetails.fullName}
							onChange={(text) => {
								handleUpdateUser(user?.uid!, 'fullName', text);
								setUserDetails({
									...userDetails,
									fullName: text,
								});
							}}
						/>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default AccountSettingsScreen;
