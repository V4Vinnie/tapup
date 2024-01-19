import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import settings from '../../tailwind.config';

type Props = {
	onPress: () => void;
	containerProps?: View['props'];
	filter?: boolean;
};

const { colors: themeColors } = settings.theme.extend;
const mode = themeColors.darkMode ? 'dark' : 'light';

const SearchBar = ({ onPress, containerProps }: Props) => {
	return (
		<Animated.View {...containerProps} className='w-full'>
			<TouchableOpacity
				onPress={onPress}
				className={`relative w-full self-center h-10 rounded-full bg-dark-secondaryBackground dark:bg-dark-secondaryBackground flex-row items-center mt-6 z-50`}>
				<FontistoIcon
					name='search'
					size={17}
					color={themeColors.primaryColor[100]}
					style={{ position: 'absolute', left: 16 }}
				/>

				<Text className='ml-12 font-regular text-base text-dark-subTextColor'>
					Search keywords...
				</Text>
			</TouchableOpacity>
		</Animated.View>
	);
};

export default SearchBar;
