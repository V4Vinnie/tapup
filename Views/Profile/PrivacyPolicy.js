import { Fragment } from 'react';
import { PageHeader } from '../../Components/PageHeader';
import { Colors } from '../../Constants/Colors';
import {
	Alert,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { BoldText } from '../../Components/Text/BoldText';
import { MediumText } from '../../Components/Text/MediumText';
import { RegularText } from '../../Components/Text/RegularText';
import { height } from '../../utils/UseDimensoins';

export const PrivacyPolicy = ({ navigation }) => {
	return (
		<Fragment>
			<PageHeader
				titleName={'Privacy Policy'}
				navigation={navigation}
				backgroundColor={Colors.primary.white}
				withBack
			/>

			<View style={{ padding: 10, backgroundColor: Colors.primary.white }}>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					style={{ height: '100%' }}
				>
					<BoldText style={styles.titleText}>
						Privacy Policy TapUp Learning
					</BoldText>
					<MediumText>Last Updated: 7/12/2023</MediumText>
					<RegularText style={styles.bodyText}>
						Welcome to TapUp, a micro-learning app designed to enhance your
						learning experience. This Privacy Policy explains how we collect,
						use, disclose, and protect your personal information when you use
						our mobile application.
					</RegularText>

					<RegularText style={styles.bodyText}>
						By using TapUp, you agree to the terms outlined in this Privacy
						Policy. If you do not agree with the terms, please refrain from
						using our app.
					</RegularText>

					<MediumText style={styles.subTitleText}>
						1. Information We Collect
					</MediumText>
					<RegularText style={styles.bodyText}>
						<MediumText>a. User-Provided Information:</MediumText> When you
						create an account on TapUp, we collect information such as your
						name, email address, and any other information you voluntarily
						provide.
					</RegularText>
					<RegularText style={styles.bodyText}>
						<MediumText>b. Automatically Collected Information: </MediumText> We
						may collect information about your device and usage patterns,
						including but not limited to device type, operating system, IP
						address, and app usage statistics.
					</RegularText>
					<RegularText style={styles.bodyText}>
						<MediumText>c. Learning Data:</MediumText> TapUp may collect data
						related to your learning activities within the app, such as courses
						completed, progress, and assessment results. statistics.
					</RegularText>

					{/* USE INFO */}
					<MediumText style={styles.subTitleText}>
						2. How We Use Your Information
					</MediumText>
					<RegularText style={styles.bodyText}>
						<MediumText>a. Providing Services:</MediumText> We use your
						information to provide and improve our micro-learning services,
						personalize content, and enhance user experience.
					</RegularText>

					<RegularText style={styles.bodyText}>
						<MediumText>b. Communication: </MediumText>We may use your email
						address to send you updates, newsletters, and other information
						related to TapUp. You can opt-out of these communications at any
						time.
					</RegularText>

					<RegularText style={styles.bodyText}>
						<MediumText>c. Analytics: </MediumText>We use analytics tools to
						analyze user behavior and improve our app's functionality and
						content.
					</RegularText>

					{/* INFO SHARE */}
					<MediumText style={styles.subTitleText}>
						3. Information Sharing
					</MediumText>
					<RegularText style={styles.bodyText}>
						We do not sell, trade, or otherwise transfer your personal
						information to outside parties. However, we may share your
						information with trusted third parties who assist us in operating
						our app or servicing you.
					</RegularText>

					{/* Data SECURE */}
					<MediumText style={styles.subTitleText}>4. Data Security</MediumText>
					<RegularText style={styles.bodyText}>
						We take reasonable measures to protect your personal information
						from unauthorized access, disclosure, alteration, and destruction.
						However, no method of transmission over the internet or electronic
						storage is 100% secure.
					</RegularText>

					{/* RIGHTS */}
					<MediumText style={styles.subTitleText}>5. Your Rights</MediumText>
					<RegularText style={styles.bodyText}>
						You have the right to access, correct, or delete your personal
						information. You may also withdraw consent for the processing of
						your data. To exercise these rights, please contact us at
						info@tap-up.app.
					</RegularText>

					{/* Changes */}
					<MediumText style={styles.subTitleText}>
						6. Changes to Privacy Policy
					</MediumText>
					<RegularText style={styles.bodyText}>
						We reserve the right to update this Privacy Policy at any time. The
						latest version will be posted on our website, and we encourage you
						to review it periodically.
					</RegularText>

					{/* Contact info */}
					<MediumText style={styles.subTitleText}>
						7. Contact Information
					</MediumText>
					<RegularText style={styles.bodyText}>
						If you have any questions or concerns about our Privacy Policy,
						please contact us at info@tap-up.app.
					</RegularText>

					<RegularText style={styles.bodyText}>
						Thank you for using{' '}
						<TouchableOpacity
							onLongPress={() => Alert.alert('Ciel Brys was here ;)')}
							style={{ margin: 0, padding: 0 }}
						>
							<BoldText
								style={{
									fontSize: 16,
									marginVertical: 0,
									color: Colors.primary.pink,
								}}
							>
								TapUp!
							</BoldText>
						</TouchableOpacity>
					</RegularText>
					<View style={{ height: height / 2 }}></View>
				</ScrollView>
			</View>
		</Fragment>
	);
};

const styles = StyleSheet.create({
	goalWrapper: {
		backgroundColor: Colors.primary.white,
		padding: 20,
		borderRadius: 20,
		shadowColor: '#171717',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 4,
		marginVertical: 10,
	},

	selectedGoalWrapper: {
		backgroundColor: Colors.primary.pink,
	},

	goalTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 5,
	},

	goalBodyText: {
		opacity: 0.7,
	},

	selectedText: {
		color: Colors.primary.white,
	},

	titleText: { fontSize: 22, marginVertical: 10 },

	subTitleText: { fontSize: 18, marginVertical: 8 },

	bodyText: {
		fontSize: 16,
		marginVertical: 5,
	},
});
