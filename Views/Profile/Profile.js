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
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { Feather } from '@expo/vector-icons';

import tempBadges from '../../assets/badges/template.png';

export const Profile = ({ navigation }) => {
	const { user } = useUser();

	const logOut = async () => {
		signOut(auth).then(() => {
			setLoggedIn(false);
			navigation.navigate('start');
		});
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
				<View style={styles.profilePictureWrapper}>
					<ProfielPic size={width / 3} img={user.profilePic} />
				</View>
				<View style={styles.profileSection}>
					<Text style={styles.badgesTitle}>Badges</Text>
					<View style={styles.badgesWrapper}>
						<Image style={styles.badgesTempImg} source={tempBadges} />
					</View>
				</View>
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
		alignItems: 'center',
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
});
