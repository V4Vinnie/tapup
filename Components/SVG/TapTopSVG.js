import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const TapTopSVG = (props) => {
	return (
		<Svg
			width={props.width ? props.width : 140}
			height={props.height ? props.height : 9}
			viewBox='0 0 212 16'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<Path
				d='M.51.097v15.16h211.257L190.231.107v-.01H.511z'
				fill={props.color ? props.color : '#FF197C'}
			/>
		</Svg>
	);
};
