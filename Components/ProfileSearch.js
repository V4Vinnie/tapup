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
import { Ionicons, Entypo } from '@expo/vector-icons';
import { ROLES } from '../Constants/Roles';
import { useUser } from '../Providers/UserProvider';

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
	const { user } = useUser();

	const toProfile = async () => {
		navigation.navigate('profile');
	};

	const clickNav = () => {
		if (user.role === ROLES.CREATOR) {
			navigation.navigate('editorOverview');
		} else {
			setSearch(true);
		}
	};

	return (
		<KeyboardAvoidingView
			keyboardVerticalOffset={-width}
			behavior='height'
			style={{ ...styles.containerShadow, top: height - paddingHeight }}
		>
			<View style={styles.inwrap}>
				<Shadow style={styles.container}>
					<Pressable onPress={() => clickNav()} style={{ padding: 15 }}>
						{showInput ? (
							<TextInput
								value={searchValue}
								onChangeText={(text) => setSearchValue(text)}
								autoFocus
								style={{ width: (width / 6) * 4, fontSize: 18 }}
								onFocus={() => setPaddingHeight((width / 8) * 9)}
								onBlur={() => setPaddingHeight(110)}
							/>
						) : user.role === ROLES.CREATOR ? (
							<Entypo name='plus' size={24} color='#A7A7A7' />
						) : (
							<Ionicons name='search' size={24} color='#A7A7A7' />
						)}
					</Pressable>
					<Pressable onPress={() => toProfile()}>
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
