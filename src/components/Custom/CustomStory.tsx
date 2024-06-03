import {
	forwardRef,
	useImperativeHandle,
	useState,
	useEffect,
	useRef,
	memo,
} from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { Image } from 'react-native';
import {
	clearProgressStorage,
	getProgressStorage,
	setProgressStorage,
} from './CustomStoryStorage';
import { InstagramStoriesPublicMethods } from '@birdwingo/react-native-instagram-stories/src/core/dto/instagramStoriesDTO';
import { ProgressStorageProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/helpersDTO';
import {
	SEEN_LOADER_COLORS,
	STORY_AVATAR_SIZE,
	AVATAR_SIZE,
} from '@birdwingo/react-native-instagram-stories/src/core/constants';
import { StoryModalPublicMethods } from '@birdwingo/react-native-instagram-stories/src/core/dto/componentsDTO';
import { mode, themeColors } from '../../utils/constants';
import CustomStoryModal from './CustomStoryModal';
import { CustomStoryProps } from './CustomStoryProps';
import { useAuth } from '../../providers/AuthProvider';

const BACKGROUND_COLOR = themeColors[mode].primaryBackground;
const CLOSE_COLOR = themeColors[mode].textColor;
const DEFAULT_COLORS = 'transparent';
const ANIMATION_DURATION = 8000;

const CustomStory = forwardRef<InstagramStoriesPublicMethods, CustomStoryProps>(
	(
		{
			PreviewList,
			stories,
			chapters,
			progress,

			saveProgress = true,
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
		const { user } = useAuth();
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
				? getProgressStorage(user?.uid!)
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

		const onSeenStoriesChange = async (
			chapterId: string,
			value: string
		) => {
			if (!saveProgress) {
				return;
			}

			if (seenStories.value[chapterId]) {
				const userData = data.find((story) => story.id === chapterId);
				const oldIndex = userData?.stories.findIndex(
					(story) => story.id === seenStories.value[chapterId]
				);
				const newIndex = userData?.stories.findIndex(
					(story) => story.id === value
				);

				if (oldIndex! > newIndex!) {
					return;
				}
			}

			seenStories.value = await setProgressStorage(
				user?.uid!,
				chapterId,
				value
			);
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
					creatorId={chapters[0].creatorId}
					{...props}
				/>
			</>
		);
	}
);

export default memo(CustomStory);
