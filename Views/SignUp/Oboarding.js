import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { Colors } from '../../Constants/Colors';
import { bodyText, titleStyle } from '../../style';
import { height, width } from '../../utils/UseDimensoins';
import BG from '../../assets/logo/SignUpBG.png';
import { MediumText } from '../../Components/Text/MediumText';
import { BoldText } from '../../Components/Text/BoldText';
import { RegularText } from '../../Components/Text/RegularText';

import OnboardIMG1 from '../../assets/onboarding/onboard1.png';
import OnboardIMG2 from '../../assets/onboarding/onboard2.png';
import OnboardIMG3 from '../../assets/onboarding/onboard3.png';

const Skip = ({ ...props }) => (
	<Pressable style={styles.skipButton} {...props}>
		<MediumText style={styles.skipText}>Skip</MediumText>
	</Pressable>
);

const Round = ({ selected, ...props }) => (
	<View style={selected ? styles.filledCircle : styles.outlinedCircle} />
);

export const Onboard = ({ navigation, setLoggedIn }) => {
	const DonePress = () => {
		setLoggedIn(true);
	};

	return (
		<>
			<Onboarding
				DotComponent={Round}
				SkipButtonComponent={Skip}
				onDone={() => DonePress()}
				onSkip={() => DonePress()}
				showDone={true}
				bottomBarColor={Colors.primary.pink}
				controlStatusBar={true}
				showNext={false}
				pages={[
					{
						subtitle: '',
						backgroundColor: Colors.primary.pink,
						image: (
							<ImageBackground
								style={{
									height: '100%',
									width: '100%',
								}}
								imageStyle={{
									height: '100%',
									width: '100%',
									objectFit: 'contain',
								}}
								source={OnboardIMG1}
							/>
						),
						title: (
							<ImageBackground
								style={styles.onboardText}
								imageStyle={{ width: '100%', height: '200%' }}
								resizeMode='cover'
								source={BG}
							>
								<View style={styles.textContainer}>
									<BoldText style={styles.onboardTitle}>
										Micro learning
									</BoldText>
									<RegularText style={styles.subText}>
										TapUp is a true micro learning platform. Learn new skills by
										browsing stories.
									</RegularText>
								</View>
							</ImageBackground>
						),
					},
					{
						subtitle: '',
						backgroundColor: Colors.primary.pink,
						image: (
							<ImageBackground
								style={{
									height: '100%',
									width: '100%',
								}}
								imageStyle={{
									height: '100%',
									width: '100%',
									objectFit: 'contain',
								}}
								source={OnboardIMG2}
							/>
						),
						title: (
							<ImageBackground
								style={styles.onboardText}
								imageStyle={{ width: '100%', height: '200%' }}
								resizeMode='cover'
								source={BG}
							>
								<View style={styles.textContainer}>
									<BoldText style={styles.onboardTitle}>Your own pace</BoldText>
									<RegularText style={styles.subText}>
										Look at it like series on Netflix. You can binge or learn at
										your own pace.
									</RegularText>
								</View>
							</ImageBackground>
						),
					},
					{
						subtitle: '',
						backgroundColor: Colors.primary.pink,
						image: (
							<ImageBackground
								style={{
									height: '100%',
									width: '100%',
								}}
								imageStyle={{
									height: '100%',
									width: '100%',
									objectFit: 'contain',
								}}
								source={OnboardIMG3}
							/>
						),
						title: (
							<ImageBackground
								style={styles.onboardText}
								imageStyle={{ width: '100%', height: '200%' }}
								resizeMode='cover'
								source={BG}
							>
								<View style={styles.textContainer}>
									<BoldText style={styles.onboardTitle}>Test the Beta</BoldText>
									<RegularText style={styles.subText}>
										You are ready to test our beta! Make sure to let us know
										what you think.
									</RegularText>
								</View>
							</ImageBackground>
						),
					},
				]}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	onboardText: {
		position: 'absolute',
		top: (height / 5) * 3,
		height: (height / 5) * 2,
		width: width,
		alignItems: 'center',
		justifyContent: 'center',
	},

	textContainer: {
		height: '60%',
		width: '80%',
	},

	onboardTitle: {
		...titleStyle,
		fontSize: 35,
		textAlign: 'center',
		marginBottom: 15,
		lineHeight: 40,
	},

	subText: {
		...bodyText,
		textAlign: 'center',
	},

	filledCircle: {
		width: 16,
		height: 16,
		backgroundColor: Colors.primary.white,
		borderRadius: 16,
		marginHorizontal: 8,
	},
	outlinedCircle: {
		width: 16,
		height: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: Colors.primary.white,
		marginHorizontal: 8,
	},

	skipButton: {
		position: 'absolute',
		top: 110 - height,
		left: width - 70,
	},
	skipText: {
		...bodyText,
		opacity: 0.8,
		color: Colors.primary.bleuBottom,
	},
});
