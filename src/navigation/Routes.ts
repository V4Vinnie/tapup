export const Routes = {
	WELCOME: 'Welcome',
	HOME_LANDING: 'HomeLanding',
	HOME: 'Home',
	LOGIN: 'Login',
	SIGNUP: 'Signup',
	FORGOT_PASSWORD: 'ForgotPassword',
} as const;

export type RootStackParamList = {
	Welcome: undefined;
	Login: undefined;
	Signup: undefined;
	ForgotPassword: undefined;
	Home: undefined;
	HomeLanding: undefined;
};
