import React from 'react';
import { Path, Svg } from 'react-native-svg';

type Props = {
	width?: number;
	height?: number;
	scale?: number;
	fill?: string;
};

const Logo = ({
	width = 117,
	height = 185,
	scale,
	fill = '#FF197C',
}: Props) => {
	return (
		<Svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
			<Path
				d='M89.7802 36.9985C89.472 45.1037 86.0415 52.7742 80.2091 58.3994C74.3766 64.0246 66.5957 67.167 58.5 67.167C50.4043 67.167 42.6234 64.0246 36.7909 58.3994C30.9585 52.7742 27.528 45.1037 27.2198 36.9985V0H0V36.9985C0.424249 52.2606 6.77394 66.7549 17.6985 77.3997C28.6231 88.0445 43.261 94 58.5 94C73.739 94 88.3772 88.0445 99.3018 77.3997C110.226 66.7549 116.576 52.2606 117 36.9985V0H89.7802V36.9985Z'
				fill={fill}
				scale={scale}
			/>
			<Path
				d='M97.6287 185L58.9772 146.523L20.3713 185L1 165.829L58.9772 108L117 165.829L97.6287 185Z'
				fill={fill}
				scale={scale}
			/>
		</Svg>
	);
};

export default Logo;
