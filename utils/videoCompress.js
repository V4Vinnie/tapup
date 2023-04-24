import { Video } from 'react-native-compressor';

export const compressVideo = async (videoUrl) => {
	const result = await Video.compress(
		videoUrl,
		{
			compressionMethod: 'auto',
		},
		(progress) => {
			if (backgroundMode) {
				console.log('Compression Progress: ', progress);
			}
		}
	);
	console.log(result);
	return result;
};
