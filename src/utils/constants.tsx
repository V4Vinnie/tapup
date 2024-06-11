import settings from '../../tailwind.config';
import { Routes } from '../navigation/Routes';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

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

export const SKELETON_WAIT_TIME = 0;

export const themeColors = settings.theme.extend.colors;
export const mode = themeColors.darkMode ? 'dark' : 'light';

const ICON_SIZE = 24;
export const bottomNavIcons = (isFocused: boolean) => {
	return {
		[Routes.HOME]: isFocused ? (
			<MCIcon
				key='home'
				name='home'
				size={ICON_SIZE}
				color={themeColors[mode].textColor}
			/>
		) : (
			<MCIcon
				key='home'
				name='home-outline'
				size={ICON_SIZE}
				color={themeColors[mode].textColor}
			/>
		),
		[Routes.DISCOVER]: isFocused ? (
			<MCIcon
				key='discover'
				name='compass'
				size={ICON_SIZE}
				color={themeColors[mode].textColor}
			/>
		) : (
			<MCIcon
				key='discover'
				name='compass-outline'
				size={ICON_SIZE}
				color={themeColors[mode].textColor}
			/>
		),
		[Routes.CREATE]: isFocused ? (
			<IonIcon
				key='create'
				name='add-circle'
				size={ICON_SIZE}
				color={themeColors[mode].textColor}
			/>
		) : (
			<IonIcon
				key='create'
				name='add-circle-outline'
				size={ICON_SIZE}
				color={themeColors[mode].textColor}
			/>
		),
		[Routes.LIKED]: isFocused ? (
			<MCIcon
				key='liked'
				name='heart'
				size={ICON_SIZE}
				color={themeColors[mode].textColor}
			/>
		) : (
			<MCIcon
				key='liked'
				name='heart-outline'
				size={ICON_SIZE}
				color={themeColors[mode].textColor}
			/>
		),
		[Routes.ACCOUNT]: isFocused ? (
			<MCIcon
				key='account'
				name='account'
				size={ICON_SIZE}
				color={themeColors[mode].textColor}
			/>
		) : (
			<MCIcon
				key='account'
				name='account-outline'
				size={ICON_SIZE}
				color={themeColors[mode].textColor}
			/>
		),
	} as any;
};
