declare module '*.png' {
	const value: any;
	export = value;
}

declare module '*.svg' {
	import { SvgProps } from 'react-native-svg';
	const content: React.FC<SvgProps>;
	export default content;
}

declare module '@env' {
	export const FIREBASE_API_KEY: string;
	export const FIREBASE_AUTH_DOMAIN: string;
	export const FIREBASE_DATABASE_URL: string;
	export const FIREBASE_PROJECT_ID: string;
	export const FIREBASE_STORAGE_BUCKET: string;
	export const FIREBASE_MESSAGING_SENDER_ID: string;
	export const FIREBASE_APP_ID: string;
	export const FIREBASE_MEASUREMENT_ID: string;
}

declare module process {
	interface env {
		FIREBASE_API_KEY: string;
		FIREBASE_AUTH_DOMAIN: string;
		FIREBASE_DATABASE_URL: string;
		FIREBASE_PROJECT_ID: string;
		FIREBASE_STORAGE_BUCKET: string;
		FIREBASE_MESSAGING_SENDER_ID: string;
		FIREBASE_APP_ID: string;
		FIREBASE_MEASUREMENT_ID: string;
	}
}

interface String {
	readonly isBlank: boolean;
	readonly startsWithOrEndsWithSpaces: boolean;
	readonly isValidEmail: boolean;
}
