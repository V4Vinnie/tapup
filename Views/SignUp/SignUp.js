import {
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	TextInput,
	View,
	Pressable,
	KeyboardAvoidingView,
	ScrollView,
} from 'react-native';
import { ProfielPic } from '../../Components/ProfilePic';
import { bodyText, buttonStyle, containerStyle } from '../../style';

import BG from '../../assets/bleuBG.png';
import { Colors } from '../../Constants/Colors';
import { width } from '../../utils/UseDimensoins';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes } from 'firebase/storage';
import { auth, DB, storage } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { fetchUser, updateUser } from '../../utils/fetch';
import { ROLES } from '../../Constants/Roles';
import { Back } from '../../Components/Back';
import { RoleSelect } from '../../Components/RoleSelect';
import { InterestPills } from '../../Components/InterestPills';
import { MediumText } from '../../Components/Text/MediumText';
import { RegularText } from '../../Components/Text/RegularText';
import * as CompressImg from 'react-native-compressor';

export const SignUp = ({ navigation, signUp }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [selectedTopics, setSelectedTopics] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);

	const [role, setRole] = useState('Select');

	const [userImg, setUserImg] = useState('UI%2FprofilePic.png');

	const [isSending, setIsSending] = useState(false);

	const submitSignIn = async () => {
		setIsSending(true);
		let id;
		let _user;

		let error = null;

		let onlineImg = 'UI%2FprofilePic.png';

		await createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				id = userCredential.user.uid;
				await setDoc(doc(DB, 'users', id), {
					id: id,
					role: ROLES.USER,
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

			const storageRef = ref(storage, `users/${id}/profilePicture.png`);
			await uploadBytes(storageRef, blobFile).then((snapshot) => {
				onlineImg = `users%2F${id}%2FprofilePicture.png`;
				setErrorMessage(null);
			});
		}

		if (!error) {
			const newUser = {
				profilePic: onlineImg,
				role: ROLES.USER,
				compagnyRole: role,
				name: name,
				email: email,
				selectedTopics: selectedTopics,
				watchedFrames: [],
				badges: [],
				..._user,
			};
			updateUser(newUser);

			signUp(newUser);

			navigation.navigate('onboard');
			setIsSending(false);
		} else {
			setErrorMessage(error);
		}
		setIsSending(false);
	};

	const clickTopic = (tap) => {
		let _selectedTopics = [...selectedTopics];
		if (selectedTopics.includes(tap.id)) {
			const _newSelectedTopics = _selectedTopics.filter((id) => id !== tap.id);
			setSelectedTopics(_newSelectedTopics);
		} else {
			_selectedTopics.push(tap.id);
			setSelectedTopics(_selectedTopics);
		}
	};

	const pickUserImg = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			const manipResult = await CompressImg.Image.compress(
				result.assets[0].uri,
				{
					maxWidth: 500,
				}
			);

			setUserImg({ isLocal: true, url: manipResult });
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
					height: '100%',
					top: -300,
					zIndex: 0,
				}}
				source={BG}
			>
				<SafeAreaView style={{ height: '100%' }}>
					<View
						style={{
							height: 170,
							position: 'absolute',
							backgroundColor: Colors.primary.bleuBottom,
							width: '100%',
						}}
					></View>
					<View style={{ padding: 15 }}>
						<Back navigate={() => navigation.goBack()} />
					</View>
					<View
						style={{
							...containerStyle,
							backgroundColor: 'none',
							width: width,
							zIndex: 10,
							paddingHorizontal: 20,
						}}
					>
						<View style={{ zIndex: 3 }}>
							<ProfielPic
								clickPencil={pickUserImg}
								size={180}
								img={userImg}
								isEditable
								pencilPlace={{ top: -20, left: 60 }}
								pencilSize={60}
							/>
						</View>

						<ScrollView
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							style={{ width: '100%', overflow: 'visible', zIndex: 1 }}
						>
							<View>
								<MediumText
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
								</MediumText>
								<TextInput
									editable
									value={name}
									onChangeText={
										isSending ? null : (newText) => setName(newText)
									}
									style={{ width: '100%', ...styles.inputStyle }}
									placeholder='Name'
									placeholderTextColor='rgba(255, 255, 255, 0.50)'
								/>

								<TextInput
									keyboardType='email-address'
									editable
									value={email}
									onChangeText={
										isSending ? null : (newText) => setEmail(newText)
									}
									style={{ width: '100%', ...styles.inputStyle }}
									placeholder='Email'
									placeholderTextColor='rgba(255, 255, 255, 0.50)'
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
									placeholderTextColor='rgba(255, 255, 255, 0.50)'
								/>

								<RoleSelect role={role} setRole={setRole} />
							</View>
							<View style={{ marginTop: 25 }}>
								<RegularText style={{ marginBottom: 5, fontSize: 16 }}>
									Select topics
								</RegularText>
								<InterestPills
									clickTopic={clickTopic}
									selectedTopics={selectedTopics}
								/>
							</View>
							<View style={{ marginTop: 30 }}>
								<Pressable
									onPress={() => submitSignIn()}
									style={
										password === '' ||
										email === '' ||
										isSending ||
										name === '' ||
										role === 'Select'
											? { opacity: 0.5, ...styles.signUp }
											: styles.signUp
									}
									disabled={
										password === '' ||
										email === '' ||
										name === '' ||
										role === 'Select'
											? true
											: isSending
									}
								>
									<MediumText
										style={{
											...bodyText,
											color: Colors.primary.white,
											textAlign: 'center',
										}}
									>
										Sign up
									</MediumText>
								</Pressable>
								<View style={styles.logInContainer}>
									<RegularText style={styles.subTitle}>
										Already have an account?{' '}
									</RegularText>
									<Pressable
										disabled={isSending}
										onPress={() => navigation.navigate('login')}
									>
										<MediumText style={bodyText}>Log in</MediumText>
									</Pressable>
								</View>
							</View>
						</ScrollView>
					</View>
				</SafeAreaView>
			</ImageBackground>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		...containerStyle,
		backgroundColor: Colors.primary.white,
	},

	inputStyle: {
		padding: 10,
		paddingVertical: 5,
		borderColor: Colors.primary.white,
		borderWidth: 2,
		borderRadius: 15,
		...bodyText,
		marginBottom: 15,
	},

	signUp: {
		...buttonStyle,
		backgroundColor: Colors.primary.pink,
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
