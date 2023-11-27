import { useState } from 'react';
import { Colors } from '../../Constants/Colors';
import {
	Image,
	KeyboardAvoidingView,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Cross from '../../assets/icons/cross.png';
import { width } from '../../utils/UseDimensoins';

import uuid from 'uuid';
import { useUser } from '../../Providers/UserProvider';
import { createNewQuestion } from '../../utils/fetch';
import { RegularText } from '../Text/RegularText';
import { BoldText } from '../Text/BoldText';
import { MediumText } from '../Text/MediumText';

export const AskQuestion = ({
	creator,
	setShowQuestion,
	frame,
	setPauseVideo,
}) => {
	const [question, setQuestion] = useState('');

	const { user } = useUser();

	const sendQuestion = () => {
		const _question = {
			id: uuid.v4(),
			question: question,
			answer: false,
			askedBy: user.id,
			frameLink: {
				id: frame.id,
				topicId: frame.topicId,
				tapId: frame.tapId,
			},
			creatorId: creator.id,
		};
		if (question) {
			createNewQuestion(_question);
			setQuestion('');
			setShowQuestion(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={'position'}
			contentContainerStyle={{
				backgroundColor: Colors.primary.white,
				padding: 20,
				borderTopLeftRadius: 20,
				borderTopRightRadius: 20,
			}}
			style={{
				zIndex: 50,
				position: 'absolute',
				zIndex: 10,
				bottom: 0,
				backgroundColor: Colors.primary.white,
				width: width,
				borderTopLeftRadius: 20,
				borderTopRightRadius: 20,
			}}
		>
			<View
				style={{
					width: '100%',
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginBottom: 10,
				}}
			>
				<RegularText style={{ fontSize: 20 }}>
					Ask{' '}
					{creator ? (
						<BoldText
							style={{ fontWeight: 'bold', color: Colors.primary.pink }}
						>
							{creator.name}
						</BoldText>
					) : null}{' '}
					a question
				</RegularText>
				<TouchableOpacity
					onPress={() => {
						setShowQuestion(false);
						setPauseVideo(false);
					}}
				>
					<Image source={Cross} />
				</TouchableOpacity>
			</View>
			<TextInput
				multiline
				style={{
					padding: 5,
					borderColor: Colors.primary.bleuBottom,
					borderWidth: 3,
					width: '100%',
					height: 200,
					borderRadius: 10,
					marginBottom: 20,
				}}
				placeholder='Ask'
				value={question}
				onChangeText={(val) => setQuestion(val)}
			/>
			<TouchableOpacity
				style={{
					backgroundColor: Colors.primary.pink,
					justifyContent: 'center',
					alignItems: 'center',
					padding: 10,
					borderRadius: 20,
					marginBottom: 20,
				}}
				onPress={() => sendQuestion()}
			>
				<MediumText style={{ color: Colors.primary.white }}>
					Send Question
				</MediumText>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
};
