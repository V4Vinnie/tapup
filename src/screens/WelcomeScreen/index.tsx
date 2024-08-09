import React from 'react';
import {  Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Routes, RootStackParamList } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppButton from '../../components/AppButton';
import { styled } from 'nativewind';
import Logo from '../../../assets/images/Logo';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {};

const WelcomeScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	return (
		<SafeAreaView className='flex-1 flex justify-end py-8 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar
				translucent
				backgroundColor={'transparent'}
				barStyle={'light-content'}
			/>
			<View className='w-4/5 h-4/5 flex justify-between items-center'>
				<View className='flex items-center gap-y-20 pt-20'>
					<Logo />
					<View className='w-full space-y-8'>
						<Text className='text-3xl font-inter-semiBold text-dark-textColor text-center'>
							{'Welcome to TapUp learning app'}
						</Text>
						<Text className='text-base font-inter-med text-dark-subTextColor text-center'>
							{
								'TapUp offers educational content in a way designed for fast consumption.'
							}
						</Text>
					</View>
				</View>
				<AppButton
					title='Get Started'
					onPress={() => navigate(Routes.LOGIN)}
				/>
			</View>
		</SafeAreaView>
	);
};

export default WelcomeScreen;
