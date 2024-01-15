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
import {
	scrollViewContainer,
	scrollViewContentContainer,
} from '../LoginScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Routes';

type Props = {};

const ForgotPasswordScreen = (props: Props) => {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { status, handleForgotPassword } = useAuth();

	//Internal States
	const [email, setEmail] = useState('');
	const [isSending, setIsSending] = useState(false);

	const sendForgotPasswordEmail = () => {
		handleForgotPassword(email, setIsSending);
	};

	return (
		<KeyboardAwareScrollView
			keyboardShouldPersistTaps={'never'}
			style={scrollViewContainer}
			contentContainerStyle={scrollViewContentContainer}
			showsVerticalScrollIndicator={false}>
			<View className='flex-1 items-center bg-light-secondaryBackground'>
				<AppHeader
					headerWithBackground
					headerWithBack
					title={'Password Recovery'}
				/>
				<FocusAwareStatusBar
					translucent
					backgroundColor='transparent'
					barStyle='light-content'
				/>

				<View className='w-4/5 grow py-2 justify-center '>
					<Text className='text-3xl font-medium text-light-textColor text-center mb-4'>
						{'Forgot Password'}
					</Text>

					<Text className='text-base text-center font-normal text-light-subTextColor'>
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
								<Icon name='mail' size={16} color={'gray'} />
							),
						}}
						inputProps={{
							placeholder: 'Email address',
							value: email,
							keyboardType: 'email-address',
							onChangeText: (email) => {
								setEmail(email);
							},
						}}
					/>

					<AppButton
						buttonProps={{
							className: 'mt-4',
							disabled: isSending,
						}}
						title={
							status?.type === 'success'
								? 'Resend link'
								: 'Send link'
						}
						onPress={() => sendForgotPasswordEmail()}
					/>
					{status && (
						<Text
							className={`text-base text-center mt-2 font-semibold ${
								status.type === 'error'
									? 'text-red-500'
									: 'text-green-600'
							}`}>
							{status.message}
						</Text>
					)}
					{status?.type === 'success' && (
						<Text
							className={`text-sm font-normal text-center opacity-60`}>
							{`Didn't receive an email? Check your spam folder.`}
						</Text>
					)}
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default ForgotPasswordScreen;
