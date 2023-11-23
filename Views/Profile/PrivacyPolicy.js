import { Fragment } from 'react';
import { PageHeader } from '../../Components/PageHeader';
import { Colors } from '../../Constants/Colors';
import { ImageBackground, ScrollView, StyleSheet } from 'react-native';
import blueBG from '../../assets/bleuBG.png';
import { RegularText } from '../../Components/Text/RegularText';

export const PrivacyPolicy = ({ navigation }) => {
	return (
		<Fragment>
			<PageHeader
				titleName={'Privacy Policy'}
				navigation={navigation}
				backgroundColor={Colors.primary.lightBleu}
				withBack
			/>

			<ImageBackground
				source={blueBG}
				imageStyle={{ height: 530, top: -150, zIndex: -10 }}
				style={{ padding: 10 }}
			>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					style={{ height: '100%' }}
				>
					<RegularText style={styles.selectText}>
						Privacy Policy here
					</RegularText>
				</ScrollView>
			</ImageBackground>
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

	selectText: { fontSize: 16, marginVertical: 10 },
});
