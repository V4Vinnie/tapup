import { Unsubscribe } from 'firebase/firestore';

const firebaseSubscriptions: Unsubscribe[] = [];
export const addFirebaseSubscription = (subscription: Unsubscribe) => {
	firebaseSubscriptions.push(subscription);
};

export const clearFirebaseSubscriptions = () => {
	firebaseSubscriptions.forEach((subscription) => subscription());
	firebaseSubscriptions.length = 0;
};
