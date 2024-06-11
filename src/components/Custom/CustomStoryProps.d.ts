import {
	StoryHeaderProps,
	StoryListProps,
	StoryModalProps,
	StoryModalPublicMethods,
} from '@birdwingo/core/dto/componentsDTO';
import {
	InstagramStoriesProps,
	InstagramStoriesPublicMethods,
} from '@birdwingo/core/dto/instagramStoriesDTO';
import { ReactNode } from 'react';
import { CustomInstagramStoryProps, Override } from './CustomStoryList';

export type PreviewListProps = {
	data: InstagramStoryProps[];
	chapters: TChapter[];
	containerProps?: ScrollView['props'];
	progress: Map<string, number>;
	onPress: (id: string) => void;
};

export interface CustomStoryProps extends InstagramStoriesProps {
	avatarWidth?: number;
	avatarHeight?: number;
	PreviewList: FC<PreviewListProps>;
	stories: CustomInstagramStoryProps[];

	chapters: TChapter[];
	containerProps?: ScrollView['props'];
	progress: Map<string, number>;
}

export interface CustomStoryModalProps extends StoryModalProps {
	creatorId: string;
	stories: CustomInstagramStoryProps[];
	component?: ReactNode;
}

type CustomStoryHeaderProps = StoryHeaderProps & {
	userId: string | undefined;
};

export interface CustomLoaderProps {
	loading: SharedValue<boolean>;
	color: SharedValue<string[]>;
	width: number;
	height: number;
}

export interface CustomInstagramStoriesPublicMethods {
	spliceStories: (
		stories: CustomInstagramStoryProps[],
		index?: number
	) => void;
	spliceUserStories: (
		stories: StoryItemProps[],
		user: string,
		index?: number
	) => void;
	setStories: (stories: CustomInstagramStoryProps[]) => void;
	clearProgressStorage: () => void;
	hide: () => void;
	show: (id?: string) => void;
	pause: () => void;
	resume: () => void;
	goToPreviousStory: () => void;
	goToNextStory: () => void;
	getCurrentStory: () => { userId?: string; storyId?: string };
}
