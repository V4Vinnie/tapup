import React, { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useQuestions } from '../../providers/QuestionProvider';
import AppButton from '../../components/AppButton';
import { useAuth } from '../../providers/AuthProvider';

type Props = {};

const HomeScreen = (props: Props) => {
	const { handleLogout } = useAuth();
	const { questions } = useQuestions();

	return (
		<View className='flex-1 justify-center items-center bg-dark-primaryBackground'>
			<Text className='text-dark-textColor'>HomeScreen</Text>
			<Text className='text-dark-textColor'>Questions:</Text>
			<FlatList
				data={questions}
				renderItem={({ item }) => (
					<Text className='text-dark-textColor'>
						{item.frameLink.tapId}
					</Text>
				)}
				keyExtractor={(item) => item.id}
			/>
			<AppButton
				title={'Logout'}
				onPress={() => {
					handleLogout();
				}}
			/>
		</View>
	);
};

export default HomeScreen;
