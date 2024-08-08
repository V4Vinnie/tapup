import React from 'react';
import { View, Text } from 'react-native';
import PhotoView from './PhotoView';
import QuestionView from './QuestionView';
import PhotoQuestionView from './PhotoQuestionView';
import VideoStoryView from './VideoStoryView';
import { TStory } from '../../../types';

type Props = {
	story: TStory | null;
	selectedAnswer?: number;
	showResult: boolean;
	onAnswerSelect: (answerIndex: number) => void;
	answerResult?: number;
	setNextButtonDisabled: (disabled: boolean) => void;
};

const GeneralStoryView = ({
	story,
	selectedAnswer,
	showResult,
	onAnswerSelect,
	answerResult,
	setNextButtonDisabled,
}: Props) => {
	if (!story) {
		return (
			<View className='h-full flex justify-center items-center'>
				<Text className='text-white'>No story available</Text>
			</View>
		);
	}

	const StoryComponent = {
		PHOTO: PhotoView,
		VIDEO: VideoStoryView,
		QUESTION: QuestionView,
		PHOTO_QUESTION: PhotoQuestionView,
	}[story.type];

	if (!StoryComponent) {
		return (
			<View className='h-full flex justify-center items-center'>
				<Text className='text-white'>
					Unknown story type: {story.type}
				</Text>
			</View>
		);
	}

	return (
		<View className='h-full'>
			<StoryComponent
				story={story}
				selectedAnswer={selectedAnswer}
				showResult={showResult}
				onAnswerSelect={onAnswerSelect}
				setNextButtonDisabled={setNextButtonDisabled}
			/>
		</View>
	);
};

export default GeneralStoryView;
