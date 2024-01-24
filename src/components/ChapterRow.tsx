import { FlatList, View } from 'react-native';
import { TChapter, TUser } from '../types';
import PreviewComponent from './PreviewComponent';
import { useAuth } from '../providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import { onUser } from '../database/services/UserService';
import { useTaps } from '../providers/TapProvider';
import { useIsFocused } from '@react-navigation/native';
import { getProgessForChapters } from '../database/services/MockTapService';
import LoadingIndicator from './LoadingIndicator';

type Props = {
	chapters: TChapter[];
	containerProps?: View['props'];
};

const SPACE_BETWEEN = 10;
const ChapterRow = ({ chapters, containerProps }: Props) => {
	const { user } = useAuth();
	const isFocused = useIsFocused();
	const [progress, setProgress] = useState<Map<string, number>>(new Map());
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!user?.uid) return;
		const getProgress = (user: TUser) => {
			getProgessForChapters(user, chapters).then((progress) => {
				if (progress) setProgress(progress);
				setLoaded(true);
			});
		};
		if (isFocused) getProgress(user);
		onUser(user.uid, getProgress);
	}, [isFocused, user, chapters]);

	return !loaded ? (
		<LoadingIndicator /> // TODO: Add Skeleton Loading
	) : (
		<View className='w-full' {...containerProps}>
			<FlatList
				horizontal
				data={chapters}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					paddingHorizontal: 16,
				}}
				renderItem={({ item, index }) => {
					const video =
						item.frames[0].mediaType === 'VIDEO'
							? item.frames[0].media
							: undefined;
					const thumbnail =
						item.frames[0].mediaType === 'IMAGE'
							? item.frames[0].media
							: undefined;
					return (
						<PreviewComponent
							progress={progress.get(item.id)}
							text={item.name}
							video={video}
							thumbnail={thumbnail}
							containerProps={{
								style: {
									marginRight:
										index === chapters.length - 1
											? 0
											: SPACE_BETWEEN,
								},
							}}
						/>
					);
				}}
			/>
		</View>
	);
};

export default ChapterRow;
