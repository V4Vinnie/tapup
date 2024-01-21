import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { DB } from '../Firebase';
import { COLLECTIONS } from '../../utils/constants';
import { TTap } from '../../types';

export const getTaps = async () => {
	try {
		const docRef = collection(DB, COLLECTIONS.TAPS);
		const _query = query(docRef, orderBy('createdAt', 'desc'));
		const _tapsRef = await getDocs(_query);
		const _allTaps: TTap[] = [];
		_tapsRef.forEach((_tapRef) => {
			_allTaps.push(_tapRef.data() as TTap);
		});
		return _allTaps;
	} catch (error) {
		console.log('getTaps in TapService ', error);
	}
};
