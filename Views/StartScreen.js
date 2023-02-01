import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Logo } from '../Components/SVG/Logo';
import { Colors } from '../Constants/Colors';
import { bodyText, buttonStyle, titleStyle } from '../style';

export const StartScreen = ({ navigation, logginPress, isLogginIn }) => {
	return (
		<View style={styles.container}>
			<View>
				<View style={styles.logoConatiner}>
					<Logo />
					<Text style={styles.title}>Welcome</Text>
					<Text style={styles.subTitle}>to the swipe academy</Text>
				</View>
			</View>
			<View>
				<Pressable
					onPress={() => navigation.navigate('login')}
					style={
						isLogginIn ? { opacity: 0.3, ...styles.button } : styles.button
					}
					disabled={isLogginIn}
				>
					<Text style={styles.text}>Log in</Text>
				</Pressable>
				<View style={styles.signUpContainer}>
					<Text style={styles.subTitle}>New user? </Text>
					<Pressable
						disabled={isLogginIn}
						onPress={() => navigation.navigate('sign-up')}
					>
						<Text style={styles.text}>Sign up</Text>
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
		marginTop: 58,
	},

	button: {
		...buttonStyle,
	},
});
