import resolveCofig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

export const FONTS = {
	FAMILY: {},
	SIZE: {
		XXS: 10,
		XS: 12,
		S: 14,
		M: 16,
		L: 18,
		XL: 20,
		XXL: 24,
	},
};

export const COLLECTIONS = {
	USERS: 'users',
	TAPS: 'taps',
	TOPICS: 'topics',
};

const config: Partial<import('tailwindcss').Config> =
	resolveCofig(tailwindConfig);
export const themeColors = config.theme!.colors as {
	dark: { [key: string]: string };
	light: { [key: string]: string };
};
export const mode = config.darkMode ? 'dark' : 'light';
