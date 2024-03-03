import React, { FC, ReactNode, memo } from 'react';
import Animated, {
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
} from 'react-native-reanimated';
import StoryAnimation from '@birdwingo/react-native-instagram-stories/src/components/Animation';
import ListStyles from '@birdwingo/react-native-instagram-stories/src/components/List/List.styles';
import { StoryListProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/componentsDTO';
import { HEIGHT } from '@birdwingo/react-native-instagram-stories/src/core/constants';
import StoryContent from '@birdwingo/react-native-instagram-stories/src/components/Content';
import StoryFooter from '@birdwingo/react-native-instagram-stories/src/components/Footer';
import CustomStoryImage from './CustomStoryImage';
import { StoryItemProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/instagramStoriesDTO';
import CustomStoryHeader from './CustomStoryHeader';
import { View } from 'react-native';
import CustomStoryProgress from './CustomStoryProgress';

export interface CustomStoryItemProps {
	id: string;
	sourceUrl: string;
	mediaType?: 'image' | 'video' | 'component';
	renderContent?: () => ReactNode;
	renderFooter?: () => ReactNode;
}

export type Override<
	T,
	K extends Partial<{ [P in keyof T]: any }> | string,
> = K extends string
	? Omit<T, K> & { [P in keyof T]: T[P] | unknown }
	: Omit<T, keyof K> & K;

export interface CustomStoryListProps
	extends Override<StoryListProps, 'stories'> {
	stories: CustomStoryItemProps[];
	component?: ReactNode;
	creatorId: string;
}

const StoryList: FC<CustomStoryListProps> = ({
	creatorId,

	id,
	stories,
	index,
	x,
	activeUser,
	activeStory,
	progress,
	seenStories,
	paused,
	onLoad,
	videoProps,
	progressColor,
	progressActiveColor,
	component,
	...props
}) => {
	const imageHeight = useSharedValue(HEIGHT);
	const isActive = useDerivedValue(() => activeUser.value === id);

	const activeStoryIndex = useDerivedValue(() =>
		stories.findIndex((item) => item.id === activeStory.value)
	);

	const animatedStyles = useAnimatedStyle(() => ({
		height: imageHeight.value,
	}));

	const onImageLayout = (height: number) => {
		imageHeight.value = height;
	};

	const lastSeenIndex = stories.findIndex(
		(item) => item.id === seenStories.value[id]
	);

	return (
		<StoryAnimation x={x} index={index}>
			<CustomStoryHeader {...props} userId={creatorId} />

			<Animated.View style={[animatedStyles, ListStyles.container]}>
				<View className='mx-2 overflow-hidden h-[95%] mt-8 rounded-lg bg-dark-secondaryBackground'>
					<CustomStoryImage
						stories={stories}
						activeStory={activeStory}
						defaultImage={
							stories[lastSeenIndex + 1]?.sourceUrl ??
							stories[0]?.sourceUrl
						}
						isDefaultVideo={
							(stories[lastSeenIndex + 1]?.mediaType ??
								stories[0]?.mediaType) === 'video'
						}
						isComponent={
							(stories[lastSeenIndex + 1]?.mediaType ??
								stories[0]?.mediaType) === 'component'
						}
						component={component}
						onImageLayout={onImageLayout}
						onLoad={onLoad}
						paused={paused}
						isActive={isActive}
						videoProps={videoProps}
					/>
				</View>
				<StoryContent
					stories={stories as StoryItemProps[]}
					active={isActive}
					activeStory={activeStory}
				/>
				<CustomStoryProgress
					active={isActive}
					activeStory={activeStoryIndex}
					progress={progress}
					length={stories.length}
					progressColor={progressColor}
					progressActiveColor={progressActiveColor}
				/>
			</Animated.View>
			<StoryFooter
				stories={stories as StoryItemProps[]}
				active={isActive}
				activeStory={activeStory}
			/>
		</StoryAnimation>
	);
};

export default memo(StoryList);
