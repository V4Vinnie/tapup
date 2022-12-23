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
import { ProfielPic } from '../../Components/ProfilePic';
import { bodyText, buttonStyle, containerStyle } from '../../style';

import BG from '../../assets/logo/SignUpBG.png';
import { Colors } from '../../Constants/Colors';
import { width } from '../../utils/UseDimensoins';
import { useState } from 'react';

export const SignUp = ({ navigation, signUp }) => {
	const [email, setEmail] = useState('e');
	const [password, setPassword] = useState('e');

	const submitSignIn = () => {
		signUp({
			name: 'User',
			email: email,
			profilePic:
				'http://c.files.bbci.co.uk/C870/production/_112921315_gettyimages-876284806.jpg',
		});
		navigation.navigate('sign-up-topic');
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
					<ProfielPic size={230} />
					<View style={{ paddingTop: 80 }}>
						<View>
							<TextInput
								keyboardType='email-address'
								editable
								value={email}
								onChange={setEmail}
								style={{ width: '100%', ...styles.inputStyle }}
								placeholder='Email'
								placeholderTextColor='#FFD1E5'
							/>
							<TextInput
								secureTextEntry
								editable
								value={password}
								onChange={setPassword}
								style={styles.inputStyle}
								placeholder='Password'
								placeholderTextColor='#FFD1E5'
							/>
						</View>
						<View style={{ alignSelf: 'flex-end', marginTop: 60 }}>
							<Pressable
								onPress={() => submitSignIn()}
								style={
									password === '' || email === ''
										? { opacity: 0.5, ...styles.signUp }
										: styles.signUp
								}
								disabled={password === '' || email === ''}
							>
								<Text style={{ ...bodyText, color: Colors.primary.pink }}>
									Sign up
								</Text>
							</Pressable>
							<View style={styles.logInContainer}>
								<Text style={styles.subTitle}>Already have an account? </Text>
								<Pressable onPress={() => navigation.navigate('start')}>
									<Text style={bodyText}>Log in</Text>
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
});
