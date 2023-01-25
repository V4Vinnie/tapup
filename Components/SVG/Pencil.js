import Svg, { Defs, G, Path, Rect } from 'react-native-svg';
import { Colors } from '../../Constants/Colors';

export const Pencil = ({ width = 100, height = 100 }) => (
	<Svg
		width={width}
		height={height}
		viewBox='0 0 181 229'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<G opacity='0.5'>
			<Path
				d='M34.0457 193.918L38.0999 160.482L63.5256 177.297L34.3441 194.115C34.2013 194.198 34.0258 194.082 34.0457 193.918Z'
				fill={Colors.primary.bleuBottom}
			/>
			<Path
				d='M110.965 50.3036L120.52 35.8554C121.434 34.4734 123.295 34.094 124.677 35.008L145.098 48.5135C146.48 49.4275 146.86 51.2887 145.946 52.6707L136.391 67.1189L110.965 50.3036Z'
				fill={Colors.primary.bleuBottom}
			/>
			<Rect
				x='40.9019'
				y='156.244'
				width='121.932'
				height='30.4831'
				transform='rotate(-56.5214 40.9019 156.244)'
				fill={Colors.primary.bleuBottom}
			/>
		</G>
	</Svg>
);
