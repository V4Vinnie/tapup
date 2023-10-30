import { Path, Svg } from 'react-native-svg';

export const BlackArrow = (props) => {
	return (
		<Svg
			width='10'
			height='15'
			viewBox='0 0 8 15'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<Path
				d='M1.57691 13.6357L6.4361 7.47351L1.5769 1.31128'
				stroke={props.color ? props.color : 'black'}
				stroke-width='5'
			/>
		</Svg>
	);
};
