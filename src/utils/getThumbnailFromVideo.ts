import * as VideoThumbnails from 'expo-video-thumbnails';

export const generatePreviewPhoto = async (
	videoUri: string
): Promise<string | undefined> => {
	try {
		const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
			time: 1000,
		});
		return uri;
	} catch (e) {
		console.warn(e);
	}
};
