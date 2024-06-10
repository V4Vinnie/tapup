import { Image, Text, View } from 'react-native';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import {
	runOnJS,
	useAnimatedReaction,
	useDerivedValue,
	useSharedValue,
} from 'react-native-reanimated';
import { StoryImageProps } from '@birdwingo/core/dto/componentsDTO';
import Loader from '@birdwingo/components/Loader';
import { HEIGHT, LOADER_COLORS, WIDTH } from '@birdwingo/core/constants';
import ImageStyles from '@birdwingo/components/Image/Image.styles';
import { CustomInstagramStoryProps, Override } from './CustomStoryList';
import { VideoView, useVideoPlayer } from 'expo-video';
import Video, { VideoRef } from 'react-native-video';
import StoryVideo from '@birdwingo/components/Image/video';

interface CustomStoryImageProps extends Override<StoryImageProps, 'stories'> {
	stories: CustomInstagramStoryProps['stories'];
	isComponent?: boolean;
	component?: React.ReactNode;
	source: string;
}

const StoryImage: FC<CustomStoryImageProps> = ({
	stories,
	activeStory,
	source,
	isDefaultVideo,
	isComponent,
	component,
	paused,
	videoProps,
	isActive,
	onImageLayout,
	onLoad,
}) => {
	const [data, setData] = useState<{
		uri: string | undefined;
		isVideo?: boolean;
		isComponent?: boolean;
		component?: React.ReactNode;
	}>({
		uri: source,
		isVideo: isDefaultVideo,
		isComponent: isComponent,
		component: component,
	});

	const videoDuration = useSharedValue<number | undefined>(undefined);
	const loading = useSharedValue(true);
	const color = useSharedValue(LOADER_COLORS);
	const isPaused = useDerivedValue(() => paused.value || !isActive.value);

	const onImageChange = async () => {
		if (!activeStory.value) {
			return;
		}

		const story = stories.find((item) => item.id === activeStory.value);

		if (!story) {
			return;
		}

		if (data.uri === story.sourceUrl) {
			if (!loading.value) {
				onLoad(videoDuration.value);
			}
		} else {
			loading.value = true;
			setData({
				uri: story.sourceUrl,
				isVideo: story.mediaType === 'video',
			});
		}

		const nextStory = stories[stories.indexOf(story) + 1];

		if (nextStory && nextStory.mediaType !== 'video') {
			Image.prefetch(nextStory.sourceUrl!);
		}
	};

	useAnimatedReaction(
		() => isActive.value,
		(res, prev) => res !== prev && res && runOnJS(onImageChange)(),
		[isActive.value]
	);

	useAnimatedReaction(
		() => activeStory.value,
		(res, prev) => res !== prev && runOnJS(onImageChange)(),
		[activeStory.value]
	);

	const onContentLoad = (duration?: number) => {
		if (data.isVideo) {
			videoDuration.value = duration;
		}

		loading.value = false;

		if (isActive.value) {
			onLoad(duration);
		}
	};

	const player = useVideoPlayer(data.uri ?? '', (player) => {
		player.loop = false;
		player.play();
	});

	const start = () => player.replay();

	useAnimatedReaction(
		() => isActive.value,
		(res) => res && runOnJS(start)(),
		[isActive.value]
	);
	useEffect(() => {
		if (paused.value) {
			player.pause();
		} else {
			player.play();
		}
	}, [paused.value]);

	return (
		<>
			<View style={ImageStyles.container}>
				<Loader loading={loading} color={color} size={50} />
			</View>
			<View style={ImageStyles.image}>
				{data.uri &&
					(data.isVideo ? (
						<StoryVideo
							onLoad={onContentLoad}
							onLayout={onImageLayout}
							source={{ uri: data.uri }}
							paused={isPaused}
							isActive={isActive}
							{...videoProps}
						/>
					) : data.isComponent ? (
						data.component
					) : (
						<Image
							source={{ uri: data.uri }}
							style={{ width: WIDTH, aspectRatio: 0.5626 }}
							resizeMode='cover'
							testID='storyImageComponent'
							onLayout={(e) =>
								onImageLayout(
									Math.min(
										HEIGHT,
										e.nativeEvent.layout.height
									)
								)
							}
							onLoad={() => onContentLoad()}
						/>
					))}
			</View>
		</>
	);
};

export default memo(StoryImage);
