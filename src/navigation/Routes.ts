import { TProfile, TTap, TTopic } from '../types';

export const Routes = {
	WELCOME: 'Welcome',
	HOME_LANDING: 'HomeLanding',
	HOME: 'Home',
	LOGIN: 'Login',
	SIGNUP: 'Signup',
	FORGOT_PASSWORD: 'ForgotPassword',
	SEARCH_SCREEN: 'SearchScreen',
	SEE_MORE_TAPS: 'SeeMoreTaps',
	SEE_MORE_TOPICS: 'SeeMoreTopics',
	SEE_MORE_PROFILES: 'SeeMoreProfiles',
	PROFILE_SCREEN: 'ProfileScreen',
	TAP_SCREEN: 'TapScreen',
	TOPIC_SCREEN: 'TopicScreen',
	CREATE: 'Create',
	CREATE_LANDING: 'CreateLanding',
	LIKED: 'Liked',
	LIKED_LANDING: 'LikedLanding',
	ACCOUNT: 'Account',
	ACCOUNT_LANDING: 'AccountLanding',
} as const;

export type RootStackParamList = {
	Welcome: undefined;
	Login: undefined;
	Signup: undefined;
	ForgotPassword: undefined;
	Home: undefined;
	HomeLanding: undefined;
	SearchScreen: undefined;
	SeeMoreTaps: {
		title: string;
		taps: TTap[];
	};
	SeeMoreTopics: {
		title: string;
		topics: TTopic[];
	};
	SeeMoreProfiles: {
		title: string;
		profiles: TProfile[];
	};
	ProfileScreen: {
		profile: TProfile;
	};
	TapScreen: {
		selectedTopic: TTopic;
		initialTap: TTap;
		taps?: TTap[];
		profile?: TProfile;
	};
	TopicScreen: {
		topic: TTopic;
	};
	DiscoverLanding: undefined;
	Create: undefined;
	CreateLanding: undefined;
	Liked: undefined;
	LikedLanding: undefined;
	Account: undefined;
	AccountLanding: undefined;
};
