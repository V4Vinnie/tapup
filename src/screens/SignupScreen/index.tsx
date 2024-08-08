import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, Text, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import {
	scrollViewContainer,
	scrollViewContentContainer,
} from '../LoginScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Swiper from 'react-native-swiper';
import RegisterUserDetails from './RegisterUserDetails';
import CustomSwiperDot from '../../components/CustomSwiperDot';
import useKeyboard from '../../hooks/useKeyboard';
import AddCompanyCode from './AddCompanyCode';
import AddInformation from './AddInformation';
import { useAuth } from '../../providers/AuthProvider';
import { useCompany } from '../../providers/CompanyProvider';
import AppButton from '../../components/AppButton';

type Props = {};

const SignupScreen = (props: Props) => {
	const { width, height } = Dimensions.get('window');
	const { isKeyboardOpen } = useKeyboard();
	const { handleSignup, authErrors } = useAuth();
	const { company } = useCompany();

	const [email, setEmail] = useState('');
	const [username, setProfilename] = useState('');
	const [password, setPassword] = useState('');
	//const [image, setImage] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [fullName, setFullName] = useState('');
	const [jobType, setJobType] = useState('');

	const swiper = useRef<Swiper>(null);

	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const signUp = async () => {
		//if (!image) {
		//	Alert.alert('Error', 'Please select a profile picture');
		//	return;
		//}
		setIsSending(true);
		handleSignup(
			username,
			email,
			password,
			//image,
			company,
			fullName!,
			jobType!
		).finally(() => {
			setIsSending(false);
		});
	};

	useEffect(() => {
		if (authErrors) {
			swiper.current?.scrollTo(0);
		}
	}, [authErrors]);

	return (
		<SafeAreaView style={scrollViewContainer}>
			<AppHeader headerWithBack title={'Signup'} />
			<View className='flex-1 items-center justify-center bg-dark-primaryBackground'>
				<FocusAwareStatusBar
					translucent
					backgroundColor='transparent'
					barStyle='light-content'
				/>

				<View className='w-full h-4/5'>
					<Swiper
						ref={swiper}
						style={{ flex: 1 }}
						showsPagination
						paginationStyle={{
							bottom: 10,
						}}
						dot={<CustomSwiperDot />}
						activeDot={<CustomSwiperDot active />}
						scrollEnabled={false}
						loop={false}
						showsButtons={false}>
						<RegisterUserDetails
							username={username}
							setProfilename={setProfilename}
							email={email}
							setEmail={setEmail}
							password={password}
							setPassword={setPassword}
							swiper={swiper}
						/>
						<AddCompanyCode
							addButtonPress={() => swiper?.current?.scrollBy(1)}
							canSkip
							skipButtonPress={() => swiper?.current?.scrollBy(1)}
						/>
						<AddInformation
							setFullName={setFullName}
							fullName={fullName}
							setJobType={setJobType}
							jobType={jobType}
							signUp={signUp}
							isSending={isSending}
						/>
					</Swiper>
				</View>

				<View className='mt-4 flex-row items-center justify-center'>
					<Text className='text-base font-inter-regular text-dark-subTextColor'>
						{'Already have an account?'}
					</Text>
					<Pressable
						onPress={() => {
							navigate(Routes.LOGIN);
						}}>
						<Text className='text-base font-inter-bold text-dark-textColor'>
							{' Login'}
						</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default SignupScreen;