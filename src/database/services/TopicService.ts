import {
	collection,
	doc,
	documentId,
	getDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { COLLECTIONS } from '../../utils/constants';
import { DB } from '../Firebase';
import { TNotificationTopic, TProfile, TTopic } from '../../types';

export const getTopics = async () => {
	try {
		const topicsRef = collection(DB, COLLECTIONS.TOPICS);
		const allTopics = (await getDocs(topicsRef)).docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data(),
			} as TTopic;
		});
		return allTopics;
	} catch (error) {
		console.log('getTopics in TopicService ', error);
	}
};

export const getTopicsForUser = async (profile: TProfile) => {
	try {
		const topicsRef = collection(DB, COLLECTIONS.TOPICS);
		if (
			!profile.topicSubscriptionIds ||
			profile.topicSubscriptionIds.length === 0
		)
			return [];
		const _query = query(
			topicsRef,
			where(documentId(), 'in', profile.topicSubscriptionIds)
		);
		const topicSnapshot = await getDocs(_query);
		return topicSnapshot.docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data(),
				notification: Math.floor(Math.random() * 100), // TODO: replace with real data
			} as TNotificationTopic;
		});
	} catch (error) {
		console.log('getTopicsForUser in TopicService ', error);
	}
};

export const getTopicsByCreator = async (profile: TProfile) => {
	try {
		const tapsRef = collection(DB, COLLECTIONS.TAPS);
		const _query = query(tapsRef, where('creatorId', '==', profile.uid));
		const userTapsSnapshot = await getDocs(_query);
		const userTapsData = userTapsSnapshot.docs.map((doc) => doc.data());
		const uniqueTopicIds = [
			...new Set(userTapsData.map((tap) => tap.topicId)),
		];

		const topicPromises = uniqueTopicIds.map(async (topicId) => {
			const topicSnapshot = doc(DB, COLLECTIONS.TOPICS, topicId);
			const topicDoc = await getDoc(topicSnapshot);
			return {
				id: topicDoc.id,
				...topicDoc.data(),
			} as TTopic;
		});

		return await Promise.all(topicPromises);
	} catch (error) {
		console.log('getTopicsByCreator in TopicService ', error);
	}
};
