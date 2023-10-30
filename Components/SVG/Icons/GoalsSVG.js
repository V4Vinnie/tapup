import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../../Constants/Colors';
export const GoalsSVG = ({ isActive, props }) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		width={25}
		height={32}
		fill='none'
		{...props}
	>
		<Path
			fill={isActive ? Colors.primary.pink : Colors.primary.white}
			fillRule='evenodd'
			d='M12.508 28.533a5.83 5.83 0 1 0 0-11.658 5.83 5.83 0 0 0 0 11.658Zm0 3a8.83 8.83 0 1 0 0-17.658 8.83 8.83 0 0 0 0 17.658Z'
			clipRule='evenodd'
		/>
		<Path
			fill={isActive ? Colors.primary.pink : Colors.primary.white}
			d='m20.561.659 4.149 4.966-5.677 8.437a10.777 10.777 0 0 0-6.127-2.18L20.56.66ZM4.397.659.248 5.625l5.696 8.465a10.777 10.777 0 0 1 6.11-2.205L4.397.659ZM9.842 6.576 6.063.58h13.005l-3.99 5.996H9.842ZM12.508 17.984l1.06 3.262h3.43l-2.776 2.016 1.06 3.261-2.774-2.016-2.775 2.016 1.06-3.261-2.775-2.016h3.43l1.06-3.262Z'
		/>
	</Svg>
);
