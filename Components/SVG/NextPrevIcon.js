import Svg, { Circle, Path } from 'react-native-svg';
export const NextPrevIcon = (props) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		width={31}
		height={32}
		fill='none'
		{...props}
	>
		<Circle
			cx={15.488}
			cy={16}
			r={15.488}
			fill='#fff'
			transform='rotate(-180 15.488 16)'
		/>
		<Path
			fill='#FF197C'
			fillRule='evenodd'
			d='m13.405 16 6.778 7.601-2.985 2.662L8.045 16l9.153-10.263L20.183 8.4 13.405 16Z'
			clipRule='evenodd'
		/>
	</Svg>
);
