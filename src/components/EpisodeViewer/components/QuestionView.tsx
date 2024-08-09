import React, { useEffect } from 'react';
import { View } from 'react-native';
import QuestionContent from './QuestionContent';
import { TQuestionStory, TStory } from '../../../types';

type Props = {
	story: TStory;
	selectedAnswer?: number;
	showResult: boolean;
	onAnswerSelect: (index: number) => void;
	setNextButtonDisabled?: (disabled: boolean) => void;
};

const QuestionView = ({
	story,
	selectedAnswer,
	showResult,
	onAnswerSelect,
	setNextButtonDisabled,
}: Props) => {
	if (!story) {
		return null;
	}
	story = story as TQuestionStory;

	useEffect(() => {
		if (setNextButtonDisabled) {
			setNextButtonDisabled(selectedAnswer !== story.correctAnswer);
		}
	}, [selectedAnswer]);

	return (
		<View className='flex-1'>
			<View className='flex-1 justify-center px-4 pt-20'>
				<QuestionContent
					question={story.question}
					description={story.description}
					answers={story.answers}
					correctAnswer={story.correctAnswer}
					selectedAnswer={selectedAnswer}
					showResult={showResult}
					onAnswerSelect={onAnswerSelect}
				/>
			</View>
		</View>
	);
};

export default QuestionView;
