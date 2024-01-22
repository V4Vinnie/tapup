import { useMemo, useState } from 'react';
import {
	Image,
	StyleProp,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import AppHeader from '../../components/AppHeader';
import AppInput from '../../components/AppInput';
import Icon from 'react-native-vector-icons/AntDesign';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { Routes, RootStackParamList } from '../../navigation/Routes';
import AppButton from '../../components/AppButton';
import { mode, themeColors } from '../../utils/constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {};

const LoginScreen = (props: Props) => {
	const { status, handleLogin } = useAuth();
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	//Internal States
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [isSending, setIsSending] = useState(false);

	const logIn = async () => {
		setIsSending(true);
		handleLogin(email, password).finally(() => {
			setIsSending(false);
		});
		// TODO: MAKE ERROR MODAL
	};

	const disabledState = useMemo(() => {
		return isSending || email === '' || password.length < 6 ? 0.5 : 1;
	}, [email, password, isSending]);
	return (
		<KeyboardAwareScrollView
			keyboardShouldPersistTaps={'handled'}
			style={scrollViewContainer}
			contentContainerStyle={scrollViewContentContainer}
			showsVerticalScrollIndicator={false}>
			<View className='flex-1 items-center bg-dark-primaryBackground'>
				<AppHeader transparentHeader headerWithBack title={'Login'} />
				<FocusAwareStatusBar
					translucent
					backgroundColor='transparent'
					barStyle='dark-content'
				/>

				<View className='w-4/5 h-full pb-8 pt-52 justify-between'>
					<View>
						<Text className='text-3xl font-inter-bold text-center text-dark-textColor'>
							{'Welcome back!'}
						</Text>

						<Text className='text-base font-inter-medium text-center text-dark-subTextColor'>
							{'Sign in to your account.'}
						</Text>

						<AppInput
							containerProps={{
								className: 'mt-6',
							}}
							leftIcon={{
								component: (
									<Icon
										name='mail'
										size={16}
										color={'white'}
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
										color={'white'}
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

						<AppButton
							buttonProps={{
								className: 'mt-4',
								disabled: isSending,
								style: {
									opacity: disabledState,
								},
							}}
							title={'Login'}
							onPress={() => logIn()}
						/>
						{status && (
							<View
								className={`w-full mt-2 p-2 rounded-full ${
									status.type === 'error'
										? 'bg-red-400'
										: 'bg-green-400'
								}`}>
								<Text
									className={`text-base text-center font-inter-medium text-white`}>
									{status.message}
								</Text>
							</View>
						)}
					</View>

					<View>
						<View className='flex-row items-center justify-center mt-4'>
							<Text className='text-base font-inter-regular text-dark-subTextColor'>
								{"Don't have an account?"}
							</Text>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate(Routes.SIGNUP);
								}}>
								<Text className='text-base font-inter-bold text-dark-textColor'>
									{' Signup'}
								</Text>
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate(Routes.FORGOT_PASSWORD);
							}}>
							<Text className='text-base text-center font-inter-bold text-dark-textColor mt-2'>
								{' Forgot Password'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

export const scrollViewContainer: StyleProp<ViewStyle> = {
	flex: 1,
	backgroundColor: themeColors[mode].primaryBackground,
};
export const scrollViewContentContainer: StyleProp<ViewStyle> = {
	flexGrow: 1,
	backgroundColor: themeColors[mode].primaryBackground,
};

export default LoginScreen;
