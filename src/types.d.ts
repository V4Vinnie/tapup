import { Timestamp } from 'firebase/firestore';

export interface TUser extends User {
	id: string;
	name: string;
	profilePic: string;
	email: string;
	role: 'USER | ADMIN' | 'CREATOR';

	lastWatched?: Timestamp;
	selectedTopics?: string[];
	watchedFrames?: TFrame[];
	badges?: TBadge[];
	campagnyRole?: TCampagnyRole;
}

export type TFrame = {
	id: string;
	tapId: string;
	topicId: string;
	isDone: boolean;
	watchedContentIndex: number;
	watchedDate: Timestamp;
};

export type TBadge = {
	id: string;
	img: string;
	name: string;
};

export type TCampagnyRole = {
	_index: number;
	label: string;
	value: string;
};
