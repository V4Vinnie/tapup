import { Asset } from 'expo-asset';

export const cacheContents = (contents) => {
	return contents.map((contetn) => Asset.fromModule(contetn).downloadAsync());
};
