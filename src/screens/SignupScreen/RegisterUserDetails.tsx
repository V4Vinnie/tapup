import { Text, Pressable, View } from 'react-native';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { assets } from '../../../assets/Assets';
//import ProfilePicture from './ProfilePicture';
import Swiper from 'react-native-swiper';
import useKeyboard from '../../hooks/useKeyboard';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { maxChars } from '../../utils/constants';

type Props = {
	//image: string;
	//setImage: (image: string) => void;
	username: string;
	setProfilename: React.Dispatch<React.SetStateAction<string>>;
	email: string;
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	password: string;
	setPassword: React.Dispatch<React.SetStateAction<string>>;
	swiper: React.RefObject<Swiper>;
};

const RegisterUserDetails = ({
	//image,
	//setImage,
	username,
	setProfilename,
	email,
	setEmail,
	password,
	setPassword,
	swiper,
}: Props) => {
	const { isKeyboardOpen } = useKeyboard();
	const { authErrors } = useAuth();
	const [hidePassword, setHidePassword] = useState(true);

	const disabledState = useMemo(() => {
		return (
			username.isBlank ||
			password.length < 6 ||
			email.isBlank ||
			//image.isBlank ||
			!email.isValidEmail ||
			username.startsWithOrEndsWithSpaces ||
			password.startsWithOrEndsWithSpaces ||
			email.startsWithOrEndsWithSpaces
		);
	}, [username, password, email]);

	return (
		<View
			className={`w-4/5 mx-auto h-[85%] flex ${authErrors && 'h-full'}`}>
			<View>
				{/*
				{!isKeyboardOpen && (
					<View className='relative w-28 mx-auto'>
						<ProfilePicture
							image={
								image
									? { uri: image }
									: assets.profile_placeholder
							}
							setImage={setImage}
						/>
					</View>
				)}
				*/}
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
							<AntDesignIcon
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
							setProfilename(username);
						},
						maxLength: maxChars.username,
					}}
				/>
				<AppInput
					containerProps={{
						className: 'mt-2',
					}}
					leftIcon={{
						component: (
							<AntDesignIcon
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
						autoCapitalize: 'none',
						maxLength: maxChars.email,
					}}
				/>

				<AppInput
					containerProps={{
						className: 'mt-2',
					}}
					leftIcon={{
						component: (
							<AntDesignIcon
								name='lock'
								size={16}
								color={'gray'}
							/>
						),
					}}
					rightIcon={{
						component: (
							<Pressable
								onPress={() => setHidePassword(!hidePassword)}>
								{hidePassword ? (
									<EntypoIcon
										name='eye-with-line'
										size={18}
										color={'gray'}
									/>
								) : (
									<EntypoIcon
										name='eye'
										size={18}
										color={'gray'}
									/>
								)}
							</Pressable>
						),
					}}
					inputProps={{
						placeholder: 'Password',
						value: password,
						secureTextEntry: hidePassword,
						onChangeText: (password) => {
							setPassword(password);
						},
						maxLength: maxChars.password,
					}}
				/>
			</View>
			<View>
				<AppButton
					buttonProps={{
						disabled: disabledState,
						className: 'mt-4',
						style: {
							opacity: disabledState ? 0.5 : 1,
						},
					}}
					title={'Next'}
					onPress={() => {
						console.log('Swiper ref:', swiper.current);
						swiper.current?.scrollBy(1);
					}}
				/>
				{!authErrors?.userDetails && isKeyboardOpen && (
					<Text
						className={
							'text-sm font-inter-medium text-white text-center my-2 h-16'
						}>
						Password must be at least 6 characters long and don't
						forget to add a profile picture.
					</Text>
				)}
				{authErrors?.userDetails && (
					<Text
						className={
							'text-sm font-inter-medium text-red-500 text-center my-2 h-16'
						}>
						{authErrors?.userDetails.message}
					</Text>
				)}
			</View>
		</View>
	);
};

export default RegisterUserDetails;