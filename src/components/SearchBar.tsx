import React from 'react';
import { Animated, Text, Pressable, View } from 'react-native';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import settings from '../../tailwind.config';
import { useCompany } from '../providers/CompanyProvider';

type Props = {
	onPress: () => void;
	containerProps?: View['props'];
	filter?: boolean;
};

const { colors: themeColors } = settings.theme.extend;

const SearchBar = ({ onPress, containerProps }: Props) => {
	const { companyColor } = useCompany();

	return (
		<Animated.View
			{...containerProps}
			className='w-full bg-dark-primaryBackground py-2'>
			<Pressable
				onPress={onPress}
				className={`relative w-full self-center h-10 rounded-full bg-dark-secondaryBackground dark:bg-dark-secondaryBackground flex-row items-center z-50`}>
				<FontistoIcon
					name='search'
					size={17}
					color={companyColor}
					style={{ position: 'absolute', left: 16 }}
				/>

				<Text className='ml-12 font-regular text-base text-dark-subTextColor'>
					Search keywords...
				</Text>
			</Pressable>
		</Animated.View>
	);
};

export default SearchBar;
