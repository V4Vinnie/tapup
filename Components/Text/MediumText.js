import { Text } from 'react-native';
export const MediumText = ({ children, ...props }) => (
	<Text
		{...props}
		style={
			props.style
				? { fontFamily: 'DMSans-Medium', ...props.style }
				: { fontFamily: 'DMSans-Medium' }
		}
	>
		{children}
	</Text>
);
