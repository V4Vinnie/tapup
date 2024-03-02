import React, { FC, memo } from 'react';
import { View } from 'react-native';
import ProgressItem from '@birdwingo/react-native-instagram-stories/src/components/Progress/item';
import { WIDTH } from '@birdwingo/react-native-instagram-stories/src/core/constants';
import ProgressStyles from '@birdwingo/react-native-instagram-stories/src/components/Progress/Progress.styles';
import { StoryProgressProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/componentsDTO';

const Progress: FC<StoryProgressProps> = ({
	progress,
	active,
	activeStory,
	length,
	progressActiveColor,
	progressColor,
}) => {
	const width =
		(WIDTH -
			ProgressStyles.container.left * 2 -
			(length - 1) * ProgressStyles.container.gap) /
		length;

	return (
		<View
			style={[
				{ ...ProgressStyles.container, top: 10 },
				{ width: WIDTH },
			]}>
			{[...Array(length).keys()].map((val) => (
				<ProgressItem
					active={active}
					activeStory={activeStory}
					progress={progress}
					index={val}
					width={width}
					key={val}
					progressActiveColor={progressActiveColor}
					progressColor={progressColor}
				/>
			))}
		</View>
	);
};

export default memo(Progress);
