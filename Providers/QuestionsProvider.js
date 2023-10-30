import { useContext, useState } from 'react';
import { createContext } from 'react';

const QuestionsContext = createContext();

export const QuestionsProvider = ({ children }) => {
	const [questions, setQuestions] = useState(undefined);

	return (
		<QuestionsContext.Provider
			value={{ questions: questions, setQuestions: setQuestions }}
		>
			{children}
		</QuestionsContext.Provider>
	);
};

export const useQuestions = () => {
	return useContext(QuestionsContext);
};
