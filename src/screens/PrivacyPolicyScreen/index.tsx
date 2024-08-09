import React from 'react';
import {  ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { useAuth } from '../../providers/AuthProvider';
import ProfileHeader from '../../components/ProfileHeader';
import AppButton from '../../components/AppButton';
import AppHeader from '../../components/AppHeader';
import SettingsTab from './SettingsTab';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { mode, themeColors } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {};

const PrivacyPolicyScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { handleLogout, user } = useAuth();

	function logout(): void {
		handleLogout();
	}

	return (
		<SafeAreaView className='flex-1 bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='flex-1 w-full'>
				<AppHeader title='Privacy Policy' />
				
			</View>
		</SafeAreaView>
	);
};

export default PrivacyPolicyScreen;
