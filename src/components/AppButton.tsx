import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { themeColors } from '../utils/constants';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
	title: string;
	onPress: () => void;
	buttonProps?: TouchableOpacity['props'];
	textProps?: Text['props'];
	children?: ReactNode;
};

const AppButton = ({
	title,
	onPress,
	buttonProps,
	textProps,
	children,
}: Props) => {
	return (
		<TouchableOpacity
			{...buttonProps}
			onPress={onPress}
			className={`w-full justify-center items-center rounded-full`}>
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
				className={`w-full h-12 flex justify-center items-center rounded-full ${
					buttonProps?.className ?? ''
				}`}>
				{children ?? (
					<Text
						{...textProps}
						className={`text-white text-lg font-inter-bold ${
							textProps?.className ?? ''
						}`}>
						{title}
					</Text>
				)}
			</LinearGradient>
		</TouchableOpacity>
	);
};

export default AppButton;
