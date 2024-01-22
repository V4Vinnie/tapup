import { FlatList, View } from 'react-native';
import TagComponent from './TagComponent';
import { TNotificationTopic, TTap } from '../types';
import { useMemo } from 'react';

type Props = {
	data: TNotificationTopic[];
	containerProps?: View['props'];
};

const SPACE_BETWEEN = 16;
const TagRow = ({ data, containerProps }: Props) => {
	const hasNotification = useMemo(() => {
		return data.some((topic) => topic.notification);
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
					paddingTop: hasNotification ? 5 : 0,
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
