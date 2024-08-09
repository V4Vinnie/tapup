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
				<AppHeader title='Account' />
				<ScrollView
					className='w-full'
					showsVerticalScrollIndicator={false}>
					{user && <ProfileHeader profile={user} />}
					<View className='w-full px-8 pt-8 h-3/5 flex flex-col justify-between'>
						<SettingsTab
							title='Account'
							onPress={() => navigate(Routes.ACCOUNT_SETTINGS)}
							icon={
								<MaterialCommunityIcons
									name='account'
									size={20}
									color={themeColors[mode].textColor}
								/>
							}
						/>
						<SettingsTab
							title='Privacy Policy'
							onPress={() => navigate(Routes.PRIVACY_POLICY)}
							icon={
								<MaterialIcons
									name='privacy-tip'
									size={20}
									color={themeColors[mode].textColor}
								/>
							}
						/>
						<SettingsTab
							title='My Company'
							onPress={() => navigate(Routes.MY_COMPANY)}
							icon={
								<Entypo
									name='suitcase'
									size={20}
									color={themeColors[mode].textColor}
								/>
							}
						/>
						<AppButton
							title='Logout'
							onPress={logout}
							buttonProps={{
								className: 'mt-8',
							}}
						/>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default PrivacyPolicyScreen;
