import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import GeneralStoryView from './GeneralStoryView';
import StoryEditor from './StoryEditor';
import { TStory } from '../../../types';

type Props = {
	story: TStory | null;
	isEditing?: boolean;
	updateStory?: (story: TStory) => void;
	selectedAnswer?: number;
	showResult: boolean;
	onAnswerSelect: (storyId: string, answerIndex: number) => void;
	setNextButtonDisabled: (disabled: boolean) => void;
};

const StoryViewItem = ({
	story,
	isEditing = false,
	updateStory,
	selectedAnswer,
	showResult,
	onAnswerSelect,
	setNextButtonDisabled,
}: Props) => {
	if (!story) {
		return (
			<View className='h-full flex justify-center items-center'>
				<ActivityIndicator size='large' color='#ffffff' />
				<Text className='text-white mt-4'>Loading story...</Text>
			</View>
		);
	}

	return (
		<View className='h-full'>
			{isEditing && updateStory ? (
				<StoryEditor story={story} updateStory={updateStory} />
			) : (
				<GeneralStoryView
					story={story}
					selectedAnswer={selectedAnswer}
					showResult={showResult}
					onAnswerSelect={(answerIndex: number) =>
						onAnswerSelect(story.id, answerIndex)
					}
					setNextButtonDisabled={setNextButtonDisabled}
				/>
			)}
		</View>
	);
};

export default StoryViewItem;
