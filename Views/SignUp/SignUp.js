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
import * as ImagePicker from 'expo-image-picker';
import { shortUid, userUid } from '../../utils/uid';
import { ref, uploadBytes } from 'firebase/storage';
import { auth, DB, storage } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fetchUser } from '../../utils/fetch';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

export const SignUp = ({ navigation, signUp }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState(null);

	const [userImg, setUserImg] = useState(
		'https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/UI%2FprofilePic.png?alt=media'
	);

	const [isSending, setIsSending] = useState(false);

	const submitSignIn = async () => {
		setIsSending(true);
		let id;
		let _user;

		let error = null;

		let onlineImg =
			'https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/UI%2FprofilePic.png?alt=media';

		await createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				id = userCredential.user.uid;
				await setDoc(doc(DB, 'users', id), {
					id: id,
				});
				_user = await fetchUser(id);
				setErrorMessage(null);
			})
			.catch((_error) => {
				error = _error.code;
				setIsSending(false);
			});

		if (userImg !== onlineImg) {
			const response = await fetch(userImg);
			const blobFile = await response.blob();

			const fileNameSplit = userImg.split('/');

			const storageRef = ref(
				storage,
				`users/${id}-${fileNameSplit[fileNameSplit.length - 1]}`
			);
			await uploadBytes(storageRef, blobFile).then((snapshot) => {
				onlineImg = `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/users%2F${snapshot.metadata.name}?alt=media`;
				setErrorMessage(null);
			});
		}

		if (!error) {
			signUp({
				name: `User${shortUid()}`,
				email: email,
				profilePic: onlineImg,
				..._user,
			});

			navigation.navigate('sign-up-topic');
			setIsSending(false);
		} else {
			setErrorMessage(error);
		}
		setIsSending(false);
	};

	const pickUserImg = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			const manipResult = await manipulateAsync(
				result.assets[0].uri,
				[{ resize: { width: 500, height: 500 } }],
				{
					compress: 0.4,
					format: SaveFormat.JPEG,
				}
			);

			setUserImg(manipResult.uri);
		}
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
					<Pressable onPress={() => pickUserImg()}>
						<ProfielPic size={230} img={userImg} isEditable />
					</Pressable>
					<View style={{ paddingTop: 80 }}>
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
								onPress={() => submitSignIn()}
								style={
									password === '' || email === '' || isSending
										? { opacity: 0.5, ...styles.signUp }
										: styles.signUp
								}
								disabled={password === '' || email === '' ? true : isSending}
							>
								<Text style={{ ...bodyText, color: Colors.primary.pink }}>
									Sign up
								</Text>
							</Pressable>
							<View style={styles.logInContainer}>
								<Text style={styles.subTitle}>Already have an account? </Text>
								<Pressable
									disabled={isSending}
									onPress={() => navigation.navigate('start')}
								>
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
