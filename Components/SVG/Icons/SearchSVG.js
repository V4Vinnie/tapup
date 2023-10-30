import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../../Constants/Colors';
export const SearchSVG = ({ isActive, props }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		width={24}
		height={24}
		fill='none'
		{...props}
	>
		<Path
			fill={isActive ? Colors.primary.pink : Colors.primary.white}
			fillRule='evenodd'
			d='M8.863 14.207a5.4 5.4 0 1 0 0-10.8 5.4 5.4 0 0 0 0 10.8Zm0 3a8.4 8.4 0 1 0 0-16.8 8.4 8.4 0 0 0 0 16.8Z'
			clipRule='evenodd'
		/>
		<Path
			fill={isActive ? Colors.primary.pink : Colors.primary.white}
			fillRule='evenodd'
			d='M14.652 14.596a1.5 1.5 0 0 1 2.122 0l6.003 6.004a1.5 1.5 0 1 1-2.12 2.121l-6.005-6.004a1.5 1.5 0 0 1 0-2.121Z'
			clipRule='evenodd'
		/>
	</Svg>
);
