import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Routes, RootStackParamList } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppButton from '../../components/AppButton';
import { styled } from 'nativewind';

type Props = {};

const WelcomeScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const StyledView = styled(View);

	return (
		<StyledView className='flex-1 bg-dark-primaryBackground'>
			<FocusAwareStatusBar
				translucent
				backgroundColor={'transparent'}
				barStyle={'dark-content'}
			/>
			<Text className='text-3xl font-medium text-dark-textColor text-center mb-4'>
				WelcomeScreen
			</Text>
			<AppButton
				title='Get Started'
				onPress={() => navigate(Routes.LOGIN)}
			/>
		</StyledView>
	);
};

export default WelcomeScreen;
