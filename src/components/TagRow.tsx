import { FlatList, View } from 'react-native';
import TagComponent from './TagComponent';
import { TNotificationTopic, TTopic } from '../types';
import { useMemo } from 'react';

type Props = {
	data: TNotificationTopic[] | TTopic[];
	containerProps?: View['props'];
};

const SPACE_BETWEEN = 16;
const TagRow = ({ data, containerProps }: Props) => {
	const hasNotification = useMemo(() => {
		if ((data[0] as TNotificationTopic)?.notification === undefined)
			return false;
		return data.some((topic) => {
			return (topic as TNotificationTopic).notification > 0;
		});
	}, [data]);

	return (
		<View className='w-full' {...containerProps}>
			<FlatList
				horizontal
				data={data}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					paddingHorizontal: 16,
					paddingTop: hasNotification ? 6 : 0,
				}}
				renderItem={({ item, index }) => (
					<TagComponent
						data={item}
						containerProps={{
							style: {
								marginRight:
									index === data.length - 1
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

export default TagRow;
