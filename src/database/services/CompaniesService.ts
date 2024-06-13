import { collection, getDocs, query, where } from 'firebase/firestore';
import { DB } from '../Firebase';
import { COLLECTIONS } from '../../utils/constants';
import { TCompany } from '../../types';

export async function getCompanyByCode(code: string) {
	try {
		const companiesRef = collection(DB, COLLECTIONS.COMPANIES);
		const _query = query(companiesRef, where('code', '==', code));
		const _querySnapshot = await getDocs(_query);
		if (_querySnapshot.empty) return null;
		return _querySnapshot.docs[0].data() as TCompany;
	} catch (error) {
		console.error('getCompanyByCode in UserService ', error);
		return null;
	}
}
