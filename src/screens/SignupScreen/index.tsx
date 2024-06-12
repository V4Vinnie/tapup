import { useMemo, useRef, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../providers/AuthProvider';
import {
	scrollViewContainer,
	scrollViewContentContainer,
} from '../LoginScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { themeColors } from '../../utils/constants';
import Swiper from 'react-native-swiper';
import RegisterUserDetails from './RegisterUserDetails';
import AddCompanyCode from './AddCompanyCode';
import CustomSwiperDot from '../../components/CustomSwiperDot';
import useKeyboard from '../../hooks/useKeyboard';

type Props = {};

const SignupScreen = (props: Props) => {
	const { width, height } = Dimensions.get('window');
	const { isKeyboardOpen } = useKeyboard();

	const [email, setEmail] = useState('');
	const [username, setProfilename] = useState('');
	const [password, setPassword] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [image, setImage] = useState<string | null>(null);

	const swiper = useRef<Swiper>(null);

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
				{!isKeyboardOpen && (
					<AppHeader
						transparentHeader={true}
						headerWithBack={true}
						title={'Signup'}
					/>
				)}
				<FocusAwareStatusBar
					translucent
					backgroundColor='transparent'
					barStyle='light-content'
				/>

				<View className='h-full py-2 justify-between pb-8 pt-40'>
					<Swiper
						ref={swiper}
						height={350}
						width={width}
						containerStyle={{
							marginBottom: isKeyboardOpen ? 30 : 80,
							paddingBottom: isKeyboardOpen ? 20 : undefined,
						}}
						showsPagination
						dot={<CustomSwiperDot />}
						activeDot={<CustomSwiperDot active />}
						scrollEnabled={false}
						showsButtons={false}>
						<RegisterUserDetails
							image={image}
							setModalOpen={setModalOpen}
							username={username}
							setProfilename={setProfilename}
							email={email}
							setEmail={setEmail}
							password={password}
							setPassword={setPassword}
							status={status}
							disabledState={disabledState}
							isSending={isSending}
							swiper={swiper}
						/>
						<AddCompanyCode />
					</Swiper>

					{!isKeyboardOpen && (
						<View className='flex-row items-center justify-center'>
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
					)}
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
								name='camera-alt'
								size={24}
								color={themeColors.primaryColor[100]}
							/>
							<Text className='text-base font-inter-regular text-center text-dark-textColor leading-4 mt-2'>
								Take Photo
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className='flex items-center w-20 bg-dark-primaryBackground p-2 rounded-lg'
							onPress={handleRemovePhoto}>
							<MaterialIcon
								name='delete'
								size={24}
								color={themeColors.primaryColor[100]}
							/>
							<Text className='text-base font-inter-regular text-center text-dark-textColor leading-4 mt-2'>
								Remove Photo
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</KeyboardAwareScrollView>
	);
};

export default SignupScreen;
