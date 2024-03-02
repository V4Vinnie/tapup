/* 
const stories = [{
    id: 'user1',
    name: 'User 1',
    imgUrl: 'user1-profile-image-url',
    stories: [
      { id: 'story1', sourceUrl: 'story1-image-url' },
      { id: 'story2', sourceUrl: 'story1-video-url', mediaType: 'video' },
      // ...
    ]}, // ...
  ]; */

import { InstagramStoryProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/instagramStoriesDTO';
import { TChapter } from '../types';

export function makeStoriesFromChapters(
	chapters: TChapter[]
): InstagramStoryProps[] {
	const stories = chapters.map((chapter, index) => {
		const video =
			chapter.frames[0].mediaType === 'VIDEO'
				? chapter.frames[0].media
				: undefined;
		const thumbnail =
			chapter.frames[0].mediaType === 'IMAGE'
				? chapter.frames[0].media
				: undefined;

		return {
			id: chapter.chapterId,
			name: chapter.name,
			imgUrl: thumbnail,
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
	return stories;
}
