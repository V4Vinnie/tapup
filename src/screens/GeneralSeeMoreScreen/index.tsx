import { FlatList, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import AppHeader from '../../components/AppHeader';

type GeneralSeeMoreScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'GeneralSeeMore'
>;

const GeneralSeeMoreScreen = ({ route }: GeneralSeeMoreScreenProps) => {
	const { title, data } = route.params;
	const { navigate, goBack } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	return (
		<View className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<AppHeader transparentHeader headerWithBack title={title} />
			<View className='flex-1 flex w-11/12'>
				<View className='w-full mt-32'>
					<FlatList
						showsVerticalScrollIndicator={false}
						numColumns={2}
						data={data}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<Text className='text-white'>{item.name}</Text>
						)}
					/>
				</View>
			</View>
		</View>
	);
};

export default GeneralSeeMoreScreen;
