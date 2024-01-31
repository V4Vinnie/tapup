import { TNotificationProfile, TProfile } from '../../../types';
import { MOCK_USERS } from './MockData';

export const getProfiles = async (): Promise<TNotificationProfile[]> => {
	const profiles = MOCK_USERS.map((user) => ({
		...user,
		notification: Math.floor(Math.random() * 100),
	}));
	return new Promise<TNotificationProfile[]>((resolve) => {
		setTimeout(() => {
			resolve(profiles);
		}, 1000);
	});
};

export const getFollowingProfiles = async (
	user: TProfile
): Promise<TNotificationProfile[] | undefined> => {
	const profiles =
		(user.userSubscriptionIds?.map((id) => {
			const profile = MOCK_USERS.find((user) => user.uid === id);
			if (!profile) return null;
			return {
				...profile,
				notification: Math.floor(Math.random() * 100),
			};
		}) as TNotificationProfile[]) || [];
	return new Promise<TNotificationProfile[]>((resolve) => {
		setTimeout(() => {
			resolve(profiles);
		}, 1000);
	});
};

export const getCreatorName = (companyId: string) => {
	return 'Remes';
};
