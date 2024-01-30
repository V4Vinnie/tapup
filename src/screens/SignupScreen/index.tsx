import { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../providers/AuthProvider';
import Icon from 'react-native-vector-icons/AntDesign';
import {
	scrollViewContainer,
	scrollViewContentContainer,
} from '../LoginScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { assets } from '../../../assets/Assets';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import ProfilePicture from './ProfilePicture';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { themeColors } from '../../utils/constants';

type Props = {};

const SignupScreen = (props: Props) => {
	const [email, setEmail] = useState('');
	const [username, seTProfilename] = useState('');
	const [password, setPassword] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [image, setImage] = useState<string | null>(null);

	const { status, handleSignup } = useAuth();
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const signUp = async () => {
		if (!username || !email || !password || !image) return;
		setIsSending(true);
		handleSignup(username, email, password, image).finally(() => {
			setIsSending(false);
		});
		// TODO: MAKE STATUS MODAL
	};

	const handleChoosePhoto = () => {
		setModalOpen(false);
		ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		})
			.then(async (result) => {
				if (result.canceled) return;
				const image = result.assets[0].uri;
				setImage(image);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleTakePhoto = () => {
		ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		})
			.then((result) => {
				if (result.canceled) return;
				setImage(result.assets[0].uri);
			})
			.catch((error) => {
				console.log(error);
			});
		setModalOpen(false);
	};

	const handleRemovePhoto = () => {
		setImage('');
		setModalOpen(false);
	};

	const disabledState = useMemo(() => {
		return !username || password.length < 6 || !email || isSending || !image
			? 0.5
			: 1;
	}, [username, password, email, isSending, image]);

	return (
		<KeyboardAwareScrollView
			keyboardShouldPersistTaps={'handled'}
			style={scrollViewContainer}
			contentContainerStyle={scrollViewContentContainer}
			showsVerticalScrollIndicator={false}>
			<View className='flex-1 items-center bg-dark-primaryBackground'>
				<AppHeader
					transparentHeader={true}
					headerWithBack={true}
					title={'Signup'}
				/>
				<FocusAwareStatusBar
					translucent
					backgroundColor='transparent'
					barStyle='dark-content'
				/>

				<View className='w-4/5 h-full py-2 justify-between pb-8 pt-52'>
					<View className='-mt-12'>
						<ProfilePicture
							image={
								image
									? { uri: image }
									: assets.profile_placeholder
							}
							onPress={() => setModalOpen(true)}
						/>
						<Text className='text-3xl font-inter-bold text-center text-dark-textColor'>
							{'Create account'}
						</Text>

						<Text className='text-base font-inter-medium text-center text-dark-subTextColor'>
							{'Quickly create account'}
						</Text>

						<AppInput
							containerProps={{
								className: 'mt-6',
							}}
							leftIcon={{
								component: (
									<Icon
										name='user'
										size={16}
										color={'gray'}
									/>
								),
							}}
							inputProps={{
								placeholder: 'Username',
								value: username,
								keyboardType: 'default',
								onChangeText: (username) => {
									seTProfilename(username);
								},
							}}
						/>
						<AppInput
							containerProps={{
								className: 'mt-2',
							}}
							leftIcon={{
								component: (
									<Icon
										name='mail'
										size={16}
										color={'gray'}
									/>
								),
							}}
							inputProps={{
								placeholder: 'Email',
								value: email,
								keyboardType: 'email-address',
								onChangeText: (email) => {
									setEmail(email);
								},
							}}
						/>

						<AppInput
							containerProps={{
								className: 'mt-2',
							}}
							leftIcon={{
								component: (
									<Icon
										name='lock'
										size={16}
										color={'gray'}
									/>
								),
							}}
							inputProps={{
								placeholder: 'Password',
								value: password,
								secureTextEntry: true,
								onChangeText: (password) => {
									setPassword(password);
								},
							}}
						/>

						{status && (
							<Text
								className={`text-base font-inter-medium ${
									status.type === 'error'
										? 'text-red-500'
										: 'text-green-500'
								}`}>
								{status.message}
							</Text>
						)}
						<AppButton
							buttonProps={{
								disabled: disabledState === 0.5,
								className: 'mt-4',
								style: {
									opacity: disabledState,
								},
							}}
							title={'Signup'}
							onPress={() => signUp()}
						/>
					</View>

					<View className='flex-row items-center justify-center mt-4'>
						<Text className='text-base font-inter-regular text-dark-subTextColor'>
							{'Already have an account?'}
						</Text>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate(Routes.LOGIN);
							}}>
							<Text className='text-base font-inter-bold text-dark-textColor'>
								{' Login'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<Modal
				isVisible={modalOpen}
				onBackdropPress={() => setModalOpen(false)}
				onDismiss={() => setModalOpen(false)}
				style={{
					width: '80%',
					alignSelf: 'center',
				}}>
				<View className='bg-dark-secondaryBackground rounded-lg py-8'>
					<Text className='text-2xl font-inter-semiBold text-center text-dark-textColor mb-4'>
						Profile Picture
					</Text>
					<View className=' flex flex-row justify-center items-center gap-x-4'>
						<TouchableOpacity
							className='flex items-center w-20 bg-dark-primaryBackground p-2 rounded-lg'
							onPress={handleChoosePhoto}>
							<MaterialIcon
								name='photo-library'
								size={24}
								color={themeColors.primaryColor[100]}
							/>
							<Text className='text-base font-inter-regular text-center text-dark-textColor leading-4 mt-2'>
								Choose Photo
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className='flex items-center w-20 bg-dark-primaryBackground p-2 rounded-lg'
							onPress={handleTakePhoto}>
							<MaterialIcon
								name='photo-library'
								size={24}
								color={themeColors.primaryColor[100]}
							/>
							<Text className='text-base font-inter-regular text-center text-dark-textColor leading-4 mt-2'>
								Choose Photo
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className='flex items-center w-20 bg-dark-primaryBackground p-2 rounded-lg'
							onPress={handleRemovePhoto}>
							<MaterialIcon
								name='photo-library'
								size={24}
								color={themeColors.primaryColor[100]}
							/>
							<Text className='text-base font-inter-regular text-center text-dark-textColor leading-4 mt-2'>
								Choose Photo
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</KeyboardAwareScrollView>
	);
};

export default SignupScreen;
