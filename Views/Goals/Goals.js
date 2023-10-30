import { Fragment, useEffect, useState } from 'react';
import {
	SafeAreaView,
	Text,
	View,
	ScrollView,
	ImageBackground,
} from 'react-native';
import { PageHeader } from '../../Components/PageHeader';
import { Colors } from '../../Constants/Colors';
import blueBG from '../../assets/bleuBG.png';
import { useUser } from '../../Providers/UserProvider';
import { GOALS } from '../Profile/SelectGoal';
import { formatDate } from '../../utils/formatDate';
import { useIsFocused } from '@react-navigation/native';
import { BoldText } from '../../Components/Text/BoldText';
import { RegularText } from '../../Components/Text/RegularText';

export const Goals = () => {
	const { user } = useUser();
	const [selectedGoal, setSelectedGoal] = useState();

	const [watchedInWeek, setWatchedInWeek] = useState(0);
	const isFocused = useIsFocused();
	useEffect(() => {
		GOALS.map((goal) => {
			if (user.goal && goal.id === user.goal.id) {
				setSelectedGoal(goal);
			}
		});

		let _watchedInWeek = [...user.watchedFrames].filter(
			(_watched) =>
				Date.parse(formatDate(_watched.watchedDate)) >=
					Date.parse(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) &&
				_watched.isDone
		);

		setWatchedInWeek(_watchedInWeek.length);
	}, [isFocused]);

	return (
		<Fragment>
			<PageHeader
				titleName={'Goals'}
				backgroundColor={Colors.primary.lightBleu}
			/>
			<SafeAreaView
				style={{
					backgroundColor: Colors.primary.white,
					flex: 1,
				}}
			>
				<ImageBackground
					source={blueBG}
					imageStyle={{ height: 530, top: -200, zIndex: -10 }}
					style={{ padding: 10 }}
				></ImageBackground>
				<ScrollView
					style={{
						padding: 20,
					}}
				>
					{!selectedGoal ? (
						<View
							style={{
								padding: 22,
								borderRadius: 20,
								shadowColor: '#171717',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.5,
								shadowRadius: 3,
								backgroundColor: Colors.primary.white,
								alignItems: 'center',
							}}
						>
							<BoldText>No goal selected</BoldText>
						</View>
					) : (
						<>
							<View
								style={{
									padding: 22,
									borderRadius: 20,
									shadowColor: '#171717',
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.5,
									shadowRadius: 3,
									backgroundColor: Colors.primary.white,
								}}
							>
								<BoldText>{selectedGoal.title}</BoldText>
								<RegularText style={{}}>{selectedGoal.body}</RegularText>
							</View>

							<View
								style={{
									padding: 22,
									borderRadius: 20,
									shadowColor: '#171717',
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.5,
									shadowRadius: 3,
									backgroundColor: Colors.primary.white,
									marginTop: 20,
								}}
							>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										marginBottom: 5,
									}}
								>
									<BoldText>Goal progress:</BoldText>
									<RegularText>{`${watchedInWeek}/${selectedGoal.goal}`}</RegularText>
								</View>
								<View
									style={{
										height: 15,
										width: '100%',
										borderRadius: 20,
										overflow: 'hidden',
										backgroundColor: '#D9D9D9',
									}}
								>
									<View
										style={{
											height: '100%',
											width: `${(watchedInWeek / selectedGoal.goal) * 100}%`,
											backgroundColor: Colors.primary.pink,
										}}
									></View>
								</View>
							</View>
						</>
					)}
				</ScrollView>
			</SafeAreaView>
		</Fragment>
	);
};
