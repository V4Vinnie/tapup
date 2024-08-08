import React, { useState } from 'react';
import {
	View,
	TextInput,
	Pressable,
	Text,
	ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Plus, X, Check, Camera } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../../navigation/Routes';
import { TStory } from '../../../types';

type Props = {
	story: TStory;
	updateStory: (story: TStory) => void;
};

const StoryEditor = ({ story, updateStory }: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [editedStory, setEditedStory] = useState(story);

	const handleChange = (name: string, value: string | number) => {
		if (
			editedStory.type !== 'PHOTO_QUESTION' &&
			editedStory.type !== 'QUESTION'
		)
			return;
		if (name === 'correctAnswer') {
			// Ensure the correct answer is within the valid range
			const newCorrectAnswer = editedStory.answers
				? Math.min(
						Math.max(0, Number(value)),
						editedStory.answers.length - 1
					)
				: 0;
			setEditedStory({ ...editedStory, [name]: newCorrectAnswer });
		} else {
			setEditedStory({ ...editedStory, [name]: value });
		}
	};

	const handleSubmit = () => {
		updateStory(editedStory);
	};

	const handleAnswerChange = (index: number, value: string) => {
		if (
			editedStory.type !== 'PHOTO_QUESTION' &&
			editedStory.type !== 'QUESTION'
		)
			return;
		if (!editedStory.answers) return;
		const newAnswers = [...editedStory.answers];
		newAnswers[index] = value;
		setEditedStory({ ...editedStory, answers: newAnswers });
	};

	const addAnswer = () => {
		if (
			editedStory.type !== 'PHOTO_QUESTION' &&
			editedStory.type !== 'QUESTION'
		)
			return;
		if (!editedStory.answers) return;
		setEditedStory({
			...editedStory,
			answers: [...editedStory.answers, ''],
		});
	};

	const removeAnswer = (index: number) => {
		if (
			editedStory.type !== 'PHOTO_QUESTION' &&
			editedStory.type !== 'QUESTION'
		)
			return;
		if (!editedStory.answers) return;
		if (!editedStory.correctAnswer) return;
		const newAnswers = editedStory.answers.filter((_, i) => i !== index);
		setEditedStory({
			...editedStory,
			answers: newAnswers,
			correctAnswer: Math.min(
				editedStory.correctAnswer,
				newAnswers.length - 1
			),
		});
	};

	const handleCapture = () => {
		if (
			editedStory.type === 'PHOTO' ||
			editedStory.type === 'PHOTO_QUESTION'
		) {
			navigate(Routes.STORY_PHOTO_CAPTURE, {
				onCapture: (uri) => handleChange('IMAGE', uri),
			});
		} else if (editedStory.type === 'VIDEO') {
			navigate(Routes.STORY_VIDEO_RECORDING, {
				onCapture: (uri) => handleChange('VIDEO', uri),
			});
		}
	};

	return (
		<ScrollView className='flex-1 bg-gray-900'>
			<View className='p-4'>
				<Text className='text-white text-xl font-bold mb-4 mt-16'>
					Edit Story
				</Text>

				<Text className='text-white mb-2'>Story Type</Text>
				<Picker
					selectedValue={editedStory.type}
					onValueChange={(value) => handleChange('type', value)}
					style={{ color: 'white', backgroundColor: '#374151' }}>
					<Picker.Item label='Photo' value='PHOTO' />
					<Picker.Item label='Video' value='VIDEO' />
					<Picker.Item label='Question' value='QUESTION' />
					<Picker.Item
						label='Photo Question'
						value='PHOTO_QUESTION'
					/>
				</Picker>

				{(editedStory.type === 'PHOTO' ||
					editedStory.type === 'PHOTO_QUESTION' ||
					editedStory.type === 'VIDEO') && (
					<Pressable
						onPress={handleCapture}
						className='flex-row items-center bg-blue-500 p-3 rounded-xl mt-4 mb-2'>
						<Camera color='white' size={24} />
						<Text className='text-white ml-2'>
							{editedStory.type === 'VIDEO'
								? 'Capture New Video'
								: 'Capture New Photo'}
						</Text>
					</Pressable>
				)}

				{editedStory.type === 'PHOTO' && (
					<>
						<Text className='text-white mb-2 mt-4'>Photo Text</Text>
						<TextInput
							value={editedStory.text}
							onChangeText={(value) =>
								handleChange('text', value)
							}
							placeholder='Enter photo text'
							placeholderTextColor='#9CA3AF'
							className='bg-gray-700 text-white p-3 rounded-xl mb-2'
						/>
						<Text className='text-white mb-2'>Text Position</Text>
						<Picker
							selectedValue={editedStory.textPosition}
							onValueChange={(value) =>
								handleChange('textPosition', value)
							}
							style={{
								color: 'white',
								backgroundColor: '#374151',
							}}>
							<Picker.Item label='Top' value='top' />
							<Picker.Item label='Bottom' value='bottom' />
						</Picker>
					</>
				)}

				{editedStory.type === 'VIDEO' && (
					<>
						<Text className='text-white mb-2 mt-4'>
							Video Caption
						</Text>
						<TextInput
							value={editedStory.caption}
							onChangeText={(value) =>
								handleChange('caption', value)
							}
							placeholder='Enter video caption'
							placeholderTextColor='#9CA3AF'
							className='bg-gray-700 text-white p-3 rounded-xl mb-2'
						/>
					</>
				)}

				{(editedStory.type === 'QUESTION' ||
					editedStory.type === 'PHOTO_QUESTION') && (
					<>
						<Text className='text-white mb-2 mt-4'>Question</Text>
						<TextInput
							value={editedStory.question}
							onChangeText={(value) =>
								handleChange('QUESTION', value)
							}
							placeholder='Enter question'
							placeholderTextColor='#9CA3AF'
							className='bg-gray-700 text-white p-3 rounded-xl mb-2'
						/>
						<Text className='text-white mb-2'>Description</Text>
						<TextInput
							value={editedStory.description}
							onChangeText={(value) =>
								handleChange('description', value)
							}
							placeholder='Enter description'
							placeholderTextColor='#9CA3AF'
							className='bg-gray-700 text-white p-3 rounded-xl mb-2'
						/>
						<Text className='text-white mb-2'>Answers</Text>
						{editedStory.answers?.map((answer, index) => (
							<View
								key={index}
								className='flex-row items-center mb-2'>
								<TextInput
									value={answer}
									onChangeText={(value) =>
										handleAnswerChange(index, value)
									}
									placeholder={`Answer ${index + 1}`}
									placeholderTextColor='#9CA3AF'
									className='bg-gray-700 text-white p-3 rounded-xl flex-grow mr-2'
								/>
								<Pressable
									onPress={() => removeAnswer(index)}
									className='bg-red-500 p-3 rounded-xl'>
									<X color='white' size={20} />
								</Pressable>
							</View>
						))}
						<Pressable
							onPress={addAnswer}
							className='bg-green-500 p-3 rounded-xl mb-4'>
							<Plus color='white' size={20} />
						</Pressable>
						<Text className='text-white mb-2'>Correct Answer</Text>
						<Picker
							selectedValue={editedStory.correctAnswer}
							onValueChange={(value) =>
								handleChange('correctAnswer', value)
							}
							style={{
								color: 'white',
								backgroundColor: '#374151',
							}}>
							{editedStory.answers?.map((_, index) => (
								<Picker.Item
									key={index}
									label={`Answer ${index + 1}`}
									value={index}
								/>
							))}
						</Picker>
					</>
				)}

				<Pressable
					onPress={handleSubmit}
					className='bg-blue-500 p-4 rounded-xl mt-6'>
					<Text className='text-white text-center text-lg font-bold'>
						Save Changes
					</Text>
				</Pressable>
			</View>
		</ScrollView>
	);
};

export default StoryEditor;
