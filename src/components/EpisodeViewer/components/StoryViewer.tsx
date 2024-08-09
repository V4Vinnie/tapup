import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Pressable, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import StoryViewItem from './StoryViewItem';
import StoryHeader from './StoryHeader';
import StoryEditor from './StoryEditor';
import BottomSheetModal from './BottomSheetModal';
import { TPhotoStory, TStory, TStoryTypes, TVideoStory } from '../../../types';
import { useNavigation } from '@react-navigation/native';
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../../navigation/Routes';
import { Timestamp } from 'firebase/firestore';
import {
	setProgressForChapter,
	watchChapter,
} from '../../../database/services/TapService';
import { useAuth } from '../../../providers/AuthProvider';
import { useCompany } from '../../../providers/CompanyProvider';
import { mode, themeColors } from '../../../utils/constants';

type StoryViewerProps = NativeStackScreenProps<
	RootStackParamList,
	'StoryViewer'
>;

const StoryViewer = ({ route }: StoryViewerProps) => {
	const { newVideoUri, newPhotoUri, chapter, startIndex } = route.params;
	const { navigate, goBack } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();
	const {companyColor} = useCompany()

	const [stories, setStories] = useState<TStory[]>(chapter.frames);
	const [currentIndex, setCurrentIndex] = useState(Math.min(startIndex ?? 0, chapter.frames.length - 1));
	const [isEditing, setIsEditing] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newStoryType, setNewStoryType] = useState<TStoryTypes | null>(null);
	const [newStoryText, setNewStoryText] = useState('');
	const [newQuestionAnswers, setNewQuestionAnswers] = useState([
		'',
		'',
		'',
		'',
	]);
	const [newQuestionCorrectAnswer, setNewQuestionCorrectAnswer] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState<
		Record<string, number>
	>({});
	const [showResults, setShowResults] = useState<Record<string, boolean>>({});
	const [nextButtonDisabled, setNextButtonDisabled] = useState(false);

	const handleAnswerSelection = (storyId: string, answerIndex: number) => {
		// const story = stories.find((s) => s.id === storyId);
		setSelectedAnswers((prev) => ({ ...prev, [storyId]: answerIndex }));
		setShowResults((prev) => ({ ...prev, [storyId]: true }));
	};

	useEffect(() => {
		if (newVideoUri) {
			addNewVideo(newVideoUri);
		} else if (newPhotoUri) {
			addNewPhoto(newPhotoUri);
		}
	}, [newVideoUri, newPhotoUri]);

	const addNewVideo = (videoUri: string) => {
		const newStory: TVideoStory = {
			id: Date.now().toString(),
			type: 'VIDEO',
			video: videoUri,
			caption: newStoryText,
			createdAt: new Timestamp(Date.now() / 1000, 0),
		};
		setStories((prev) => [...prev, newStory]);
		setCurrentIndex(stories.length);
		setNewStoryText('');
		setIsModalVisible(false);
	};

	const addNewPhoto = (photoUri: string) => {
		const newStory: TPhotoStory = {
			id: Date.now().toString(),
			type: 'PHOTO',
			image: photoUri,
			text: newStoryText,
			textPosition: 'bottom',
			createdAt: new Timestamp(Date.now() / 1000, 0),
		};
		setStories((prev) => [...prev, newStory]);
		setCurrentIndex(stories.length);
		setNewStoryText('');
		setIsModalVisible(false);
	};

	const addNewQuestion = () => {
		if (!newStoryType) return;
		if (newStoryType !== 'QUESTION' && newStoryType !== 'PHOTO_QUESTION')
			return;
		const newStory: TStory =
			newStoryType === 'PHOTO_QUESTION'
				? {
						id: Date.now().toString(),
						type: newStoryType,
						question: newStoryText,
						description: '',
						answers: newQuestionAnswers.filter(
							(answer) => answer !== ''
						),
						correctAnswer: newQuestionCorrectAnswer,
						image: 'https://via.placeholder.com/400x320',
						createdAt: new Timestamp(Date.now() / 1000, 0),
					}
				: {
						id: Date.now().toString(),
						type: newStoryType,
						question: newStoryText,
						description: '',
						answers: newQuestionAnswers.filter(
							(answer) => answer !== ''
						),
						correctAnswer: newQuestionCorrectAnswer,
						createdAt: new Timestamp(Date.now() / 1000, 0),
					};
		setStories((prev) => [...prev, newStory]);
		setCurrentIndex(stories.length);
		setNewStoryText('');
		setNewQuestionAnswers(['', '', '', '']);
		setNewQuestionCorrectAnswer(0);
		setIsModalVisible(false);
	};

	const deleteCurrentStory = () => {
		if (stories.length > 1) {
			setStories((prev) =>
				prev.filter((_, index) => index !== currentIndex)
			);
			setCurrentIndex((prev) => Math.min(prev, stories.length - 2));
		}
	};

	const navigateStory = (direction: number) => {
		if (!isEditing) {
			setProgressForChapter(
				user!,
				chapter.chapterId,
				currentIndex + direction
			);
			setCurrentIndex((prev) =>
				Math.max(0, Math.min(prev + direction, stories.length - 1))
			);
		}
	};

	const storyDone = () => {
		setProgressForChapter(user!, chapter.chapterId, chapter.frames.length);
		watchChapter(user!, chapter.chapterId);
		goBack();
	};

	const closeStory = () => {
		goBack();
	};

	const updateCurrentStory = (updatedStory: TStory) => {
		setStories((prev) =>
			prev.map((story) =>
				story.id === updatedStory.id ? updatedStory : story
			)
		);
		setIsEditing(false);
	};

	const openModal = useCallback(() => {
		setIsModalVisible(true);
	}, []);

	const closeModal = useCallback(() => {
		setIsModalVisible(false);
		setNewStoryType(null);
		setNewStoryText('');
		setNewQuestionAnswers(['', '', '', '']);
		setNewQuestionCorrectAnswer(0);
	}, []);

	const handlePhotoCapture = useCallback(() => {
		closeModal();
		navigate(Routes.STORY_PHOTO_CAPTURE, {});
	}, []);

	const handleVideoCapture = useCallback(() => {
		closeModal();
		navigate(Routes.STORY_VIDEO_RECORDING, {});
	}, []);

	const isOnLastFrame = useMemo(
		() => currentIndex === stories.length - 1,
		[currentIndex, stories]
	);

	const renderModalContent = () => {
		if (!newStoryType) {
			return (
				<View>
					<Text className='text-white text-xl font-bold mb-4'>
						Add New Story
					</Text>
					<Pressable
						className='bg-blue-500 p-4 rounded-xl mb-2'
						onPress={() => setNewStoryType('PHOTO')}>
						<Text className='text-white text-lg'>Photo</Text>
					</Pressable>
					<Pressable
						className='bg-blue-500 p-4 rounded-xl mb-2'
						onPress={() => setNewStoryType('VIDEO')}>
						<Text className='text-white text-lg'>Video</Text>
					</Pressable>
					<Pressable
						className='bg-blue-500 p-4 rounded-xl mb-2'
						onPress={() => setNewStoryType('QUESTION')}>
						<Text className='text-white text-lg'>Question</Text>
					</Pressable>
					<Pressable
						className='bg-blue-500 p-4 rounded-xl mb-2'
						onPress={() => setNewStoryType('PHOTO_QUESTION')}>
						<Text className='text-white text-lg'>
							Photo Question
						</Text>
					</Pressable>
				</View>
			);
		}

		if (newStoryType === 'PHOTO' || newStoryType === 'VIDEO') {
			return (
				<View>
					<Text className='text-white text-xl font-bold mb-4'>
						{newStoryType === 'PHOTO'
							? 'Add New Photo'
							: 'Add New Video'}
					</Text>
					<TextInput
						className='bg-gray-700 text-white p-2 rounded-xl mb-4'
						placeholder={
							newStoryType === 'PHOTO'
								? 'Enter photo text'
								: 'Enter video caption'
						}
						placeholderTextColor='#9CA3AF'
						value={newStoryText}
						onChangeText={setNewStoryText}
					/>
					<Pressable
						className='bg-blue-500 p-4 rounded-xl mb-2'
						onPress={
							newStoryType === 'PHOTO'
								? handlePhotoCapture
								: handleVideoCapture
						}>
						<Text className='text-white text-lg'>
							{newStoryType === 'PHOTO'
								? 'Take Photo'
								: 'Record Video'}
						</Text>
					</Pressable>
				</View>
			);
		}

		if (newStoryType === 'QUESTION' || newStoryType === 'PHOTO_QUESTION') {
			return (
				<View>
					<Text className='text-white text-xl font-bold mb-4'>
						Add New{' '}
						{newStoryType === 'PHOTO_QUESTION'
							? 'Photo Question'
							: 'Question'}
					</Text>
					<TextInput
						className='bg-gray-700 text-white p-2 rounded-xl mb-4'
						placeholder='Enter question'
						placeholderTextColor='#9CA3AF'
						value={newStoryText}
						onChangeText={setNewStoryText}
					/>
					{newQuestionAnswers.map((answer, index) => (
						<View
							key={index}
							className='flex-row items-center mb-2'>
							<TextInput
								className='bg-gray-700 text-white p-2 rounded-xl flex-grow mr-2'
								placeholder={`Answer ${index + 1}`}
								placeholderTextColor='#9CA3AF'
								value={answer}
								onChangeText={(text) => {
									const newAnswers = [...newQuestionAnswers];
									newAnswers[index] = text;
									setNewQuestionAnswers(newAnswers);
								}}
							/>
							<Pressable
								className='bg-red-500 p-2 rounded-xl'
								onPress={() => {
									const newAnswers =
										newQuestionAnswers.filter(
											(_, i) => i !== index
										);
									setNewQuestionAnswers(newAnswers);
									if (newQuestionCorrectAnswer === index) {
										setNewQuestionCorrectAnswer(0);
									}
								}}>
								<Text className='text-white'>Remove</Text>
							</Pressable>
						</View>
					))}
					<Pressable
						className='bg-green-500 p-2 rounded-xl mb-4'
						onPress={() =>
							setNewQuestionAnswers([...newQuestionAnswers, ''])
						}>
						<Text className='text-white text-center'>
							Add Answer
						</Text>
					</Pressable>
					<Text className='text-white mb-2'>
						Select correct answer:
					</Text>
					<View className='flex-row flex-wrap'>
						{newQuestionAnswers.map((_, index) => (
							<Pressable
								key={index}
								className={`p-2 rounded-xl mr-2 mb-2 ${newQuestionCorrectAnswer === index ? 'bg-blue-500' : 'bg-gray-700'}`}
								onPress={() =>
									setNewQuestionCorrectAnswer(index)
								}>
								<Text className='text-white'>{index + 1}</Text>
							</Pressable>
						))}
					</View>
					<Pressable
						className='bg-blue-500 p-4 rounded-xl mt-4'
						onPress={addNewQuestion}>
						<Text className='text-white text-lg text-center'>
							Add Question
						</Text>
					</Pressable>
				</View>
			);
		}
	};

	const currentStory = stories[currentIndex];

	return (
		<View className='flex-1 bg-gray-900'>
			<SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
				<View className='flex-1 px-4 py-2'>
					<View className='flex-1 bg-gray-800 rounded-3xl overflow-hidden my-2'>
						<View className='flex-1'>
							{currentStory &&
								(isEditing ? (
									<StoryEditor
										story={currentStory}
										updateStory={updateCurrentStory}
									/>
								) : (
									<StoryViewItem
										story={currentStory}
										selectedAnswer={
											selectedAnswers[currentStory.id]
										}
										showResult={
											showResults[currentStory.id]
										}
										onAnswerSelect={handleAnswerSelection}
										setNextButtonDisabled={
											setNextButtonDisabled
										}
									/>
								))}
							<StoryHeader
								chapter={chapter}
								currentIndex={currentIndex}
								totalStories={stories.length}
								isEditing={isEditing}
								setIsEditing={setIsEditing}
								openModal={openModal}
								deleteCurrentStory={deleteCurrentStory}
								closeStory={closeStory}
							/>
						</View>
					</View>
					{!isEditing && (
						<View className='h-16 justify-end mb-4'>
							<View className='flex-row justify-between'>
								<Pressable
									onPress={() => navigateStory(-1)}
									className='bg-gray-800 rounded-full p-3 w-[30%] h-12 justify-center items-center'
									disabled={currentIndex === 0}>
									<ChevronLeft
										color={
											currentIndex === 0
												? themeColors[mode].textColor
												: 'white'
										}
										size={24}
									/>
								</Pressable>
								<Pressable
									onPress={() => {
										isOnLastFrame
											? storyDone()
											: navigateStory(1);
									}}
									className={`rounded-full px-6 py-3 w-[68%] h-12 flex-row items-center justify-center ml-[2%] ${
										nextButtonDisabled
											? 'opacity-50'
											: 'opacity-100'
									}`}
									style={{ 
										backgroundColor: companyColor
									 }}
									disabled={nextButtonDisabled}>
									<Text className='text-white text-base font-semibold mr-2'>
										{isOnLastFrame ? 'Finish' : 'Next'}
									</Text>
									<ChevronRight color='white' size={20} />
								</Pressable>
							</View>
						</View>
					)}
				</View>
			</SafeAreaView>

			<BottomSheetModal isVisible={isModalVisible} onClose={closeModal}>
				{renderModalContent()}
			</BottomSheetModal>
		</View>
	);
};

export default StoryViewer;
