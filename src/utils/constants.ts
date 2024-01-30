import settings from '../../tailwind.config';

export const FONTS = {
	FAMILY: {
		LIGHT: 'Inter-Light',
		REGULAR: 'Inter-Regular',
		MEDIUM: 'Inter-Medium',
		SEMIBOLD: 'Inter-SemiBold',
		BOLD: 'Inter-Bold',
	},
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

export const SKELETON_WAIT_TIME = 700;

export const themeColors = settings.theme.extend.colors;
export const mode = themeColors.darkMode ? 'dark' : 'light';
