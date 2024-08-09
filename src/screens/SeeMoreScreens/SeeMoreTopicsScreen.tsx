import { ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import AppHeader from '../../components/AppHeader';
import TagComponent from '../../components/TagComponent';

type SeeMoreTopicsScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'SeeMoreTopics'
>;

const SeeMoreTopicsScreen = ({ route }: SeeMoreTopicsScreenProps) => {
	const { topics, title } = route.params;

	return (
		<View className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<AppHeader headerWithBack title={title} />
			<View className='w-full flex px-4 mt-32'>
				<ScrollView
					className='w-full'
					contentContainerStyle={{
						flexDirection: 'row',
						flexWrap: 'wrap',
						justifyContent: 'center',
						gap: 10,
					}}>
					{topics.map((topic) => (
						<TagComponent key={topic.id} data={topic} />
					))}
				</ScrollView>
			</View>
		</View>
	);
};

export default SeeMoreTopicsScreen;
