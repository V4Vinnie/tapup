import React, { FC, memo, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import HeaderStyles from '@birdwingo/react-native-instagram-stories/src/components/Header/Header.styles';
import { WIDTH } from '@birdwingo/react-native-instagram-stories/src/core/constants';
import { StoryHeaderProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/componentsDTO';
import Close from '@birdwingo/react-native-instagram-stories/src/components/Icon/close';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import { TProfile } from '../../types';
import { getProfile } from '../../database/services/UserService';

type CustomStoryHeaderProps = StoryHeaderProps & {
	userId: string | undefined;
};

const StoryHeader: FC<CustomStoryHeaderProps> = ({
	userId,

	imgUrl,
	name,
	onClose,
	avatarSize,
	textStyle,
	buttonHandled,
	closeColor,
}) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [profile, setProfile] = useState<TProfile | null>(null);
	const styles = {
		width: avatarSize,
		height: avatarSize,
		borderRadius: avatarSize,
	};
	const width = WIDTH - HeaderStyles.container.left * 2;

	useEffect(() => {
		if (!userId) return;
		(async () => {
			const _profile = await getProfile(userId);
			setProfile(_profile);
			console.log('profile', _profile);
		})();
	}, [userId]);

	return (
		<View style={[{ ...HeaderStyles.container, top: 8 }, { width }]}>
			<TouchableOpacity
				style={HeaderStyles.left}
				onPress={() => {
					console.log('userId', userId);

					if (!profile) return;
					onClose();
					navigate(Routes.PROFILE_SCREEN, { profile });
				}}>
				{Boolean(imgUrl) && (
					<View
						style={[
							{ overflow: 'hidden' },
							{ borderRadius: styles.borderRadius },
						]}>
						<Image source={{ uri: imgUrl }} style={styles} />
					</View>
				)}
				{Boolean(name) && (
					<Text
						style={textStyle}
						className='text-dark-textColor font-inter-medium'>
						{name}
					</Text>
				)}
			</TouchableOpacity>
			<TouchableOpacity
				onPress={onClose}
				hitSlop={16}
				testID='storyCloseButton'
				onPressIn={() => {
					buttonHandled.value = true;
				}}>
				<Close color={closeColor} />
			</TouchableOpacity>
		</View>
	);
};

export default memo(StoryHeader);
