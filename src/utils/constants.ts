import settings from '../../tailwind.config';

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
};

export const themeColors = settings.theme.extend.colors;
export const mode = themeColors.darkMode ? 'dark' : 'light';
