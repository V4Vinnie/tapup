import { ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import AppHeader from '../../components/AppHeader';
import ProfileComponent from '../../components/ProfileComponent';

type GeneralSeeMoreScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'SeeMoreProfiles'
>;

const SeeMoreProfilesScreen = ({ route }: GeneralSeeMoreScreenProps) => {
	const { profiles, title } = route.params;

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
				{profiles.map((profile) => (
					<ProfileComponent key={profile.uid} profile={profile} />
				))}
			</ScrollView>
		</View>
	);
};

export default SeeMoreProfilesScreen;
