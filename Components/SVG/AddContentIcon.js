import Svg, { Circle, Path } from 'react-native-svg';
export const AddContentIcon = (props) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		width={32}
		height={32}
		fill='none'
		{...props}
	>
		<Circle cx={16.29} cy={16} r={15.488} fill='#fff' />
		<Path
			fill='#FF197C'
			fillRule='evenodd'
			d='M14.29 7.068h4v17.864h-4V7.068Z'
			clipRule='evenodd'
		/>
		<Path
			fill='#FF197C'
			fillRule='evenodd'
			d='M7.358 18v-4h17.864v4H7.358Z'
			clipRule='evenodd'
		/>
	</Svg>
);
