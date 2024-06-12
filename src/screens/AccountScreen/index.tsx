import {
	Animated,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { useAuth } from '../../providers/AuthProvider';

type Props = {};

const AccountScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { handleLogout } = useAuth();

	function logout(): void {
		handleLogout();
	}

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<ScrollView
				className='w-full mt-6'
				contentContainerStyle={{
					alignItems: 'center',
					justifyContent: 'center',
				}}
				showsVerticalScrollIndicator={false}>
				<View className='w-full mt-6'>
					<Text className='text-white font-inter-medium text-center'>
						ACCOUNT
					</Text>
					<TouchableOpacity onPress={logout}>
						<Text>Logout</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default AccountScreen;
