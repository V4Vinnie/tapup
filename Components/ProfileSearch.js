import {
	KeyboardAvoidingView,
	Pressable,
	StyleSheet,
	TextInput,
	View,
} from 'react-native';
import { Colors } from '../Constants/Colors';
import { height, width } from '../utils/UseDimensoins';
import { ProfielPic } from './ProfilePic';
import { Shadow } from 'react-native-shadow-2';
import { Ionicons } from '@expo/vector-icons';
import { async } from '@firebase/util';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const ProfielSearch = ({
	userImg,
	showInput,
	searchValue,
	setSearch,
	setSearchValue,
	paddingHeight,
	setPaddingHeight,
	setLoggedIn,
	navigation,
}) => {
	const logOut = async () => {
		navigation.navigate('profile');
	};

	return (
		<KeyboardAvoidingView
			keyboardVerticalOffset={-width}
			behavior='height'
			style={{ ...styles.containerShadow, top: height - paddingHeight }}
		>
			<View style={styles.inwrap}>
				<Shadow style={styles.container}>
					<Pressable onPress={() => setSearch(true)} style={{ padding: 15 }}>
						{showInput ? (
							<TextInput
								value={searchValue}
								onChangeText={(text) => setSearchValue(text)}
								autoFocus
								style={{ width: (width / 6) * 4, fontSize: 18 }}
								onFocus={() => setPaddingHeight((width / 8) * 9)}
								onBlur={() => setPaddingHeight(110)}
							/>
						) : (
							<Ionicons name='search' size={24} color='#A7A7A7' />
						)}
					</Pressable>
					<Pressable onPress={() => logOut()}>
						<ProfielPic img={userImg} size={74} />
					</Pressable>
				</Shadow>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	containerShadow: {
		position: 'absolute',
		zIndex: 999,
		right: 2,
	},

	inwrap: {
		borderRadius: 50,
		alignItems: 'flex-end',
		marginRight: 10,
	},
	container: {
		backgroundColor: Colors.primary.white,
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 50,
	},
});
