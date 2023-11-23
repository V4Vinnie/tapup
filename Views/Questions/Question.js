import { TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../Constants/Colors';
import { useEffect, useState } from 'react';
import { createNewQuestion, fetchFrameById } from '../../utils/fetch';
import { BoldText } from '../../Components/Text/BoldText';
import { MediumText } from '../../Components/Text/MediumText';
import { RegularText } from '../../Components/Text/RegularText';

export const Question = ({ question, isCreator }) => {
	const [frameTitle, setFrameTitle] = useState();

	const [answer, setAnswer] = useState(
		question.answer ? question.answer : undefined
	);

	const [isSend, setIsSend] = useState(false);

	const [titleLoading, setTitleLoading] = useState(false);

	const sendAnswer = async () => {
		if (answer) {
			await createNewQuestion({ ...question, answer: answer });
			setIsSend(true);
		}
	};

	useEffect(() => {
		const fetchFrameName = async () => {
			setTitleLoading(true);
			const _frame = await fetchFrameById(question.frameLink);
			setFrameTitle(_frame.title);
			setTitleLoading(false);
		};
		if (question) {
			fetchFrameName();
		}

		if (question.answer) {
			setIsSend(true);
		}
	}, []);

	return (
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
			<BoldText style={{ fontWeight: 'bold', fontSize: 20 }}>
				{question.frameTitle}
			</BoldText>
			<View style={{ marginTop: 5 }}>
				<MediumText style={{ fontWeight: '600', fontSize: 16 }}>
					The question:
				</MediumText>
				<RegularText style={{ opacity: 0.6 }}>
					{question ? question.question : 'Loading'}
				</RegularText>
			</View>
			{isCreator && !isSend ? (
				<>
					<View style={{ marginTop: 20 }}>
						<MediumText style={{ fontWeight: '600', fontSize: 16 }}>
							Your answer:
						</MediumText>

						<TextInput
							multiline
							value={answer}
							onChangeText={(answ) => setAnswer(answ)}
							style={{
								borderColor: Colors.primary.bleuBottom,
								borderWidth: 2,
								borderRadius: 10,
								height: 60,
								paddingHorizontal: 8,
							}}
						/>
					</View>

					<TouchableOpacity
						style={{
							backgroundColor: Colors.primary.pink,
							justifyContent: 'center',
							alignItems: 'center',
							padding: 10,
							borderRadius: 20,
							marginTop: 20,
						}}
						onPress={() => sendAnswer()}
					>
						<MediumText style={{ color: Colors.primary.white }}>
							Send Answer
						</MediumText>
					</TouchableOpacity>
				</>
			) : (
				<View style={{ marginTop: 20 }}>
					{answer ? (
						<>
							<MediumText style={{ fontWeight: '600', fontSize: 16 }}>
								Answer:
							</MediumText>
							<RegularText style={{ opacity: 0.6 }}>
								{question ? answer : 'Loading'}
							</RegularText>
						</>
					) : (
						<MediumText style={{ fontWeight: '600', fontSize: 16 }}>
							No answer yet
						</MediumText>
					)}
				</View>
			)}
		</View>
	);
};
