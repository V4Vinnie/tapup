import { TTap, TTopic } from '../types';

export const Routes = {
	WELCOME: 'Welcome',
	HOME_LANDING: 'HomeLanding',
	HOME: 'Home',
	LOGIN: 'Login',
	SIGNUP: 'Signup',
	FORGOT_PASSWORD: 'ForgotPassword',
	SEARCH_SCREEN: 'SearchScreen',
	GENERAL_SEE_MORE: 'GeneralSeeMore',
} as const;

export type RootStackParamList = {
	Welcome: undefined;
	Login: undefined;
	Signup: undefined;
	ForgotPassword: undefined;
	Home: undefined;
	HomeLanding: undefined;
	SearchScreen: undefined;
	GeneralSeeMore: {
		title: string;
		data: TTap[] | TTopic[];
	};
};
