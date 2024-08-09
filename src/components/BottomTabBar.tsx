import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useMemo } from 'react';
import { Platform, Pressable, View } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import settings from '../../tailwind.config';
import { Routes } from '../navigation/Routes';
import { CommonActions, ParamListBase, TabNavigationState } from '@react-navigation/native';
import { bottomNavIcons } from '../utils/constants';
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const { colors: themeColors } = settings.theme.extend;
const mode = themeColors.darkMode ? 'dark' : 'light';

const BottomTabBar = ({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) => {
	const dontShowList = useMemo(() => [
		Routes.STORY_VIEWER,
		Routes.PRIVACY_POLICY
	], []);

	const translateY = useSharedValue(0);

	const getNestedRouteName = (state: any) => {
		const route = state.routes[state.index];
		if (route.state) {
			return getNestedRouteName(route.state);
		}
		return route.name;
	};

	
	useEffect(() => {
		const nestedRouteName = getNestedRouteName(state);
        if (dontShowList.includes(nestedRouteName)) {
            translateY.value = withTiming(100, { duration: 200 }); // Slide down
        } else {
            translateY.value = withTiming(0, { duration: 150 }); // Slide up
        }
    }, [state]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

	return (
		<Animated.View
            style={[
                {
                    position: 'absolute',
                    bottom: 10,
                    alignSelf: 'center', // Center the bottom bar
                    backgroundColor: themeColors[mode].secondaryBackground,
                    borderRadius: 60,
                    height: 50,
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
                    paddingHorizontal: 10,
                },
                animatedStyle,
            ]}
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
					style={{ paddingHorizontal: 20 }}
						key={route.key}
						onPress={onPress}
						className='justify-center items-center'
					>
						<View className='justify-center items-center'>
							{icon}
						</View>
					</Pressable>
				);
			})}
		</Animated.View>
	);
};

export default BottomTabBar;