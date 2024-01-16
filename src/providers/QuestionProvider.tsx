import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { TQuestion } from '../types';
import { getQuestions } from '../database/services/QuestionService';
import { useAuth } from './AuthProvider';

const QuestionContext = React.createContext<{
	questions: TQuestion[];
	setQuestions: React.Dispatch<React.SetStateAction<TQuestion[]>>;
}>({
	questions: [],
	setQuestions: () => {},
});

type Props = {
	children: React.ReactNode;
};

export const QuestionProvider = ({ children }: Props) => {
	const { user } = useAuth();
	const navigator =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const [questions, setQuestions] = useState<TQuestion[]>([]);

	useEffect(() => {
		const getAllQuestions = async () => {
			const _allQuestions = await getQuestions();

			setQuestions(_allQuestions);
		};
		if (user) {
			getAllQuestions();
		}
	}, [user]);

	const questionProperties = React.useMemo(
		() => ({
			questions,
			setQuestions,
		}),
		[questions, setQuestions]
	);

	return (
		<QuestionContext.Provider value={questionProperties}>
			{children}
		</QuestionContext.Provider>
	);
};

export const useQuestions = () => {
	return React.useContext(QuestionContext);
};
