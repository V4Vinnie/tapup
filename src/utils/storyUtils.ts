import { InstagramStoryProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/instagramStoriesDTO';
import { TChapter } from '../types';
import { getProfile } from '../database/services/UserService';

export async function makeStoriesFromChapters(
	chapters: TChapter[]
): Promise<InstagramStoryProps[]> {
	const stories = chapters.map(async (chapter, index) => {
		const video =
			chapter.frames[0].mediaType === 'VIDEO'
				? chapter.frames[0].media
				: undefined;
		const thumbnail =
			chapter.frames[0].mediaType === 'IMAGE'
				? chapter.frames[0].media
				: undefined;
		const profile = chapter.creatorId
			? await getProfile(chapter.creatorId)
			: null;

		return {
			id: chapter.chapterId,
			name: chapter.name,
			imgUrl: profile?.profilePic ?? '',
			stories: [
				{
					id: chapter.chapterId,
					sourceUrl: video ?? thumbnail ?? '',
					mediaType: chapter.frames[0].mediaType.toLowerCase() as
						| 'image'
						| 'video',
				},
			],
		};
	});
	return Promise.all(stories);
}
