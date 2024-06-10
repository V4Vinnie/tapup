import { InstagramStoryProps } from '@birdwingo/core/dto/instagramStoriesDTO';
import { TChapter } from '../types';
import { getProfile } from '../database/services/UserService';
import { CustomInstagramStoryProps } from '../components/Custom/CustomStoryList';

export async function makeStoriesFromChapters(
	chapters: TChapter[]
): Promise<CustomInstagramStoryProps[]> {
	const stories = chapters.map(async (chapter, index) => {
		const profile = chapter.creatorId
			? await getProfile(chapter.creatorId)
			: null;

		const res = {
			id: chapter.chapterId,
			name: profile?.name ?? '',
			imgUrl: profile?.profilePic ?? '',
			stories: [] as CustomInstagramStoryProps['stories'],
		};
		chapter.frames.forEach((frame, index) => {
			res.stories.push({
				id: frame.id,
				sourceUrl: frame.media,
				mediaType: frame.mediaType.toLowerCase() as
					| 'image'
					| 'video'
					| 'component',
				source: { uri: frame.media },
			});
		});
		return res;
	});
	return Promise.all(stories);
}
