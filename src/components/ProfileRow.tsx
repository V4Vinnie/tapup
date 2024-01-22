import { FlatList, View } from 'react-native';
import { TNotificationProfile } from '../types';
import { useMemo } from 'react';
import ProfileComponent from './ProfileComponent';

type Props = {
	profiles: TNotificationProfile[];
	containerProps?: View['props'];
};

const SPACE_BETWEEN = 16;
const ProfileRow = ({ profiles, containerProps }: Props) => {
	const hasNotification = useMemo(() => {
		return profiles.some((profile) => profile.notification);
	}, [profiles]);
	return (
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

export default ProfileRow;
