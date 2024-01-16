import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { DB } from '../Firebase';
import { COLLECTIONS } from '../../utils/constants';
import { TQuestion } from '../../types';

export const getQuestions = async () => {
	const docRef = collection(DB, COLLECTIONS.QUESTIONS);
	const _query = query(docRef, orderBy('question'));
	const _questionsRef = await getDocs(_query);
	const _allQuestions: TQuestion[] = [];
	_questionsRef.forEach((_question) => {
		_allQuestions.push(_question.data() as TQuestion);
	});
	return _allQuestions;
};
