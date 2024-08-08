import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export type TProfile = {
	uid: string;
	name: string;
	//profilePic: string;
	email: string;
	role: 'USER' | 'ADMIN' | 'CREATOR';
	fullName: string;
	companyInfo: {
		companyCode: string;
		jobType: string;
		companyRole?: 'EMPLOYER' | 'EMPLOYEE';
	};
	watchedChapters: string[];
	progress: Record<string, number>;
	topicSubscriptionIds?: string[];
	userSubscriptionIds?: string[];
	badges?: TBadge[];
};

export type TTopic = {
	id: string;
	name: string;
};

export type TNotificationTopic = TTopic &
	TTap & {
		notification: number;
	};

export type TNotificationProfile = TProfile & {
	notification: number;
};

export type TTap = {
	id: string;
	name: string;
	fullName: string;
	description: string;
	thumbnail: string;
	chapters: TChapter[];
	topicId: string;
	companyCode: string;
	creatorId: string;
	createdAt: Timestamp;
};

export type TContinueWatchingTap = TTap & {
	progress?: number;
};

export type TChapter = {
	chapterId: string;
	name: string;
	frames: TStory[];
	tapId: string;
	creatorId: string;
};

export type TWatchedFrame = {
	frameId: string;
	tapId: string;
};

export type TBadge = {
	id: string;
	img: string;
	name: string;
};

export type TCompany = {
	code: string;
	name: string;
	primaryColor: string;
	logo: string;
};

export type TStoryTypes = 'PHOTO' | 'VIDEO' | 'QUESTION' | 'PHOTO_QUESTION';

export type TPhotoStory = {
	id: string;
	createdAt: Timestamp;
	type: 'PHOTO';
	image: string;
	text?: string;
	textPosition?: string;
	caption?: string;
};

export type TVideoStory = {
	id: string;
	createdAt: Timestamp;
	type: 'VIDEO';
	video: string;
	text?: string;
	textPosition?: string;
	caption?: string;
};

export type TQuestionStory = {
	id: string;
	createdAt: Timestamp;
	type: 'QUESTION';
	question: string;
	description?: string;
	answers?: string[];
	correctAnswer?: number;
};

export type TPhotoQuestionStory = {
	id: string;
	createdAt: Timestamp;
	type: 'PHOTO_QUESTION';
	image: string;
	question: string;
	description?: string;
	answers?: string[];
	correctAnswer?: number;
};

export type TStory =
	| TPhotoStory
	| TVideoStory
	| TQuestionStory
	| TPhotoQuestionStory;
