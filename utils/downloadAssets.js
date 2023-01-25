import { Asset } from 'expo-asset';

export const cacheImages = (images) => {
	return images.map((image) => Asset.fromModule(image).downloadAsync());
};

export const cacheVideo = (videos) => {
	return videos.map((video) => Asset.fromModule(video).downloadAsync());
};
