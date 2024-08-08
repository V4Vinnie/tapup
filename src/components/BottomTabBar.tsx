import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import settings from '../../tailwind.config';
import { Routes } from '../navigation/Routes';
import { CommonActions } from '@react-navigation/native';
import { bottomNavIcons } from '../utils/constants';

const { colors: themeColors } = settings.theme.extend;
const mode = themeColors.darkMode ? 'dark' : 'light';

const BottomTabBar = ({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) => {
	return (
		<View
			style={{
				position: 'absolute',
				bottom: 20,
				alignSelf: 'center', // Center the bottom bar
				backgroundColor: themeColors[mode].secondaryBackground,
				borderRadius: 25,
				height: 60,
				shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.25,
				shadowRadius: 3.84,
				elevation: 5,
				flexDirection: 'row',
				justifyContent: 'center', // Center the icons
				alignItems: 'center',
				paddingHorizontal: 20,
				paddingVertical: 10, // Add some vertical padding
			}}
		>
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

				const icons = bottomNavIcons(isFocused);
				const icon = icons[route.name] || icons[Routes.HOME];

				return (
					<Pressable
						key={route.key}
						onPress={onPress}
						className='justify-center items-center'
						style={{ marginHorizontal: 20 }} 
					>
						<View className='justify-center items-center'>
							{icon}
						</View>
					</Pressable>
				);
			})}
		</View>
	);
};

export default BottomTabBar;