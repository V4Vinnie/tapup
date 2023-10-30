import {
    Image,
    ImageBackground,
    Pressable,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { width } from '../../utils/UseDimensoins';
import { ProfielPic } from '../../Components/ProfilePic';
import { useUser } from '../../Providers/UserProvider';
import { Colors } from '../../Constants/Colors';
import { signOut } from 'firebase/auth';
import { auth, storage } from '../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { updateUser } from '../../utils/fetch';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { ref, uploadBytes } from 'firebase/storage';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileUpdate } from './ProfileUpdate';

import Square from '../../assets/badges/censored/square.png';
import SquareAng from '../../assets/badges/censored/square_angl.png';
import Star from '../../assets/badges/censored/star.png';
import { SelectGoal } from './SelectGoal';
import { SelectInterests } from './SelectInterests';
import { Fragment, useEffect, useState } from 'react';
import blueBG from '../../assets/bleuBG_small.png';
import { useIsFocused } from '@react-navigation/native';
import { BoldText } from '../../Components/Text/BoldText';
import { MediumText } from '../../Components/Text/MediumText';

const ProfileMain = ({ navigation, setLoggedIn }) => {
	const { user, setUser } = useUser();

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
				updateUser({
					...user,
					profilePic: `users%2F${user.id}%2FprofilePicture.png`,
				});

				setUser({
					...user,
					profilePic: { isLocal: true, url: manipResult.uri },
				});
			});
		}
	};

	const [renderBadges, setRenderBadges] = useState(undefined);

	const isFocused = useIsFocused();

	useEffect(() => {
		let hiddenBadges = [
			Square,
			Star,
			SquareAng,
			Square,
			Star,
			SquareAng,
			Square,
			Star,
		];

		if (user.badges) {
			hiddenBadges.splice(0, user.badges.length);
			let _renderBadges = [...user.badges, ...hiddenBadges];

			setRenderBadges(_renderBadges);
		} else {
			setRenderBadges(hiddenBadges);
		}
	}, [isFocused]);

	return (
		<Fragment>
			<SafeAreaView
				style={{ backgroundColor: Colors.primary.bleuBottom, flex: 0 }}
			></SafeAreaView>
			<SafeAreaView
				style={{
					backgroundColor: Colors.primary.white,
					flex: 1,
					height: '100%',
				}}
			>
				<View style={styles.headWrapper}>
					{/* <Back navigate={() => navigation.navigate('home')} /> */}
					<BoldText style={styles.username}>{user.name}</BoldText>
					<Pressable
						style={{ width: 50, alignItems: 'flex-end' }}
						onPress={() => navigation.navigate('UpdateProfile')}
					>
						<MaterialCommunityIcons name='cog' size={24} color='white' />
					</Pressable>
				</View>

				<View style={styles.profilePictureWrapper}>
					<ProfielPic
						clickPencil={pickUserImg}
						size={width / 3}
						img={user.profilePic}
						isEditable
					/>
				</View>
				<ImageBackground
					source={blueBG}
					imageStyle={{ height: 350, top: -100, zIndex: -100 }}
					style={{ padding: 10, zIndex: -100 }}
				>
					<View style={styles.profileSection}>
						<MediumText style={styles.badgesTitle}>Badges</MediumText>
						<View style={styles.badgesWrapper}>
							{renderBadges ? (
								renderBadges.map((badge) => {
									if (badge.id === 'ID468') {
										return (
											<Image
												style={styles.badgeImg}
												source={{
													uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/badges%2F${badge.img}?alt=media`,
												}}
											/>
										);
									} else if (badge.id === 'ddFfhdks1532sqdqhg') {
										return (
											<Image
												style={styles.badgeImg}
												source={{
													uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/badges%2F${badge.img}?alt=media`,
												}}
											/>
										);
									} else {
										return <Image style={styles.badgeImg} source={badge} />;
									}
								})
							) : (
								<Image style={styles.badgeImg} source={Square} />
							)}
						</View>
					</View>
				</ImageBackground>
				<View style={{ alignItems: 'center', marginTop: 20 }}>
					<TouchableOpacity
						style={styles.signOutButton}
						onPress={() => {
							signOut(auth);
							setLoggedIn(false);
						}}
					>
						<MediumText style={{ color: Colors.primary.white }}>
							Log Out
						</MediumText>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</Fragment>
	);
};

const ProfileStack = createNativeStackNavigator();

export const Profile = ({ navigation, setLoggedIn }) => {
	return (
		<ProfileStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName='ProfileMain'
		>
			<ProfileStack.Screen name='ProfileMain'>
				{(props) => (
					<ProfileMain
						setLoggedIn={setLoggedIn}
						navigation={navigation}
						{...props}
					/>
				)}
			</ProfileStack.Screen>

			<ProfileStack.Screen name='UpdateProfile'>
				{(props) => <ProfileUpdate {...props} />}
			</ProfileStack.Screen>

			<ProfileStack.Screen name='SelectGoal'>
				{(props) => <SelectGoal {...props} />}
			</ProfileStack.Screen>

			<ProfileStack.Screen name='SelectIntrests'>
				{(props) => <SelectInterests {...props} />}
			</ProfileStack.Screen>
		</ProfileStack.Navigator>
	);
};

const styles = StyleSheet.create({
	headWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		backgroundColor: Colors.primary.bleuBottom,
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
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 30,
		paddingBottom: 30,
		backgroundColor: Colors.primary.bleuBottom,
	},

	profileSection: {
		marginTop: 15,
		alignItems: 'center',
	},

	badgesWrapper: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: 280,
	},

	badgeImg: {
		width: 60,
		height: 60,
		objectFit: 'contain',
		marginHorizontal: 5,
		marginVertical: 5,
	},

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

	signOutButton: {
		backgroundColor: Colors.primary.pink,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		borderRadius: 20,
		marginTop: 50,
		width: 200,
	},
});
