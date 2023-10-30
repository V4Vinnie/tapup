import { Text } from 'react-native';

export const RegularText = ({ children, ...props }) => (
	<Text
		{...props}
		style={
			props.style
				? { fontFamily: 'DMSans-Regular', ...props.style }
				: { fontFamily: 'DMSans-Regular' }
		}
	>
		{children}
	</Text>
);
