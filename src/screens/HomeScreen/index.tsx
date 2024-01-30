import { Animated, SafeAreaView, ScrollView, View } from 'react-native';
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import ContinueWatching from './ContinueWatching';
import YourTopics from './YourTopics';
import Following from './Following';
import NewTaps from './NewTaps';
import AppButton from '../../components/AppButton';
import { useAuth } from '../../providers/AuthProvider';

type Props = {};

const HomeScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { handleLogout } = useAuth();

	const scrollY = new Animated.Value(0);
	const diffClamp = Animated.diffClamp(scrollY, 0, 130);
	const translateY = diffClamp.interpolate({
		inputRange: [0, 130],
		outputRange: [0, -130],
	});

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='flex w-full mt-8'>
				<SearchBar
					containerProps={{
						style: {
							position: 'absolute',
							top: 0,
							left: 0,
							zIndex: 100,
							paddingHorizontal: 16,
							transform: [{ translateY: translateY }],
						},
					}}
					onPress={() => navigate(Routes.SEARCH_SCREEN)}
				/>
				<ScrollView
					className='w-full mt-6'
					contentContainerStyle={{
						alignItems: 'center',
						justifyContent: 'center',
					}}
					showsVerticalScrollIndicator={false}
					onScroll={(e) => {
						scrollY.setValue(e.nativeEvent.contentOffset.y);
					}}>
					<View className='w-full mt-6'>
						<ContinueWatching />
						<YourTopics />
						<Following />
						<NewTaps />
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;
