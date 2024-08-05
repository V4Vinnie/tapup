import { TChapter, TStory } from '../types';
import { getProfile } from '../database/services/UserService';

export async function makeStoriesFromChapters(
	chapters: TChapter[]
): Promise<TStory[]> {
	const stories = chapters.map(async (chapter, index) => {
		const profile = chapter.creatorId
			? await getProfile(chapter.creatorId)
			: null;

		const res = {
			id: chapter.chapterId,
			name: profile?.name ?? '',
			imgUrl: profile?.profilePic ?? '',
			stories: [] as TStory[],
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
