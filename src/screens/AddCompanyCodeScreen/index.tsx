import {  ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { useAuth } from '../../providers/AuthProvider';
import AppHeader from '../../components/AppHeader';
import AddCompanyCode from '../SignupScreen/AddCompanyCode';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {};

const AddCompanyCodeScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();

	return (
		<SafeAreaView className='flex-1 bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='flex-1 w-full'>
				<AppHeader title='' />
				<ScrollView
					className='w-full'
					showsVerticalScrollIndicator={false}>
					<View className='w-full px-8 pt-8 h-3/5 flex flex-col justify-between'>
						<AddCompanyCode
							buttonText='Add company'
							addButtonPress={() => navigate(Routes.HOME)}
						/>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default AddCompanyCodeScreen;
