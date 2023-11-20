import { Pressable, StyleSheet, View } from 'react-native';
import { Logo } from '../Components/SVG/Logo';
import { Colors } from '../Constants/Colors';
import { bodyText, buttonStyle, titleStyle } from '../style';
import { BoldText } from '../Components/Text/BoldText';
import { MediumText } from '../Components/Text/MediumText';
import { RegularText } from '../Components/Text/RegularText';

export const StartScreen = ({ navigation, logginPress }) => {
	return (
		<View style={styles.container}>
			<View>
				<View style={styles.logoConatiner}>
					<Logo />
					<BoldText style={styles.title}>Welcome</BoldText>
					<MediumText style={styles.subTitle}>to the swipe academy</MediumText>
				</View>
			</View>
			<View>
				<Pressable
					onPress={() => navigation.navigate('login')}
					style={styles.button}
				>
					<MediumText style={styles.text}>Log in</MediumText>
				</Pressable>
				<View style={styles.signUpContainer}>
					<RegularText style={styles.subTitle}>New user? </RegularText>
					<Pressable onPress={() => navigation.navigate('sign-up')}>
						<MediumText style={styles.text}>Sign up</MediumText>
					</Pressable>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.primary.bleuBottom,
		color: Colors.primary.white,
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},

	logoConatiner: {
		display: 'flex',
		alignItems: 'center',
	},

	title: {
		...titleStyle,
		marginTop: 50,
		textTransform: 'uppercase',
	},

	subTitle: {
		opacity: 0.8,
		...bodyText,
	},

	text: {
		...bodyText,
	},

	signUpContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 30,
	},

	button: {
		...buttonStyle,
	},
});
