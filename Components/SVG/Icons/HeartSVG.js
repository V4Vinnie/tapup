import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../../Constants/Colors';

export const HeartSVG = (props) => {
	return (
		<Svg
			width={20}
			height={19}
			viewBox='0 0 20 19'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<Path
				d='M10.062 2.405l-.303.302-.303-.303a5.558 5.558 0 00-7.859 7.86l.303.302 7.86 7.86 7.859-7.86.302-.302a5.558 5.558 0 00-7.86-7.859z'
				fill={props.isActive ? Colors.primary.pink : Colors.primary.bleuBottom}
			/>
		</Svg>
	);
};
