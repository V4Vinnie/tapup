import {
	collection,
	deleteDoc,
	doc,
	documentId,
	getDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { DB } from '../Firebase';
import { COLLECTIONS } from '../../utils/constants';
import { TNotificationProfile, TProfile, TTap } from '../../types';
import { getProfile } from './UserService';
import { deleteUser } from 'firebase/auth';

export const getProfiles = async () => {
	const usersRef = collection(DB, COLLECTIONS.USERS);
	const allUsers = await getDocs(usersRef);
	return allUsers.docs.map((doc) => {
		return {
			...(doc.data() as TProfile),
			notification: Math.floor(Math.random() * 100), // TODO: replace with real data
		} as TNotificationProfile;
	});
};

export const getProfileForTap = async (tap: TTap) => {
	try {
		return getProfile(tap.creatorId);
	} catch (error) {
		console.log('getProfileForTap in TapService ', error);
	}
};

export const getFollowingProfiles = async (user: TProfile) => {
	const usersRef = collection(DB, COLLECTIONS.USERS);
	if (!user.userSubscriptionIds || user.userSubscriptionIds.length === 0)
		return [];
	const _query = query(
		usersRef,
		where(documentId(), 'in', user.userSubscriptionIds)
	);
	const followingProfilesSnapshot = await getDocs(_query);
	return followingProfilesSnapshot.docs.map((doc) => {
		return {
			...(doc.data() as TProfile),
			notification: Math.floor(Math.random() * 100), // TODO: replace with real data
		} as TNotificationProfile;
	});
};
