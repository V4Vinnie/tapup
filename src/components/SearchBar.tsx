import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import settings from '../../tailwind.config';

type Props = {
	onPress: () => void;
	containerProps?: View['props'];
};

const { colors: themeColors } = settings.theme.extend;
const mode = themeColors.darkMode ? 'dark' : 'light';

const SearchBar = ({ onPress, containerProps }: Props) => {
	return (
		<Animated.View {...containerProps}>
			<TouchableOpacity
				onPress={onPress}
				className={`relative w-full self-center h-12 rounded-standard bg-light-primaryBackground dark:bg-dark-secondaryBackground flex-row items-center mt-6 z-50`}>
				<IonIcon
					name='search-outline'
					size={20}
					color={themeColors[mode].inputColor}
					style={{ position: 'absolute', left: 16 }}
				/>

				<Text className='ml-12 font-regular text-base text-light-subTextColor'>
					Search keywords...
				</Text>

				<FeatherIcon
					name='sliders'
					size={20}
					color={themeColors[mode].inputColor}
					style={{ position: 'absolute', right: 16 }}
				/>
			</TouchableOpacity>
		</Animated.View>
	);
};

export default SearchBar;
