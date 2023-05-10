import Svg, { Path } from 'react-native-svg';

export const Arrow = ({ width = 55, height = 33, ...props }) => {
	return (
		<Svg
			{...props}
			width={width}
			height={height}
			viewBox={`0 0 ${height} ${width}`}
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<Path
				d='M41.6503 0L24.9902 16.4903L8.34971 0L0 8.21609L24.9902 33L50 8.21609L41.6503 0Z'
				fill='white'
			/>
		</Svg>
	);
};
