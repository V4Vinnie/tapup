import { FlatList, Image, View } from 'react-native';
import { TNotificationProfile } from '../types';
import { useEffect, useMemo, useState } from 'react';
import ProfileComponent, { ProfileComponentSkeleton } from './ProfileComponent';

type Props = {
	profiles?: TNotificationProfile[];
	containerProps?: View['props'];
	loading?: boolean;
};

const SPACE_BETWEEN = 16;
const ProfileRow = ({ profiles, containerProps, loading }: Props) => {
	const [imagesLoading, setImagesLoading] = useState<boolean>(true);

	const hasNotification = useMemo(() => {
		if (!profiles) return false;
		return profiles.some((profile) => profile.notification);
	}, [profiles]);

	useEffect(() => {
		if (!profiles) return;
		const imageUrls = profiles
			.filter((profile) => profile.profilePic !== '')
			.map((profiles) => Image.prefetch(profiles.profilePic));
		Promise.all(imageUrls).then(() => setImagesLoading(false));
	}, [profiles]);

	const dataLoading = useMemo(() => {
		return imagesLoading || loading;
	}, [imagesLoading, loading]);

	return dataLoading || !profiles ? (
		<ProfileRowSkeleton />
	) : (
		<View className='w-full' {...containerProps}>
			<FlatList
				horizontal
				data={profiles}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.uid}
				contentContainerStyle={{
					paddingHorizontal: 16,
					paddingTop: hasNotification ? 5 : 0,
				}}
				renderItem={({ item, index }) => (
					<ProfileComponent
						key={item.uid}
						profile={item}
						containerProps={{
							style: {
								marginRight:
									index === profiles.length - 1
										? 0
										: SPACE_BETWEEN,
							},
						}}
					/>
				)}
			/>
		</View>
	);
};

const ProfileRowSkeleton = () => {
	return (
		<View className='w-full'>
			<FlatList
				horizontal
				data={[1, 2, 3, 4, 5]}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.toString() + 'profile'}
				contentContainerStyle={{
					paddingHorizontal: 16,
					columnGap: SPACE_BETWEEN,
				}}
				renderItem={({ item, index }) => (
					<ProfileComponentSkeleton width={85} />
				)}
			/>
		</View>
	);
};

export default ProfileRow;
