import { Video } from 'react-native-compressor';

export const compressVideo = async (videoUrl) => {
	const result = await Video.compress(
		videoUrl,
		{
			compressionMethod: 'auto',
		},
		(progress) => {
			console.log('Compression Progress: ', progress);
		}
	);
	return result;
};
