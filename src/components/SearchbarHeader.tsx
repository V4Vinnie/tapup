import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Routes';
import InlineSearchBar from './InlineSearchBar';
import { mode, themeColors } from '../utils/constants';

type Props = {
	onSearch: (searchTerm: string) => void;
	text?: string;
	autoFocus?: boolean;
};

const SearchbarHeader = ({ onSearch, text = 'Search', autoFocus }: Props) => {
	const { goBack } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	return (
		<View className='w-full flex flex-row justify-between items-center mt-8'>
			<TouchableOpacity className='mr-4 mt-5' onPress={() => goBack()}>
				<IonIcon
					name='arrow-back'
					size={24}
					color={themeColors[mode].headerPrimaryColor}
				/>
			</TouchableOpacity>
			<InlineSearchBar
				onSearch={onSearch}
				text={text}
				autoFocus={autoFocus}
			/>
		</View>
	);
};

export default SearchbarHeader;
