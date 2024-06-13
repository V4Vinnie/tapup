import { LinearGradient } from 'expo-linear-gradient';
import { View, Text } from 'react-native';
import { themeColors } from '../utils/constants';
import { Override } from './Custom/CustomStoryList';

type Props = Override<
	LinearGradient['props'],
	{ colors?: string[]; companyColor?: string }
>;

const PrimaryGradient = ({ companyColor, children, ...props }: Props) => {
	return companyColor ? (
		<View
			{...props}
			style={[
				...(props.style as []),
				{
					backgroundColor: companyColor,
				},
			]}>
			{children}
		</View>
	) : (
		<LinearGradient
			{...props}
			style={[...(props.style as [])]}
			colors={[
				themeColors.gradientColor1,
				themeColors.gradientColor2,
				themeColors.gradientColor3,
				themeColors.gradientColor4,
			]}
			locations={[0, 0.3, 0.8, 1]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 0 }}>
			{children}
		</LinearGradient>
	);
};

export default PrimaryGradient;
