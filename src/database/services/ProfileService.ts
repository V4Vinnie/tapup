import {
	collection,
	doc,
	documentId,
	getDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { DB } from '../Firebase';
import { COLLECTIONS } from '../../utils/constants';
import { TNotificationProfile, TProfile, TUser } from '../../types';

export const getProfiles = async () => {
	const usersRef = collection(DB, COLLECTIONS.USERS);
	const allUsers = await getDocs(usersRef);
	return allUsers.docs.map((doc) => {
		return {
			uid: doc.id,
			...(doc.data() as TUser),
			notification: Math.floor(Math.random() * 100), // TODO: replace with real data
		} as TNotificationProfile;
	});
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
			uid: doc.id,
			...(doc.data() as TUser),
			notification: Math.floor(Math.random() * 100), // TODO: replace with real data
		} as TNotificationProfile;
	});
};

export const getCreatorName = async (companyId: string) => {
	const creatorRef = doc(DB, COLLECTIONS.USERS, companyId);
	const creatorSnapshot = await getDoc(creatorRef);
	return (creatorSnapshot.data() as TProfile).name;
};
