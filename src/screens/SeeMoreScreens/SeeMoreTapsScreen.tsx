import { FlatList, ScrollView, View } from 'react-native';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import AppHeader from '../../components/AppHeader';
import FullInfoTap from '../../components/FullInfoTap';
import { RootStackParamList } from '../../navigation/Routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type GeneralSeeMoreScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'SeeMoreTaps'
>;

const SeeMoreTapsScreen = ({ route }: GeneralSeeMoreScreenProps) => {
	const { taps, title } = route.params;

	return (
		<View className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<AppHeader transparentHeader headerWithBack title={title} />
			<ScrollView
				className='w-full px-4 mt-32'
				contentContainerStyle={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'center',
					gap: 16,
				}}>
				{taps.map((tap) => (
					<FullInfoTap key={tap.id} tap={tap} />
				))}
			</ScrollView>
		</View>
	);
};

export default SeeMoreTapsScreen;
