import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Camera, Cross, Edit, Plus, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from './ProgressBar';
import { useAuth } from '../../../providers/AuthProvider';
import { useCompany } from '../../../providers/CompanyProvider';
import { TChapter } from '../../../types';
import AntIcon from 'react-native-vector-icons/AntDesign';

type Props = {
	chapter: TChapter;
	currentIndex: number;
	totalStories: number;
	isEditing: boolean;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	openModal: () => void;
	deleteCurrentStory: () => void;
	closeStory: () => void;
};

const StoryHeader = ({
	chapter,
	currentIndex,
	totalStories,
	isEditing,
	setIsEditing,
	openModal,
	deleteCurrentStory,
	closeStory,
}: Props) => {
	const { user } = useAuth();
	const { company } = useCompany();

	return (
		<LinearGradient
			colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
			locations={[0, 0.6, 1]}
			className='absolute top-0 left-0 right-0 z-10'>
			<View className='px-4 pt-2 pb-2'>
				<ProgressBar
					currentIndex={currentIndex}
					totalStories={totalStories}
				/>
				<View className='flex-row justify-between items-center mt-4'>
					<View className='flex-row items-center'>
						<View className='rounded-full border-[1px] border-white bg-dark-primaryBackground p-[6px]'>
							<Image
								source={{ uri: company?.logo }}
								resizeMode='center'
								style={{
									width: 25,
									height: 25,
								}}
							/>
						</View>
						<Text className='text-white text-md font-bold ml-2'>
							{chapter.name}
						</Text>
					</View>
					{chapter.creatorId === user?.uid ? (
						<View className='flex-row space-x-6'>
							<Pressable onPress={() => setIsEditing(!isEditing)}>
								<Edit size={24} color='white' />
							</Pressable>
							<Pressable onPress={openModal}>
								<Plus size={24} color='white' />
							</Pressable>
							<Pressable onPress={deleteCurrentStory}>
								<Trash2 size={24} color='white' />
							</Pressable>
						</View>
					) : (
						<Pressable onPress={closeStory}>
							<AntIcon name='close' size={24} color='white' />
						</Pressable>
					)}
				</View>
			</View>
		</LinearGradient>
	);
};

export default StoryHeader;
