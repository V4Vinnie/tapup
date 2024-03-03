import React, {
	forwardRef,
	useImperativeHandle,
	useState,
	useEffect,
	useRef,
	memo,
	FC,
} from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { Image, ScrollView } from 'react-native';
import {
	clearProgressStorage,
	getProgressStorage,
	setProgressStorage,
} from '@birdwingo/react-native-instagram-stories/src/core/helpers/storage';
import {
	InstagramStoriesProps,
	InstagramStoriesPublicMethods,
	InstagramStoryProps,
} from '@birdwingo/react-native-instagram-stories/src/core/dto/instagramStoriesDTO';
import { ProgressStorageProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/helpersDTO';
import {
	SEEN_LOADER_COLORS,
	STORY_AVATAR_SIZE,
	AVATAR_SIZE,
} from '@birdwingo/react-native-instagram-stories/src/core/constants';
import { StoryModalPublicMethods } from '@birdwingo/react-native-instagram-stories/src/core/dto/componentsDTO';
import { PreviewListProps } from '../ChapterList';
import { TChapter } from '../../types';
import { mode, themeColors } from '../../utils/constants';
import CustomStoryModal from './CustomStoryModal';

const BACKGROUND_COLOR = themeColors[mode].primaryBackground;
const CLOSE_COLOR = themeColors[mode].textColor;
const DEFAULT_COLORS = 'transparent';
const ANIMATION_DURATION = 8000;

export type CustomStoryProps = InstagramStoriesProps & {
	avatarWidth?: number;
	avatarHeight?: number;
	PreviewList: FC<PreviewListProps>;

	chapters: TChapter[];
	containerProps?: ScrollView['props'];
	progress: Map<string, number>;
};

const CustomStory = forwardRef<InstagramStoriesPublicMethods, CustomStoryProps>(
	(
		{
			PreviewList,
			stories,
			chapters,
			progress,

			saveProgress = false,
			avatarBorderColors = DEFAULT_COLORS,
			avatarSeenBorderColors = SEEN_LOADER_COLORS,
			avatarWidth = AVATAR_SIZE,
			avatarHeight = AVATAR_SIZE,
			storyAvatarSize = STORY_AVATAR_SIZE,
			listContainerStyle,
			listContainerProps,
			animationDuration = ANIMATION_DURATION,
			backgroundColor = BACKGROUND_COLOR,
			showName = false,
			nameTextStyle,
			videoAnimationMaxDuration,
			videoProps,
			closeIconColor = CLOSE_COLOR,
			...props
		},
		ref
	) => {
		const [data, setData] = useState(stories);

		const seenStories = useSharedValue<ProgressStorageProps>({});
		const loadedStories = useSharedValue(false);
		const loadingStory = useSharedValue<string | undefined>(undefined);

		const modalRef = useRef<StoryModalPublicMethods>(null);

		const onPress = (id: string) => {
			loadingStory.value = id;

			if (loadedStories.value) {
				modalRef.current?.show(id);
			}
		};

		const onLoad = () => {
			loadingStory.value = undefined;
		};

		const onStoriesChange = async () => {
			seenStories.value = await (saveProgress
				? getProgressStorage()
				: {});

			const promises = stories.map((story) => {
				const seenStoryIndex = story.stories.findIndex(
					(item) => item.id === seenStories.value[story.id]
				);
				const seenStory =
					story.stories[seenStoryIndex + 1] || story.stories[0];

				if (!seenStory) {
					return true;
				}

				return seenStory.mediaType !== 'video'
					? Image.prefetch(seenStory.sourceUrl)
					: true;
			});

			await Promise.all(promises);

			loadedStories.value = true;

			if (loadingStory.value) {
				onPress(loadingStory.value);
			}
		};

		const onSeenStoriesChange = async (user: string, value: string) => {
			if (!saveProgress) {
				return;
			}

			if (seenStories.value[user]) {
				const userData = data.find((story) => story.id === user);
				const oldIndex = userData?.stories.findIndex(
					(story) => story.id === seenStories.value[user]
				);
				const newIndex = userData?.stories.findIndex(
					(story) => story.id === value
				);

				if (oldIndex! > newIndex!) {
					return;
				}
			}

			seenStories.value = await setProgressStorage(user, value);
		};

		useImperativeHandle(
			ref,
			() => ({
				spliceStories: (newStories, index) => {
					if (index === undefined) {
						setData([...data, ...newStories]);
					} else {
						const newData = [...data];
						newData.splice(index, 0, ...newStories);
						setData(newData);
					}
				},
				spliceUserStories: (newStories, user, index) => {
					const userData = data.find((story) => story.id === user);

					if (!userData) {
						return;
					}

					const newData =
						index === undefined
							? [...userData.stories, ...newStories]
							: [...userData.stories];

					if (index !== undefined) {
						newData.splice(index, 0, ...newStories);
					}

					setData(
						data.map((value) =>
							value.id === user
								? {
										...value,
										stories: newData,
									}
								: value
						)
					);
				},
				setStories: (newStories) => {
					setData(newStories);
				},
				clearProgressStorage,
				hide: () => modalRef.current?.hide(),
				show: (id) => {
					if (id) {
						onPress(id);
					} else if (data[0]?.id) {
						onPress(data[0]?.id);
					}
				},
				pause: () => modalRef.current?.pause()!,
				resume: () => modalRef.current?.resume()!,
				getCurrentStory: () => modalRef.current?.getCurrentStory()!,
			}),
			[data]
		);

		useEffect(() => {
			onStoriesChange();
		}, [data]);

		useEffect(() => {
			setData(stories);
		}, [stories]);

		return (
			<>
				<PreviewList
					data={data}
					chapters={chapters}
					progress={progress}
					onPress={onPress}
				/>
				<CustomStoryModal
					ref={modalRef}
					stories={data}
					seenStories={seenStories}
					duration={animationDuration}
					storyAvatarSize={storyAvatarSize}
					onLoad={onLoad}
					onSeenStoriesChange={onSeenStoriesChange}
					backgroundColor={backgroundColor}
					videoDuration={videoAnimationMaxDuration}
					videoProps={videoProps}
					closeIconColor={closeIconColor}
					{...props}
				/>
			</>
		);
	}
);

export default memo(CustomStory);
