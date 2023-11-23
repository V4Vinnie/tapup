import { Asset } from 'expo-asset';

export const cacheContents = (contents) => {
	return contents.map((content) => Asset.fromModule(content).downloadAsync());
};
