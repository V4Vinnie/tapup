import { Image, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { TTap } from '../types';
import { themeColors } from '../utils/constants';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../providers/AuthProvider';
import { getTapProgress } from '../database/services/MockTapService';
import { useIsFocused } from '@react-navigation/native';
import { onUser } from '../database/services/UserService';

type Props = {
	data: TTap;
	containerProps?: View['props'];
};

const TapComponent = ({ data, containerProps }: Props) => {
	const { user } = useAuth();
	const isFocused = useIsFocused();
	const [progress, setProgress] = React.useState<number>(0);

	useEffect(() => {
		if (!user) return;
		const getProgress = async () => {
			const _progress = await getTapProgress(user, data);
			setProgress(_progress * 100);
		};
		if (isFocused) {
			getProgress();
		}
		onUser(user.uid, (user) => {
			getProgress();
		});
	}, [isFocused, user]);

	return progress === 100 ? null : (
		<View
			className='w-32 h-44 rounded-lg overflow-hidden'
			{...containerProps}>
			<Image source={{ uri: data.thumbnail }} className='w-full h-full' />
			<LinearGradient
				className='absolute bottom-0 w-full h-1/2'
				colors={['transparent', 'rgba(0,0,0,1)']}
			/>
			<View className='absolute bottom-0 w-full h-5 mb-2 px-2 flex flex-row justify-between items-center'>
				<Text
					numberOfLines={1}
					className='w-4/5 text-white text-left text-xs font-inter-medium'>
					{data.name}dsqqqqqqqqqqqqqqqqqqqqqqqdqsdqsdqsdqsdqsdddddd
				</Text>
				<AntIcon
					name='arrowright'
					size={20}
					color={themeColors.primaryColor[100]}
				/>
			</View>
			<View className='absolute bottom-0 w-full h-1 bg-dark-secondaryBackground'>
				<View
					className='h-full'
					style={{
						width: `${progress}%`,
						backgroundColor: themeColors.primaryColor[100],
					}}
				/>
			</View>
		</View>
	);
};

export default TapComponent;
