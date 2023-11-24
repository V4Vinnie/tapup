import {
	FlatList,
	Image,
	ImageBackground,
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { height, width } from '../../utils/UseDimensoins';
import { ProfielPic } from '../../Components/ProfilePic';
import { useUser } from '../../Providers/UserProvider';
import { Colors } from '../../Constants/Colors';
import { signOut } from 'firebase/auth';
import { auth, storage } from '../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { fetchFrameById, updateUser } from '../../utils/fetch';
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
import { TopicRectApp } from '../../Components/TopicRectApp';
import { PrivacyPolicy } from './PrivacyPolicy';
import { Report } from './Report';
import * as CompressImg from 'react-native-compressor';

const ProfileMain = ({ navigation, setLoggedIn, setViewFrame }) => {
	const { user, setUser } = useUser();

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

			const response = await fetch(manipResult);

			const blobFile = await response.blob();

			const storageRef = ref(storage, `users/${user.id}/profilePicture.png`);
			await uploadBytes(storageRef, blobFile).then((snapshot) => {
				updateUser({
					...user,
					profilePic: `users%2F${user.id}%2FprofilePicture.png`,
				});

				setUser({
					...user,
					profilePic: { ...response, isLocal: true },
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
		getLikedFrames();
	}, [isFocused]);

	const [isLoading, setIsLoading] = useState(true);

	const [likedFrames, setLikedFrames] = useState(undefined);

	const getLikedFrames = async () => {
		setIsLoading(true);

		let _likedFrames = [];

		for (let ind = 0; ind < user.watchedFrames.length; ind++) {
			const _frame = user.watchedFrames[ind];

			if (_frame.isLiked) {
				const frameData = await fetchFrameById(_frame.frameLink);
				if (frameData) {
					_likedFrames.push(frameData);
				}
			}
		}
		setLikedFrames(_likedFrames);
		setIsLoading(false);
	};

	const setFrames = (frame) => {
		setViewFrame(frame);
		navigation.navigate('frames');
	};

	return (
		<Fragment>
			<SafeAreaView
				style={{ backgroundColor: Colors.primary.bleuBottom, flex: 0 }}
			></SafeAreaView>
			<ScrollView
				style={{
					backgroundColor: Colors.primary.white,
					flex: 1,
					height: '100%',
				}}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				bounces={false}
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
												key={badge.id}
												style={styles.badgeImg}
												source={require(`../../assets/badges/badge_FirstFrame.png`)}
											/>
										);
									} else if (badge.id === 'ddFfhdks1532sqdqhg') {
										return (
											<Image
												key={badge.id}
												style={styles.badgeImg}
												source={require(`../../assets/badges/badge_WeekGoal.png`)}
											/>
										);
									} else {
										return (
											<Image
												key={badge.id}
												style={styles.badgeImg}
												source={badge}
											/>
										);
									}
								})
							) : (
								<Image style={styles.badgeImg} source={Square} />
							)}
						</View>
					</View>
				</ImageBackground>

				<View style={{ alignItems: 'center', marginTop: 40 }}>
					<MediumText style={styles.likedTitle}>Liked Frames</MediumText>

					{!isLoading && likedFrames.length ? (
						<FlatList
							showsVerticalScrollIndicator={false}
							showsHorizontalScrollIndicator={false}
							horizontal
							data={likedFrames}
							style={{
								overflow: 'visible',
								alignSelf: 'flex-start',
								width: '100%',
								padding: 15,
							}}
							renderItem={({ item }) => (
								<TopicRectApp
									width={width / 3 - 11}
									height={200}
									topic={item}
									setFrames={setFrames}
									navigation={navigation}
									key={item.id}
								/>
							)}
							keyExtractor={(topic) => topic.id}
						/>
					) : (
						<BoldText>No liked frames</BoldText>
					)}
				</View>

				<View
					style={{
						alignItems: 'center',
						marginTop: 20,
						marginBottom: height / 5,
					}}
				>
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
			</ScrollView>
		</Fragment>
	);
};

const ProfileStack = createNativeStackNavigator();

export const Profile = ({ navigation, setLoggedIn, setViewFrame }) => {
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
						setViewFrame={setViewFrame}
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

			<ProfileStack.Screen name='PrivacyPolicy'>
				{(props) => <PrivacyPolicy {...props} />}
			</ProfileStack.Screen>

			<ProfileStack.Screen name='Report'>
				{(props) => <Report {...props} />}
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

	likedTitle: {
		fontSize: 20,
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
