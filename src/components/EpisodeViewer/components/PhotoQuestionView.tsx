import React, { useEffect } from 'react';
import { View, Image, SafeAreaView } from 'react-native';
import QuestionContent from './QuestionContent.js';
import { TPhotoQuestionStory, TStory } from '../../../types.js';

type Props = {
	story: TStory;
	selectedAnswer?: number;
	showResult: boolean;
	onAnswerSelect: (index: number) => void;
	setNextButtonDisabled?: (disabled: boolean) => void;
};

const PhotoQuestionView = ({
	story,
	selectedAnswer,
	showResult,
	onAnswerSelect,
	setNextButtonDisabled,
}: Props) => {
	if (!story) {
		return null;
	}
	story = story as TPhotoQuestionStory;

	useEffect(() => {
		if (setNextButtonDisabled) {
			setNextButtonDisabled(selectedAnswer !== story.correctAnswer);
		}
	}, [selectedAnswer]);

	return (
		<SafeAreaView className='flex-1'>
			<View className='flex-1'>
				<View className='h-1/2'>
					<Image
						source={{ uri: story.image }}
						className='w-full h-full'
						style={{ resizeMode: 'cover' }}
					/>
				</View>
				<View className='flex-1 bg-gray-900 rounded-t-3xl -mt-6'>
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
		</SafeAreaView>
	);
};

export default PhotoQuestionView;
