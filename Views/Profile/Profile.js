import {
	Image,
	ImageBackground,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { width } from '../../utils/UseDimensoins';
import BGDark from '../../assets/logo/darkBG.png';
import { ProfielPic } from '../../Components/ProfilePic';
import { useUser } from '../../Providers/UserProvider';
import { Back } from '../../Components/Back';
import { Colors } from '../../Constants/Colors';
import { sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth, storage } from '../../firebaseConfig';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import tempBadges from '../../assets/badges/template.png';
import { updateUser } from '../../utils/fetch';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { ref, uploadBytes } from 'firebase/storage';

export const Profile = ({ navigation, setLoggedIn }) => {
	const { user, setUser } = useUser();

	const logOut = async () => {
		signOut(auth).then(() => {
			setLoggedIn(false);
			navigation.navigate('start');
		});
	};

	const sendResetPass = async () => {
		await sendPasswordResetEmail(auth, user.email);
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
					format: SaveFormat.PNG,
				}
			);

			const response = await fetch(manipResult.uri);
			const blobFile = await response.blob();

			const storageRef = ref(storage, `users/${user.id}/profilePicture.png`);
			await uploadBytes(storageRef, blobFile).then((snapshot) => {
				const onlineImg = `users%2F${user.id}%2FprofilePicture.png`;
				setUser({
					...user,
					profilePic: { isLocal: true, url: manipResult.uri },
				});
				updateUser({ ...user, profilePic: onlineImg });
			});
		}
	};

	return (
		<ImageBackground
			resizeMode='cover'
			imageStyle={{
				width: width,
				height: 226.5,
				top: -50,
			}}
			source={BGDark}
		>
			<SafeAreaView>
				<View style={styles.headWrapper}>
					<Back navigate={() => navigation.navigate('home')} />
					<Text style={styles.username}>{user.name}</Text>
					<Pressable
						style={{ width: 50, alignItems: 'flex-end' }}
						onPress={() => logOut()}
					>
						<Feather name='log-out' size={24} color='white' />
					</Pressable>
				</View>
				<Pressable
					onPress={() => pickUserImg()}
					style={styles.profilePictureWrapper}
				>
					<ProfielPic size={width / 3} img={user.profilePic} isEditable />
				</Pressable>
				<View style={styles.profileSection}>
					<Text style={styles.badgesTitle}>Badges</Text>
					<View style={styles.badgesWrapper}>
						<Image style={styles.badgesTempImg} source={tempBadges} />
					</View>
				</View>
				<Pressable
					onPress={() => sendResetPass()}
					style={styles.resetPassButton}
				>
					<Text style={styles.resetPassText}>Change password</Text>
				</Pressable>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	headWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
	},

	username: {
		fontSize: 32,
		fontWeight: 'bold',
		color: Colors.primary.white,
	},

	logOut: {
		color: Colors.primary.white,
	},

	profilePictureWrapper: {
		marginTop: 30,
		alignSelf: 'center',
		borderRadius: 60,
	},

	profileSection: {
		marginTop: 35,
		alignItems: 'center',
	},

	badgesWrapper: {},

	badgesTitle: {
		fontSize: 30,
		color: Colors.primary.bleuBottom,
	},

	badgesTempImg: {
		width: width - 40,
		height: 200,
		resizeMode: 'contain',
	},

	resetPassButton: {
		backgroundColor: Colors.primary.pink,
		alignSelf: 'center',
		paddingHorizontal: 30,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 50,
	},

	resetPassText: {
		color: Colors.primary.white,
		fontSize: 24,
	},
});
