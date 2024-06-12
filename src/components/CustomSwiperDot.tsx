import { View, Text } from 'react-native';
import { mode, themeColors } from '../utils/constants';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
	active?: boolean;
};

const CustomSwiperDot = ({ active = false }: Props) => {
	return (
		<LinearGradient
			colors={[
				themeColors.gradientColor1,
				themeColors.gradientColor2,
				themeColors.gradientColor3,
				themeColors.gradientColor4,
			]}
			locations={[0, 0.3, 0.8, 1]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 0 }}
			style={{
				width: 8,
				height: 8,
				borderRadius: 4,
				marginLeft: 3,
				marginRight: 3,
				marginTop: 3,
				marginBottom: 3,
			}}>
			{!active && (
				<View
					style={{
						borderRadius: 4,
						flex: 1,
						margin: 1,
						backgroundColor: themeColors[mode].primaryBackground,
					}}
				/>
			)}
		</LinearGradient>
	);
};

export default CustomSwiperDot;
