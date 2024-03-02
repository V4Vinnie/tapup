import React, { FC, memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import HeaderStyles from '@birdwingo/react-native-instagram-stories/src/components/Header/Header.styles';
import { WIDTH } from '@birdwingo/react-native-instagram-stories/src/core/constants';
import { StoryHeaderProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/componentsDTO';
import Close from '@birdwingo/react-native-instagram-stories/src/components/Icon/close';

const StoryHeader: FC<StoryHeaderProps> = ({
	imgUrl,
	name,
	onClose,
	avatarSize,
	textStyle,
	buttonHandled,
	closeColor,
}) => {
	const styles = {
		width: avatarSize,
		height: avatarSize,
		borderRadius: avatarSize,
	};

	const width = WIDTH - HeaderStyles.container.left * 2;

	return (
		<View style={[{ ...HeaderStyles.container, top: 8 }, { width }]}>
			<View style={HeaderStyles.left}>
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
			</View>
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
