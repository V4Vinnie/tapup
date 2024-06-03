import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export type TProfile = {
	uid: string;
	name: string;
	profilePic: string;
	email: string;
	role: 'USER' | 'ADMIN' | 'CREATOR';

	watchedFrames: TWatchedFrame[];
	progress: ProgressStorageProps | null;
	topicSubscriptionIds?: string[];
	userSubscriptionIds?: string[];
	badges?: TBadge[];
	companyId?: string;
	companyRole?: 'EMPLOYER' | 'EMPLOYEE';
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
	creatorId: string;
	createdAt: Timestamp;
};

export type TContinueWatchingTap = TTap & {
	progress?: number;
};

export type TChapter = {
	chapterId: string;
	name: string;
	frames: TFrame[];
	tapId: string;
	creatorId: string;
};

export type TFrame = {
	id: string;
	media: string;
	mediaType: 'IMAGE' | 'VIDEO' | 'COMPONENT';
	createdAt: Timestamp;
	watchedBy?: string[];
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
