import { useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import AppHeader from '../../components/AppHeader';
import AppInput from '../../components/AppInput';
import Icon from 'react-native-vector-icons/AntDesign';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import { scrollViewContentContainer } from '../LoginScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Routes';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {};

const ForgotPasswordScreen = (props: Props) => {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { authErrors, handleForgotPassword } = useAuth();

	//Internal States
	const [email, setEmail] = useState('');
	const [isSending, setIsSending] = useState(false);

	const sendForgotPasswordEmail = () => {
		handleForgotPassword(email, setIsSending);
	};

	return (
		<SafeAreaView className='flex-1 bg-dark-primaryBackground'>
			<AppHeader headerWithBack title={'Password Recovery'} />
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps={'never'}
			contentContainerStyle={scrollViewContentContainer}
			showsVerticalScrollIndicator={false}>
			<View className='flex-1 items-center bg-dark-primaryBackground'>
				<FocusAwareStatusBar
					translucent
					backgroundColor='transparent'
					barStyle='light-content'
				/>

				<View className='w-4/5 grow py-2 justify-center '>
					<Text className='text-3xl font-inter-bold text-dark-textColor text-center mb-4'>
						{'Forgot Password'}
					</Text>

					<Text className='text-base text-center font-inter-medium text-dark-subTextColor'>
						{
							'Enter your email and we will send you instructions on how to reset it.'
						}
					</Text>

					<AppInput
						containerProps={{
							className: 'mt-6',
						}}
						leftIcon={{
							component: (
								<Icon name='mail' size={16} color={'white'} />
							),
						}}
						inputProps={{
							placeholder: 'Email address',
							value: email,
							keyboardType: 'email-address',
							onChangeText: (email) => {
								setEmail(email);
							},
							autoCapitalize: 'none',
						}}
					/>

					<AppButton
						buttonProps={{
							className: 'mt-4',
							disabled: isSending,
						}}
						title={
							authErrors?.type === 'success'
								? 'Resend link'
								: 'Send link'
						}
						onPress={() => sendForgotPasswordEmail()}
					/>
					{authErrors && (
						<Text
							className={`text-base text-center mt-2 font-semibold ${
								authErrors.type === 'error'
									? 'text-red-500'
									: 'text-green-600'
							}`}>
							{authErrors.message}
						</Text>
					)}
					{authErrors?.type === 'success' && (
						<Text
							className={`text-sm font-inter-regular text-center opacity-60 text-dark-textColor`}>
							{`Didn't receive an email? Check your spam folder.`}
						</Text>
					)}
				</View>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
};

export default ForgotPasswordScreen;
