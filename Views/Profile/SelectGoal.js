import { Fragment, useState } from 'react';
import { PageHeader } from '../../Components/PageHeader';
import { Colors } from '../../Constants/Colors';
import {
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import blueBG from '../../assets/bleuBG.png';
import { useUser } from '../../Providers/UserProvider';
import { updateUser } from '../../utils/fetch';
import { RegularText } from '../../Components/Text/RegularText';
import { MediumText } from '../../Components/Text/MediumText';
import { BoldText } from '../../Components/Text/BoldText';

export const GOALS = [
	{
		id: 'eca11f9f-de51-4961-b017-2e900bb1acce',
		title: 'Casual',
		body: 'This goal is for people who just browse the app. You are not really actively looking for something but like to check some topics in your free time.',
		goal: 2,
	},
	{
		id: '3f040617-04e6-497f-91dd-1da2c534efd0',
		title: 'Regular',
		body: 'You are looking to learn new things on a good tempo. 2-3 frames a week is what you are aiming for. So we don’t push you to hard.',
		goal: 3,
	},
	{
		id: '4c62338e-8741-40c3-b357-220be6d85923',
		title: 'Hardcore',
		body: 'This means you really actively want to learn and watch at least 1 new frame every day. We will help you by selecting the best frames for you.',
		goal: 5,
	},
];

export const SelectGoal = ({ navigation }) => {
	const { user, setUser } = useUser();

	const onGoalClick = (goal) => {
		setUser({ ...user, goal: goal });
	};

	const saveOnBack = () => {
		updateUser(user);
		navigation.goBack();
	};

	return (
		<Fragment>
			<PageHeader
				titleName={'Goal'}
				navigation={navigation}
				backgroundColor={Colors.primary.lightBleu}
				withBack
				onBackClick={saveOnBack}
			/>

			<ImageBackground
				source={blueBG}
				imageStyle={{ height: 530, top: -150, zIndex: -10 }}
				style={{ padding: 10 }}
			>
				<RegularText style={styles.selectText}>
					Select a weekly goal:
				</RegularText>

				{GOALS.map((goal) => {
					const isSeleted = user.goal ? user.goal.id === goal.id : false;
					return (
						<TouchableOpacity
							onPress={() => onGoalClick(goal)}
							style={
								isSeleted
									? { ...styles.goalWrapper, ...styles.selectedGoalWrapper }
									: styles.goalWrapper
							}
						>
							<BoldText
								style={
									isSeleted
										? { ...styles.goalTitle, ...styles.selectedText }
										: styles.goalTitle
								}
							>
								{goal.title}
							</BoldText>
							<RegularText
								style={
									isSeleted
										? { ...styles.goalBodyText, ...styles.selectedText }
										: styles.goalBodyText
								}
							>
								{goal.body}
							</RegularText>
						</TouchableOpacity>
					);
				})}
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
