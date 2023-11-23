import {
	ImageBackground,
	Linking,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { Colors } from '../../Constants/Colors';
import { useUser } from '../../Providers/UserProvider';
import { Fragment, useState } from 'react';

import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import { PageHeader } from '../../Components/PageHeader';
import blueBG from '../../assets/bleuBG.png';

import { BlackArrow } from '../../Components/SVG/BlackArrow';
import { auth } from '../../firebaseConfig';
import { height } from '../../utils/UseDimensoins';
import { updateUser } from '../../utils/fetch';
import { RoleSelect } from '../../Components/RoleSelect';
import { MediumText } from '../../Components/Text/MediumText';
import { RegularText } from '../../Components/Text/RegularText';
import { BoldText } from '../../Components/Text/BoldText';

export const ProfileUpdate = ({ navigation }) => {
	const { user, setUser } = useUser();

	const [username, setUsername] = useState(user.name ? user.name : 'Name');

	const openSettings = () => {
		// TODO: it might work on SDK 37?
		// Linking.openSettings();
		if (Platform.OS === 'ios') {
			Linking.openURL(`app-settings:`);
		} else {
			const bundleIdentifier = Application.applicationId;
			IntentLauncher.startActivityAsync(
				IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
				{
					data: `package:${bundleIdentifier}`,
				}
			);
		}
	};

	const sendResetPass = async () => {
		await sendPasswordResetEmail(auth, user.email);
	};

	const clickNewPage = (page) => {
		navigation.navigate(page);
	};

	const saveOnBack = () => {
		updateUser(user);
		navigation.goBack();
	};

	return (
		<Fragment>
			<PageHeader
				navigation={navigation}
				backgroundColor={Colors.primary.lightBleu}
				titleName={'Settings'}
				withBack
				onBackClick={saveOnBack}
			/>
			<SafeAreaView
				style={{
					backgroundColor: Colors.primary.white,
					height: '100%',
				}}
			>
				{user ? (
					<ImageBackground
						source={blueBG}
						imageStyle={{ height: 530, top: -150, zIndex: -10 }}
					>
						<ScrollView
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							style={{ height: '100%', paddingHorizontal: 20, paddingTop: 20 }}
						>
							<View style={styles.section}>
								<MediumText style={styles.sectionTitle}>
									Edit Account
								</MediumText>
								<View style={styles.settingItem}>
									<RegularText style={styles.labelText}>Name</RegularText>
									<TextInput
										editable
										value={user.name}
										placeholder='Name'
										placeholderTextColor='#FFD1E5'
										onChangeText={(newText) =>
											setUser({ ...user, name: newText })
										}
									/>
								</View>
							</View>

							<View style={styles.section}>
								<MediumText style={styles.sectionTitle}>
									Account details
								</MediumText>

								<RoleSelect />

								<TouchableOpacity
									onPress={() => clickNewPage('SelectGoal')}
									style={styles.settingItem}
								>
									<RegularText>Weekly Goal</RegularText>
									<View style={styles.withArrow}>
										<RegularText>
											{user.goal ? user.goal.title : 'No goal'}
										</RegularText>
										<BlackArrow style={{ marginLeft: 5 }} />
									</View>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() => clickNewPage('SelectIntrests')}
									style={styles.settingItem}
								>
									<RegularText>Intrests</RegularText>

									<BlackArrow style={{ marginLeft: 5 }} />
								</TouchableOpacity>
							</View>

							<View style={styles.section}>
								<MediumText style={styles.sectionTitle}>
									Notifications
								</MediumText>
								<TouchableOpacity
									style={styles.settingItem}
									onPress={() => openSettings()}
								>
									<RegularText>Notifications</RegularText>
									<BlackArrow style={{ marginLeft: 5 }} />
								</TouchableOpacity>
							</View>

							<View style={styles.section}>
								<MediumText style={styles.sectionTitle}>Privacy</MediumText>
								<TouchableOpacity
									style={styles.settingItem}
									onPress={() => clickNewPage('PrivacyPolicy')}
								>
									<RegularText>Privacy Policy</RegularText>
									<BlackArrow style={{ marginLeft: 5 }} />
								</TouchableOpacity>
							</View>

							<View style={styles.section}>
								<MediumText style={styles.sectionTitle}>
									Report an issue
								</MediumText>
								<TouchableOpacity
									style={styles.settingItem}
									onPress={() => clickNewPage('Report')}
								>
									<RegularText>Report an issue</RegularText>
									<BlackArrow style={{ marginLeft: 5 }} />
								</TouchableOpacity>
							</View>

							<View style={{ ...styles.section, marginBottom: height / 3 }}>
								<TouchableOpacity
									style={styles.removeButton}
									onPress={() => sendResetPass()}
								>
									<MediumText style={{ color: Colors.primary.white }}>
										Change password
									</MediumText>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</ImageBackground>
				) : (
					<BoldText>Loading</BoldText>
				)}
			</SafeAreaView>
		</Fragment>
	);
};

const styles = StyleSheet.create({
	sectionTitle: {
		fontSize: 16,
	},

	section: {
		marginBottom: 25,
	},

	settingItem: {
		padding: 15,
		backgroundColor: Colors.primary.white,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 18,
		marginTop: 10,

		shadowColor: '#171717',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 4,
	},

	withArrow: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	removeButton: {
		backgroundColor: Colors.primary.pink,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		borderRadius: 20,
	},

	labelText: {
		opacity: 0.5,
	},
});
