import {
	Image,
	ImageBackground,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { Colors } from '../../Constants/Colors';
import { bodyText, titleStyle } from '../../style';
import { height, width } from '../../utils/UseDimensoins';
import BG from '../../assets/logo/SignUpBG.png';

const Skip = ({ ...props }) => (
	<Pressable style={styles.skipButton} {...props}>
		<Text style={styles.skipText}>Skip</Text>
	</Pressable>
);

const Round = ({ selected, ...props }) => (
	<View style={selected ? styles.filledCircle : styles.outlinedCircle} />
);

export const Onboard = ({ navigation, setLoggedIn }) => {
	const DonePress = () => {
		setLoggedIn(true);
		navigation.navigate('home');
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
							<Image
								style={{ width: width, height: height }}
								source={{
									uri: 'https://img.freepik.com/premium-vector/cybernetics-flat-modern-design-illustration_566886-390.jpg',
								}}
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
									<Text style={styles.onboardTitle}>Micro learning</Text>
									<Text style={styles.subText}>
										TapUp is a true micro learning platform. Learn new skills by
										browsing stories.
									</Text>
								</View>
							</ImageBackground>
						),
					},
					{
						subtitle: '',
						backgroundColor: Colors.primary.pink,
						image: (
							<Image
								style={{ width: width, height: height }}
								source={{
									uri: 'https://img.freepik.com/premium-vector/cybernetics-flat-modern-design-illustration_566886-390.jpg',
								}}
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
									<Text style={styles.onboardTitle}>Your own pace</Text>
									<Text style={styles.subText}>
										Look at it like series on Netflix. You can binge or learn at
										your own pace.
									</Text>
								</View>
							</ImageBackground>
						),
					},
					{
						subtitle: '',
						backgroundColor: Colors.primary.pink,
						image: (
							<Image
								style={{ width: width, height: height }}
								source={{
									uri: 'https://img.freepik.com/premium-vector/cybernetics-flat-modern-design-illustration_566886-390.jpg',
								}}
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
									<Text style={styles.onboardTitle}>Awsome feature</Text>
									<Text style={styles.subText}>
										Second line of text in here to describe an app feature
										that’s really awesome
									</Text>
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
		fontSize: 40,
		textAlign: 'center',
		marginBottom: 20,
	},

	subText: {
		...bodyText,
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
