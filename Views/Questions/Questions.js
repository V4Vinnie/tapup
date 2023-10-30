import { Fragment, useEffect, useState } from 'react';
import {
	fetchQuestionForUser,
	fetchQuestrionsAskedForUser,
} from '../../utils/fetch';
import { useUser } from '../../Providers/UserProvider';
import {
	FlatList,
	ImageBackground,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Colors } from '../../Constants/Colors';
import { Question } from './Question';
import { ROLES } from '../../Constants/Roles';
import { PageHeader } from '../../Components/PageHeader';
import blueBG from '../../assets/bleuBG.png';
import { RegularText } from '../../Components/Text/RegularText';
import { BoldText } from '../../Components/Text/BoldText';

export const Questions = () => {
	const [questions, setQuestions] = useState();

	const [showFor, setShowFor] = useState(false);

	const { user } = useUser();

	useEffect(() => {
		const getAskedQuestions = async () => {
			const _questions = await fetchQuestionForUser(user.id);
			setQuestions(_questions);
		};

		const getQuestionsForUser = async () => {
			const _questions = await fetchQuestrionsAskedForUser(user.id);
			setQuestions(_questions);
		};

		if (showFor) {
			getQuestionsForUser();
		} else {
			getAskedQuestions();
		}
	}, [showFor]);

	return (
		<Fragment>
			<PageHeader
				titleName={'Questions'}
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
				{user.role === ROLES.CREATOR && (
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							paddingTop: 10,
						}}
					>
						<TouchableOpacity
							style={showFor ? { opacity: 0.5 } : { opacity: 1 }}
							onPress={() => setShowFor(false)}
						>
							{showFor ? (
								<RegularText>From You</RegularText>
							) : (
								<BoldText>From You</BoldText>
							)}
						</TouchableOpacity>
						<View
							style={{
								width: 2,
								height: 20,
								backgroundColor: Colors.primary.pink,
								marginHorizontal: 15,
							}}
						></View>
						<TouchableOpacity
							style={!showFor ? { opacity: 0.5 } : { opacity: 1 }}
							onPress={() => setShowFor(true)}
						>
							{!showFor ? (
								<RegularText>From You</RegularText>
							) : (
								<BoldText>From You</BoldText>
							)}
						</TouchableOpacity>
					</View>
				)}
				<FlatList
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					scrollEnabled
					data={questions}
					renderItem={({ item }) => (
						<Question question={item} isCreator={showFor} />
					)}
					keyExtractor={(topic) => topic.id}
					style={{
						zIndex: 0,

						padding: 20,
						height: '100%',
					}}
				/>
			</SafeAreaView>
		</Fragment>
	);
};
