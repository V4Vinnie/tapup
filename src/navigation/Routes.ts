import { TChapter, TProfile, TStory, TTap, TTopic } from '../types';

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
	ACCOUNT: 'Settings',
	ACCOUNT_LANDING: 'SettingsLanding',
	ACCOUNT_SETTINGS: 'AccountSettings',
	PRIVACY_POLICY: 'PrivacyPolicy',
	MY_COMPANY: 'MyCompany',
	ADD_COMPANY_CODE: 'AddCompanyCode',
	STORY_VIEWER: 'StoryViewer',
	STORY_VIDEO_RECORDING: 'StoryVideoRecording',
	STORY_PHOTO_CAPTURE: 'StoryPhotoCapture',
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
	Settings: undefined;
	SettingsLanding: undefined;
	AccountSettings: undefined;
	PrivacyPolicy: undefined;
	MyCompany: undefined;
	AddCompanyCode: undefined;
	StoryViewer: {
		newVideoUri?: string;
		newPhotoUri?: string;
		chapter: TChapter;
		startIndex?: number;
	};
	StoryVideoRecording: {
		onCapture?: (uri: string) => void;
	};
	StoryPhotoCapture: {
		onCapture?: (uri: string) => void;
	};
};
