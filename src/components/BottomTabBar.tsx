import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import settings from '../../tailwind.config';
import { Routes } from '../navigation/Routes';
import { CommonActions } from '@react-navigation/native';

const { colors: themeColors } = settings.theme.extend;
const mode = themeColors.darkMode ? 'dark' : 'light';

const BottomTabBar = ({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) => {
	return (
		<View
			className='flex-row bg-dark-secondaryBackground shadow-xl shadow-light-subTextColor/60
        '>
			{state.routes.map((route, index) => {
				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.dispatch({
							...CommonActions.navigate({ name: route.name }),
							target: state.key,
						});
					}
				};

				const icons = {
					[Routes.HOME]: (
						<MCIcon
							key='home'
							name='home-outline'
							{...standardProps(isFocused)}
						/>
					),
				} as any;
				const icon = icons[route.name] || icons[Routes.HOME];

				return isFocused ? (
					<TouchableOpacity
						key={route.key}
						onPress={onPress}
						className='flex-1 h-14 bg-dark-secondaryBackground justify-center items-center'>
						<View className='w-20 h-full rounded-full justify-center items-center'>
							<View className='justify-center items-center'>
								{icon}
							</View>
						</View>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						key={icon.key}
						activeOpacity={0.8}
						onPress={onPress}
						className='flex-1 h-14 bg-dark-secondaryBackground justify-center items-center'>
						{icon}
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const standardProps = (isFocused: boolean) => {
	return {
		size: isFocused ? 32 : 30,
		color: isFocused
			? themeColors.dark.textColor
			: themeColors.dark.subTextColor,
	};
};

export default BottomTabBar;
