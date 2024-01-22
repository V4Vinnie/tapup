import { TNotificationProfile, TProfile, TUser } from '../../types';

export const getProfiles = async (): Promise<TProfile[]> => {
	return MOCK_USERS;
};

export const getFollowingProfiles = async (
	user: TUser
): Promise<TNotificationProfile[] | undefined> => {
	const profiles =
		(user.userSubscriptionIds?.map((id) => {
			const profile = MOCK_USERS.find((user) => user.uid === id);
			if (!profile) return null;
			return { ...profile, notification: Math.random() > 0.5 };
		}) as TNotificationProfile[]) || [];
	return new Promise<TNotificationProfile[] | undefined>((resolve) => {
		setTimeout(() => {
			resolve(profiles);
		}, 1000);
	});
};

export const getCompanyName = (companyId: string) => {
	return 'Remes';
};

const MOCK_USERS: TProfile[] = [
	{
		uid: 'f315e0a9-b435-4433-9027-17bce156ed5e',
		name: 'John Doe',
		email: 'jhon.doe@gmail.com',
		profilePic: 'https://i.pravatar.cc/300',
		role: 'USER',
		watchedFrameIds: [],
	},
	{
		uid: 'aaf8197b-e091-4575-9aba-b99a57ec6d2e',
		name: 'Other Doe',
		email: 'other.doe@gmail.com',
		profilePic: '',
		role: 'USER',
		watchedFrameIds: [],
	},
];
