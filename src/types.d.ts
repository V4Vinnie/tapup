import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export type TProfile = {
	uid: string;
	name: string;
	profilePic: string;
	email: string;
	role: 'USER' | 'ADMIN' | 'CREATOR';

	watchedFrameIds: string[];
	topicSubscriptionIds?: string[];
	userSubscriptionIds?: string[];
	badges?: TBadge[];
	companyId?: string;
	companyRole?: 'EMPLOYER' | 'EMPLOYEE';
};
export type TUser = User & TProfile;

export type TTopic = {
	id: string;
	name: string;
};

export type TNotificationTopic = TTopic &
	TTap & {
		notification: boolean;
	};

export type TNotificationProfile = TProfile & {
	notification: boolean;
};

export type TTap = {
	id: string;
	name: string;
	description: string;
	thumbnail: string;
	chapters: TChapter[];
	topicId: string;
	companyId: string;
	createdAt: Timestamp;
};

export type TContinueWatchingTap = TTap & {
	progress?: number;
};

export type TChapter = {
	id: string;
	name: string;
	description: string;
	frames: TFrame[];
	tapId: string;
	creatorId: string;
	creationDate: Timestamp;
};

export type TFrame = {
	id: string;
	media: string;
	mediaType: 'IMAGE' | 'VIDEO';
	chapterId: string;
	creatorId: string;
	creationDate: Timestamp;
};

export type TBadge = {
	id: string;
	img: string;
	name: string;
};
