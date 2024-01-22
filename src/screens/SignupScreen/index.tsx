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

type Props = {};

const SignupScreen = (props: Props) => {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isSending, setIsSending] = useState(false);

	const { status, handleSignup } = useAuth();
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const signUp = async () => {
		setIsSending(true);
		handleSignup(username, email, password).finally(() => {
			setIsSending(false);
		});
		// TODO: MAKE STATUS MODAL
	};

	const disabledState = useMemo(() => {
		return (!username && password.length < 6) || !email || isSending
			? 0.5
			: 1;
	}, [username, password, email, isSending]);

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
					<View>
						<Text className='text-3xl font-inter-bold text-center text-dark-textColor'>
							{'Create account!'}
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
									setUsername(username);
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
								disabled: !username && !password && !email,
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
		</KeyboardAwareScrollView>
	);
};

export default SignupScreen;
