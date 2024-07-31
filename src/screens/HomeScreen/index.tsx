import {
	Animated,
	Platform,
	SafeAreaView,
	ScrollView,
	View,
} from 'react-native';
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements'; // get the header height
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // get the safe area insets, initially used for the search bar
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import ContinueWatching from './ContinueWatching';
import YourTopics from './YourTopics';
import Following from './Following';
import DiscoverTaps from '../../components/DiscoverTaps';

type Props = {};

const HomeScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const insets = useSafeAreaInsets();
	const headerHeight = useHeaderHeight();

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='flex w-full mt-12'>
				<SearchBar
					containerProps={{
						style: {
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							zIndex: 100,
							paddingHorizontal: 16,
							backgroundColor: 'transparent',
						},
					}}
					onPress={() => navigate(Routes.SEARCH_SCREEN)}
				/>
				<ScrollView
					className='w-full h-full'
					contentContainerStyle={{
						alignItems: 'center',
						justifyContent: 'center',
						paddingTop: 0, // Adjust this value as needed
					}}
					showsVerticalScrollIndicator={false}>
					<View className='w-full mt-6'>
						<ContinueWatching />
						<YourTopics />
						<Following />
						<DiscoverTaps />
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;
