import {
	StoryHeaderProps,
	StoryListProps,
	StoryModalProps,
} from '@birdwingo/react-native-instagram-stories/src/core/dto/componentsDTO';
import { InstagramStoriesProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/instagramStoriesDTO';
import { ReactNode } from 'react';

export type PreviewListProps = {
	data: InstagramStoryProps[];
	chapters: TChapter[];
	containerProps?: ScrollView['props'];
	progress: Map<string, number>;
	onPress: (id: string) => void;
};

export type CustomStoryProps = InstagramStoriesProps & {
	avatarWidth?: number;
	avatarHeight?: number;
	PreviewList: FC<PreviewListProps>;

	chapters: TChapter[];
	containerProps?: ScrollView['props'];
	progress: Map<string, number>;
};

export type CustomStoryModalProps = StoryModalProps & {
	creatorId: string;
	stories: CustomStoryItemProps[];
	component?: ReactNode;
};

type CustomStoryHeaderProps = StoryHeaderProps & {
	userId: string | undefined;
};

export interface CustomLoaderProps {
	loading: SharedValue<boolean>;
	color: SharedValue<string[]>;
	width: number;
	height: number;
}
