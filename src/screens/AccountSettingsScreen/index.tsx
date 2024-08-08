import React, { useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
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
import {
	maxChars,
	mode,
	primaryColor,
	themeColors,
} from '../../utils/constants';
import ProfilePicture from '../SignupScreen/ProfilePicture';
import ChangeSetting from './ChangeSetting';
import { assets } from '../../../assets/Assets';
import Modal from 'react-native-modal';
import AppInput from '../../components/AppInput';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../database/Firebase';
import { useCompany } from '../../providers/CompanyProvider';
import DeleteOrAddSetting from './DeleteOrAddSetting';

type Props = {};

const AccountSettingsScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user, handleUpdateUser, handleChangeProfilePic } = useAuth();
	const { company, setCompany } = useCompany();
	const [showLoginModal, setShowLoginModal] = React.useState(false);
	const [userDetails, setUserDetails] = React.useState({
		name: user?.name || '',
		email: user?.email || '',
		profilePic: user?.profilePic || '',
		fullName: user?.fullName || '',
		jobType: user?.companyInfo?.jobType || '',
	});
	const [tempEmail, setTempEmail] = React.useState('');
	const [loginEmail, setLoginEmail] = React.useState(user?.email || '');
	const [loginPassword, setLoginPassword] = React.useState('');

	const changeEmail = (text: string) => {
		if (!text.isValidEmail) {
			Alert.alert('Invalid Email', 'Please enter a valid email address');
			return;
		}
		setTempEmail(text);
		setTimeout(() => {
			setShowLoginModal(true);
		}, 1000);
	};

	function loginAndChangeEmail(): void {
		signInWithEmailAndPassword(auth, loginEmail, loginPassword)
			.then(() => {
				handleUpdateUser(user?.uid!, 'email', tempEmail);
				setUserDetails({
					...userDetails,
					email: tempEmail,
				});
				setLoginEmail(tempEmail);
				setShowLoginModal(false);
			})
			.catch((error) => {
				Alert.alert('Something went wrong', 'Please try again');
			});
	}

	function changeProfileImage(image: string): void {
		handleChangeProfilePic(image).then((url) => {
			if (!url) {
				Alert.alert('Something went wrong', 'Please try again');
				return;
			}
			setUserDetails({
				...userDetails,
				profilePic: url,
			});
			Alert.alert(
				'Profile Picture Updated',
				'Your profile picture has been updated. It may take a few minutes to reflect.'
			);
		});
	}

	return (
		<>
			<SafeAreaView className='flex-1 bg-dark-primaryBackground'>
				<FocusAwareStatusBar translucent barStyle={'light-content'} />
				<View className='flex-1 w-full'>
					<AppHeader title='Account Settings' headerWithBack />
					<ScrollView
						className='w-full'
						showsVerticalScrollIndicator={false}>
						<View className='px-8 pt-8 h-3/5 flex flex-col justify-between'>
							{/*
							<ProfilePicture
								image={
									userDetails.profilePic
										? { uri: userDetails.profilePic }
										: assets.profile_placeholder
								}
								setImage={changeProfileImage}
							/>
							*/}
							<ChangeSetting
								icon={
									<FontAwesome5
										name='user-alt'
										size={20}
										color={themeColors[mode].textColor}
									/>
								}
								maxChars={maxChars.username}
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
									<FontAwesome5
										name='user-tie'
										size={20}
										color={themeColors[mode].textColor}
									/>
								}
								maxChars={maxChars.fullName}
								title='Full Name'
								value={userDetails.fullName}
								onChange={(text) => {
									handleUpdateUser(
										user?.uid!,
										'fullName',
										text
									);
									setUserDetails({
										...userDetails,
										fullName: text,
									});
								}}
							/>
							<ChangeSetting
								icon={
									<Entypo
										name='briefcase'
										size={20}
										color={themeColors[mode].textColor}
									/>
								}
								maxChars={maxChars.jobType}
								title='Job Title'
								value={userDetails.jobType}
								onChange={(text) => {
									handleUpdateUser(
										user?.uid!,
										'companyInfo',
										{
											companyCode:
												user!.companyInfo.companyCode,
											jobType: text,
										}
									);
									setUserDetails({
										...userDetails,
										jobType: text,
									});
								}}
							/>
							<ChangeSetting
								icon={
									<MaterialCommunityIcons
										name='email'
										size={20}
										color={themeColors[mode].textColor}
									/>
								}
								maxChars={maxChars.email}
								title='Email'
								value={userDetails.email}
								onChange={changeEmail}
							/>
							<DeleteOrAddSetting
								icon={
									<MaterialIcons
										name='domain-add'
										size={20}
										color={themeColors[mode].textColor}
									/>
								}
								title='Company'
								value={company?.name}
								noValueText='No company'
								onDelete={() => {
									setCompany(null);
								}}
								onAdd={() => {
									navigate(Routes.HOME);
								}}
							/>
						</View>
					</ScrollView>
				</View>
			</SafeAreaView>
			<Modal
				avoidKeyboard
				isVisible={showLoginModal}
				onBackdropPress={() => setShowLoginModal(false)}
				onBackButtonPress={() => setShowLoginModal(false)}>
				<View className='bg-dark-primaryBackground p-8 rounded-lg'>
					<Text className='text-lg text-white'>
						Please login to change your email
					</Text>
					<AppInput
						containerProps={{ className: 'mt-4' }}
						inputProps={{
							placeholder: 'Email',
							placeholderTextColor: themeColors[mode].textColor,
							style: { color: themeColors[mode].textColor },
							value: loginEmail,
							onChangeText: setLoginEmail,
						}}
						leftIcon={{
							component: (
								<MaterialCommunityIcons
									name='email'
									size={20}
									color={themeColors[mode].textColor}
								/>
							),
						}}
					/>
					<AppInput
						containerProps={{ className: 'my-4' }}
						inputProps={{
							placeholder: 'Password',
							placeholderTextColor: themeColors[mode].textColor,
							style: { color: themeColors[mode].textColor },
							secureTextEntry: true,
							value: loginPassword,
							onChangeText: setLoginPassword,
						}}
						leftIcon={{
							component: (
								<MaterialCommunityIcons
									name='lock'
									size={20}
									color={themeColors[mode].textColor}
								/>
							),
						}}
					/>

					<AppButton title='Login' onPress={loginAndChangeEmail} />
				</View>
			</Modal>
		</>
	);
};

export default AccountSettingsScreen;
