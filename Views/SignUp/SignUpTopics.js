import {
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
	Pressable,
	FlatList,
	Image,
} from 'react-native';
import { ProfielPic } from '../../Components/ProfilePic';
import { bodyText, containerStyle, titleStyle } from '../../style';

import BG from '../../assets/logo/SignUpBG.png';
import BGWhite from '../../assets/logo/SignUpBGWhite.png';
import { height, width } from '../../utils/UseDimensoins';
import { useState } from 'react';
import { Topics } from '../../Constants/Topics';
import { TopicRect } from '../../Components/TopicRect';
import { Arrow } from '../../Components/SVG/Arrow';
import { Colors } from '../../Constants/Colors';

export const SignUpTopics = ({ navigation, LoggedIn, user, changeUser }) => {
	const [editUsername, setEditUsername] = useState(false);
	const [tempUsername, setTempUsername] = useState(user.name);

	const [selected, setSelected] = useState([]);

	const addSelected = (topic) => {
		let _selected = selected;
		_selected.push(topic.id);
		setSelected(_selected);
	};

	const removeSelected = (topic) => {
		setSelected((current) =>
			current.filter((currentTopic) => {
				return currentTopic !== topic.id;
			})
		);
	};

	const setEditable = () => {
		if (!editUsername) {
			setEditUsername(true);
		}
	};

	const submitUsername = () => {
		setEditUsername(false);
		const _user = user;
		_user.name = tempUsername;
		_user.selectedTopics = selected;
		changeUser(_user);
	};

	const goNext = () => {
		const _user = user;
		_user.name = tempUsername;
		_user.selectedTopics = selected;
		changeUser(_user);
		navigation.navigate('onboard');
	};

	const TopicWidth = width / 3;

	return (
		<View style={styles.container}>
			<ImageBackground
				resizeMode='cover'
				imageStyle={{
					height: '60%',
					marginTop: '35%',
				}}
				source={BG}
			>
				<ImageBackground
					source={BGWhite}
					imageStyle={{
						height: '50%',
						marginTop: '120%',
					}}
				>
					<SafeAreaView style={styles.safeView}>
						<View style={styles.profileContainer}>
							<ProfielPic size={140} img={user.profilePic} />

							<View>
								<TextInput
									style={styles.userName}
									value={tempUsername}
									editable={editUsername}
									onChangeText={(newText) => setTempUsername(newText)}
									onPressIn={() => setEditable()}
									onBlur={() => submitUsername(false)}
									placeholder={tempUsername}
								/>
								<Pressable onPressIn={() => setEditable()}></Pressable>
							</View>
						</View>
						<View style={{ marginTop: 50 }}>
							<Text style={styles.infoText}>
								Select topics & users you're intrested in
							</Text>
							<FlatList
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								numColumns={3}
								data={Topics}
								contentContainerStyle={{ alignItems: 'center' }}
								renderItem={({ item }) => (
									<TopicRect
										width={TopicWidth - 10}
										height={200}
										topic={item}
										addSelected={addSelected}
										removeSelected={removeSelected}
									/>
								)}
								keyExtractor={(topic) => topic.id}
							/>
						</View>
						<Pressable
							onPress={() => goNext('onboard')}
							style={styles.nextButton}
						>
							<Arrow />
						</Pressable>
					</SafeAreaView>
				</ImageBackground>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		...containerStyle,
	},

	safeView: {
		zIndex: 5,
		...containerStyle,
		backgroundColor: 'none',
		width: width,
		justifyContent: 'space-between',
	},

	profileContainer: {
		marginTop: 10,
		alignItems: 'center',
	},

	userName: {
		...titleStyle,
	},

	infoText: {
		...bodyText,
		width: width,
		paddingHorizontal: 60,
		marginBottom: 15,
		textAlign: 'center',
	},

	nextButton: {
		backgroundColor: Colors.primary.pink,
		padding: 5,
		width: 87,
		height: 87,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 500,
		position: 'absolute',
		top: height - 120,
		left: width - 95,
	},
});
