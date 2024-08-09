import {  StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { useAuth } from '../../providers/AuthProvider';
import AppHeader from '../../components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

type Props = {};

const PrivacyPolicyScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { user } = useAuth();

	return (
		<SafeAreaView className='flex-1 bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='flex-1 w-full'>
				<AppHeader title='Privacy Policy' headerWithBack />
				<WebView
					 style={styles.container}
					 source={{ uri: 'https://www.tap-up.app/privacy-policy' }}
				   />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	},
  });

export default PrivacyPolicyScreen;
