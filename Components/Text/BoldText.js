import { Text } from 'react-native';
export const BoldText = ({ children, style, ...props }) => (
	<Text
		{...props}
		style={
			style
				? { fontFamily: 'DMSans-Bold', ...style }
				: { fontFamily: 'DMSans-Bold' }
		}
	>
		{children}
	</Text>
);
