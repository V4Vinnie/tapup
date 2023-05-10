import Svg, { Path } from 'react-native-svg';

export const ArrowSmall = ({ width = '5', height = '8' }) => (
	<Svg
		width={width}
		height={height}
		viewBox='0 0 5 8'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<Path
			d='M2.54549e-07 1.33595L2.49853 4.00157L4.87447e-07 6.66405L1.24486 8L5 4.00157L1.24486 4.57356e-07L2.54549e-07 1.33595Z'
			fill='white'
		/>
	</Svg>
);
