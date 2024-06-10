import React, { FC, memo } from 'react';
import { View } from 'react-native';
import ProgressItem from '@birdwingo/components/Progress/item';
import { WIDTH } from '@birdwingo/core/constants';
import ProgressStyles from '@birdwingo/components/Progress/Progress.styles';
import { StoryProgressProps } from '@birdwingo/core/dto/componentsDTO';

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
				{ ...ProgressStyles.container, top: 10, gap: 6 },
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
