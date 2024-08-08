import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TPhotoStory, TStory } from '../../../types';

type Props = {
	story: TStory | null;
	setNextButtonDisabled?: (disabled: boolean) => void;
};

const PhotoView = ({ story, setNextButtonDisabled }: Props) => {
	const [imageLoading, setImageLoading] = useState(true);
	const [imageError, setImageError] = useState(false);

	useEffect(() => {
		if (setNextButtonDisabled) {
			setNextButtonDisabled(false);
		}
	}, []);

	story = story as TPhotoStory | null;
	if (!story || !story.image) {
		return (
			<View className='flex-1 justify-center items-center bg-black'>
				<Text className='text-white'>Error: Image not available</Text>
			</View>
		);
	}

	return (
		<View className='flex-1 bg-black'>
			<View className='flex-1 justify-center items-center'>
				{imageLoading && (
					<View className='absolute inset-0 flex items-center justify-center bg-opacity-50 z-10'>
						<ActivityIndicator size='large' color='#ffffff' />
					</View>
				)}
				<Image
					source={{ uri: story.image }}
					className='w-full h-full'
					resizeMode='cover'
					onLoadStart={() => setImageLoading(true)}
					onLoadEnd={() => setImageLoading(false)}
					onError={() => {
						setImageLoading(false);
						setImageError(true);
					}}
				/>
				{imageError && (
					<View className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
						<Text className='text-white'>Failed to load image</Text>
					</View>
				)}
			</View>
			<LinearGradient
				colors={['transparent', 'rgba(0,0,0,0.7)']}
				className='absolute bottom-0 left-0 right-0'>
				<View className='px-4 pb-4 pt-8'>
					<Text className='text-white text-sm'>{story.text}</Text>
				</View>
			</LinearGradient>
		</View>
	);
};

export default PhotoView;
