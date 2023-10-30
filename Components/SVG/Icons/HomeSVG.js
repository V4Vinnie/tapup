import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../../Constants/Colors';
export const HomeSVG = ({ isActive, props }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		width={32}
		height={33}
		fill='none'
		{...props}
	>
		<Path
			fill={isActive ? Colors.primary.pink : Colors.primary.white}
			d='M4.992 30.034V17.719l11.043-9.812 11.1 9.921v12.206a2 2 0 0 1-2 2h-5.05a1 1 0 0 1-1-1v-6.34h-6.042v6.34a1 1 0 0 1-1 1h-5.05a2 2 0 0 1-2-2Z'
		/>
		<Path
			fill={isActive ? Colors.primary.pink : Colors.primary.white}
			fillRule='evenodd'
			d='M14.714.786a2 2 0 0 1 2.662.004l13.926 12.448a2 2 0 0 1-2.666 2.982L16.04 4.96 3.363 16.224a2 2 0 0 1-2.657-2.99L14.714.786Z'
			clipRule='evenodd'
		/>
	</Svg>
);
