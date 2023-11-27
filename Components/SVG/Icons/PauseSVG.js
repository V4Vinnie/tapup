import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PauseSVG = (props) => (
	<Svg
		width={14}
		height={18}
		viewBox='0 0 14 18'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<Path fill='#FF197C' d='M0.592285 0.53125H5.592285V17.40285H0.592285z' />
		<Path fill='#FF197C' d='M8.69019 0.53125H13.69019V17.40285H8.69019z' />
	</Svg>
);
