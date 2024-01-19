import React, { useEffect, useState } from 'react';
import { Animated, TextInput, View } from 'react-native';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
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
		<Animated.View {...containerProps} className='shrink'>
			<AppInput
				autoFocus={true}
				containerProps={{
					className:
						'relative w-full self-center h-10 rounded-standard bg-dark-secondaryBackground flex-row items-center mt-6 z-50',
				}}
				inputProps={{
					onChangeText: setSearch,
					placeholder: 'Search keywords...',
					autoFocus: true,
				}}
				leftIcon={{
					component: (
						<FontistoIcon
							name='search'
							size={17}
							color={themeColors.primaryColor[100]}
						/>
					),
				}}
			/>
		</Animated.View>
	);
};

export default InlineSearchBar;
