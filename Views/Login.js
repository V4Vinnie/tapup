import {
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
	Pressable,
	KeyboardAvoidingView,
} from 'react-native';
import { bodyText, buttonStyle, containerStyle } from '../style';

import BG from '../assets/logo/SignUpBG.png';
import { Colors } from '../Constants/Colors';
import { width } from '../utils/UseDimensoins';
import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { fetchUser } from '../utils/fetch';
import { Logo } from '../Components/SVG/Logo';

export const Login = ({ navigation }) => {
	const [email, setEmail] = useState('cielbrys@gmail.com');
	const [password, setPassword] = useState('Kortrijk8500');
	const [errorMessage, setErrorMessage] = useState(null);

	const [isSending, setIsSending] = useState(false);

	const logIn = async () => {
		setIsSending(true);
		await signInWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				// Signed in
				const _user = await fetchUser(userCredential.user.uid);
				setUser(_user);
				// ...
			})
			.catch((error) => {
				console.log(error);
				setErrorMessage(error.code);
			});

		if (directLogin) {
			setLoggedIn(true);
			navigation.navigate('home');
		}
		setIsSending(false);
	};

	return (
		<KeyboardAvoidingView
			keyboardVerticalOffset={-200}
			behavior='position'
			style={styles.container}
		>
			<ImageBackground
				resizeMode='cover'
				imageStyle={{
					height: '75%',
					marginTop: '55%',
				}}
				source={BG}
			>
				<View
					style={{
						...containerStyle,
						backgroundColor: 'none',
						width: width,
					}}
				>
					<View style={styles.logoWrapper}>
						<Logo width={70} />
					</View>
					<View style={{ paddingTop: 40 }}>
						<View>
							<Text
								style={{
									marginLeft: 10,
									height: 15,
									fontSize: 14,
									marginBottom: 10,
									color: Colors.primary.white,
									textDecorationLine: 'underline',
								}}
							>
								{errorMessage === 'auth/invalid-email'
									? 'Please fill a valid email in'
									: errorMessage}
							</Text>
							<TextInput
								keyboardType='email-address'
								editable
								value={email}
								onChangeText={isSending ? null : (newText) => setEmail(newText)}
								style={{ width: '100%', ...styles.inputStyle }}
								placeholder='Email'
								placeholderTextColor='#FFD1E5'
							/>
							<TextInput
								secureTextEntry
								editable
								value={password}
								onChangeText={
									isSending ? null : (newText) => setPassword(newText)
								}
								style={styles.inputStyle}
								placeholder='Password'
								placeholderTextColor='#FFD1E5'
							/>
						</View>
						<View style={{ alignSelf: 'flex-end', marginTop: 60 }}>
							<Pressable
								onPress={() => logIn(navigation, true, email, password)}
								style={
									password === '' || email === '' || isSending
										? { opacity: 0.5, ...styles.signUp }
										: styles.signUp
								}
								disabled={password === '' || email === '' ? true : isSending}
							>
								<Text style={{ ...bodyText, color: Colors.primary.pink }}>
									Log in
								</Text>
							</Pressable>
							<View style={styles.logInContainer}>
								<Text style={styles.subTitle}>No account yet? </Text>
								<Pressable
									disabled={isSending}
									onPress={() => navigation.navigate('sign-up')}
								>
									<Text style={bodyText}>Sign Up</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</View>
			</ImageBackground>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		...containerStyle,
	},

	inputStyle: {
		padding: 12,
		borderColor: Colors.primary.white,
		borderWidth: 2,
		borderRadius: 18,
		...bodyText,
		marginBottom: 18,
	},

	signUp: {
		...buttonStyle,
		backgroundColor: Colors.primary.white,
	},

	logInContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 18,
	},

	subTitle: {
		opacity: 0.8,
		...bodyText,
	},

	logoWrapper: {
		backgroundColor: Colors.primary.white,
		padding: 30,
		alignSelf: 'center',
		borderRadius: 100,
		height: 200,
		width: 200,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 70,
	},
});
