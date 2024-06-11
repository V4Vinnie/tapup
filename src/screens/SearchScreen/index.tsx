import {
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import InlineSearchBar from '../../components/InlineSearchBar';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { mode, themeColors } from '../../utils/constants';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useTaps } from '../../providers/TapProvider';
import { useState } from 'react';
import { TTap } from '../../types';
import { FlatList } from 'react-native';
import FullInfoTap from '../../components/FullInfoTap';
import SearchbarHeader from '../../components/SearchbarHeader';

type Props = {};

const SearchScreen = (props: Props) => {
	const { navigate, goBack } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { handleLogout } = useAuth();
	const { taps } = useTaps();

	const [filteredTaps, setFilteredTaps] = useState<TTap[]>([]);

	const searchTaps = (searchTerm: string) => {
		const filteredTaps = taps.filter(
			(tap) =>
				tap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				tap.description.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredTaps(filteredTaps);
	};

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='flex-1 flex w-11/12 self-center'>
				<SearchbarHeader onSearch={searchTaps} />
				<FlatList
					data={filteredTaps}
					numColumns={2}
					contentContainerStyle={{
						paddingTop: 16,
					}}
					renderItem={({ item }) => (
						<FullInfoTap
							key={item.id}
							tap={item}
							containerProps={{
								style: {
									paddingVertical: 8,
								},
							}}
						/>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>
		</SafeAreaView>
	);
};

export default SearchScreen;
