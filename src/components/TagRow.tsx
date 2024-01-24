import { FlatList, View } from 'react-native';
import TagComponent from './TagComponent';
import { TNotificationTopic, TTap, TTopic } from '../types';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
	data: TNotificationTopic[] | TTopic[] | TTap[];
	containerProps?: View['props'];
	selectable?: boolean;
	setSelected?: React.Dispatch<React.SetStateAction<any>>;
};

const SPACE_BETWEEN = 16;
const TagRow = ({
	data,
	containerProps,
	selectable = false,
	setSelected,
}: Props) => {
	const flatListRef = useRef<FlatList>(null);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

	useEffect(() => {
		if (selectable) {
			setSelectedTopic(0);
		}
	}, [data, selectable]);

	useEffect(() => {
		if (selectable && setSelected) {
			setSelected(data[selectedTopic ?? 0]);
		}
	}, [selectedTopic]);

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
				ref={flatListRef}
				horizontal
				data={data}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					paddingHorizontal: 16,
					paddingTop: hasNotification ? 6 : 0,
				}}
				snapToAlignment='center'
				renderItem={({ item, index }) => (
					<TagComponent
						data={item}
						containerProps={{
							style: {
								marginRight:
									index === data.length - 1
										? 0
										: SPACE_BETWEEN,
								opacity: !selectable
									? 1
									: index === selectedTopic
										? 1
										: 0.4,
							},
						}}
						onPress={() => {
							if (selectable) {
								flatListRef.current?.scrollToIndex({
									index,
									animated: true,
									viewPosition: 0.5,
								});
								setSelectedTopic(index);
							}
						}}
					/>
				)}
			/>
		</View>
	);
};

export default TagRow;
