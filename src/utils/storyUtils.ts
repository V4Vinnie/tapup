import { InstagramStoryProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/instagramStoriesDTO';
import { TChapter } from '../types';
import { getProfile } from '../database/services/UserService';

export async function makeStoriesFromChapters(
	chapters: TChapter[]
): Promise<InstagramStoryProps[]> {
	const stories = chapters.map(async (chapter, index) => {
		const profile = chapter.creatorId
			? await getProfile(chapter.creatorId)
			: null;

		const res = {
			id: chapter.chapterId,
			name: profile?.name ?? '',
			imgUrl: profile?.profilePic ?? '',
			stories: [] as InstagramStoryProps['stories'],
		};
		chapter.frames.forEach((frame, index) => {
			res.stories.push({
				id: frame.id,
				sourceUrl: frame.media,
				mediaType: frame.mediaType.toLowerCase() as 'image' | 'video',
			});
		});
		return res;
	});
	return Promise.all(stories);
}
