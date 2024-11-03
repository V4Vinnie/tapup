import { Alert, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { mode, themeColors } from '../../utils/constants';
import Modal from 'react-native-modal';
import AppInput from '../../components/AppInput';
import React from 'react';
import { useAuth } from '../../providers/AuthProvider';

type Props = {
	title: string;
	showLoginModal: boolean;
	setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
	action: (mail: string, password: string) => void;
};

const LoginBeforeActionModal = ({
	title,
	showLoginModal,
	setShowLoginModal,
	action,
}: Props) => {
	const { user, handleUpdateUser } = useAuth();

	const [loginEmail, setLoginEmail] = React.useState(user?.email || '');
	const [loginPassword, setLoginPassword] = React.useState('');

	return (
		<Modal
			avoidKeyboard
			isVisible={showLoginModal}
			onBackdropPress={() => setShowLoginModal(false)}
			onBackButtonPress={() => setShowLoginModal(false)}>
			<View className='bg-dark-primaryBackground p-8 rounded-lg'>
				<Text className='text-lg text-white'>{title}</Text>
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

				<AppButton
					title='Login'
					onPress={() => action(loginEmail, loginPassword)}
				/>
			</View>
		</Modal>
	);
};

export default LoginBeforeActionModal;
