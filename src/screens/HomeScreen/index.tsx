import { Platform, SafeAreaView, ScrollView, View } from 'react-native';
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import ContinueWatching from './ContinueWatching';
import DiscoverTaps from '../../components/DiscoverTaps';
import AddCompanyCode from '../SignupScreen/AddCompanyCode';
import { useCompany } from '../../providers/CompanyProvider';

type Props = {};

const HomeScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { company } = useCompany();

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View
				className='flex w-full'
				style={{
					marginTop: Platform.OS === 'ios' ? 20 : 48,
				}}>
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
						{/* <YourTopics /> */}
						{/* <Following /> */}
						<DiscoverTaps />
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;
