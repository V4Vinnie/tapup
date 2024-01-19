import { Timestamp } from 'firebase/firestore';

export interface TUser extends User {
	id: string;
	name: string;
	profilePic: string;
	email: string;
	role: 'USER' | 'ADMIN' | 'CREATOR';

	topicSubscriptionIds?: string[];
	userSubscriptionIds?: string[];
	badges?: TBadge[];
	companyId?: string;
	companyRole?: 'EMPLOYER' | 'EMPLOYEE';
}

export type TTopic = {
	id: string;
	name: string;
};

export type TTap = {
	id: string;
	name: string;
	description: string;
	topicId: string;
	chapterIds: string[];
	companyId: string;
	createdAt: Timestamp;
};

export type TChapter = {
	id: string;
	name: string;
	description: string;
	tapId: string;
	creatorId: string;
	creationDate: Timestamp;
};

export type TBadge = {
	id: string;
	img: string;
	name: string;
};
