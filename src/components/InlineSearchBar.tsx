import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import settings from '../../tailwind.config';
import AppInput from './AppInput';

type Props = {
	onSearch: (search: string) => void;
	containerProps?: View['props'];
	waitDuration?: number;
};

const { colors: themeColors } = settings.theme.extend;
const mode = themeColors.darkMode ? 'dark' : 'light';

const InlineSearchBar = ({
	onSearch,
	containerProps,
	waitDuration = 1000,
}: Props) => {
	const [search, setSearch] = useState('');

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			onSearch(search);
		}, waitDuration);
		return () => clearTimeout(delayDebounceFn);
	}, [search]);

	return (
		<Animated.View {...containerProps}>
			<AppInput
				containerProps={{
					className:
						'relative w-full self-center h-12 rounded-standard bg-light-primaryBackground dark:bg-dark-secondaryBackground flex-row items-center mt-6 z-50',
				}}
				inputProps={{
					onChangeText: setSearch,
					placeholder: 'Search keywords...',
					placeholderTextColor: themeColors[mode].inputColor,
				}}
				leftIcon={{
					component: (
						<IonIcon
							name='search-outline'
							size={20}
							color={themeColors[mode].inputColor}
						/>
					),
				}}
			/>
		</Animated.View>
	);
};

export default InlineSearchBar;
