import { FlatList, View } from 'react-native';
import TagComponent, { TagComponentSkeleton } from './TagComponent';
import { TNotificationTopic, TTap, TTopic } from '../types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../navigation/Routes';

type Props = {
	data: TNotificationTopic[] | TTopic[] | TTap[];
	dataType?: 'topic' | 'tap';
	containerProps?: View['props'];
	selectable?: boolean;
	setSelected?: React.Dispatch<React.SetStateAction<any>>;
	loading?: boolean;
	initialSelected?: TTopic | TTap | null;
};

const SPACE_BETWEEN = 16;
const TagRow = ({
	data,
	dataType,
	containerProps,
	selectable = false,
	setSelected,
	initialSelected,
}: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const flatListRef = useRef<FlatList>(null);
	const [selectedItem, setSelectedItem] = useState<number | null>(null);

	useEffect(() => {
		if (selectable && !initialSelected) {
			setSelectedItem(0);
		}
	}, [data, selectable]);

	useEffect(() => {
		if (selectable && setSelected) {
			setSelected(data[selectedItem ?? 0]);
			flatListRef.current?.scrollToIndex({
				index: selectedItem ?? 0,
				animated: true,
				viewPosition: 0.5,
			});
		}
	}, [selectedItem]);

	useEffect(() => {
		if (initialSelected) {
			const index = data.findIndex(
				(item) => item.id === initialSelected?.id
			);
			if (index !== -1) {
				setSelectedItem(index);
			}
		}
	}, [initialSelected]);

	const hasNotification = useMemo(() => {
		if ((data[0] as TNotificationTopic)?.notification === undefined)
			return false;
		return data.some((topic) => {
			return (topic as TNotificationTopic).notification > 0;
		});
	}, [data]);

	const onScrollToIndexFailed = (info: {
		index: number;
		highestMeasuredFrameIndex: number;
		averageItemLength: number;
	}) => {
		const wait = new Promise((resolve) => setTimeout(resolve, 200));
		wait.then(() => {
			flatListRef.current?.scrollToIndex({
				index: info.index,
				animated: true,
				viewPosition: 0.5,
			});
		});
	};

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
				decelerationRate='fast'
				onScrollToIndexFailed={onScrollToIndexFailed}
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
									: index === selectedItem
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
								setSelectedItem(index);
							}
							if (dataType === 'topic') {
								navigate(Routes.TOPIC_SCREEN, {
									topic: item as TTopic,
								});
							}
						}}
					/>
				)}
			/>
		</View>
	);
};

export const TagRowSkeleton = () => {
	return (
		<View className='w-full'>
			<FlatList
				horizontal
				data={[1, 2, 3, 4, 5]}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.toString() + 'tag'}
				contentContainerStyle={{
					paddingHorizontal: 16,
					columnGap: SPACE_BETWEEN,
				}}
				renderItem={({ item, index }) => <TagComponentSkeleton />}
			/>
		</View>
	);
};

export default TagRow;
