import { db } from '@/config/firebase';
import { IMessage } from '@/types';
import {
	DocumentData,
	QueryDocumentSnapshot,
	Timestamp,
	collection,
	orderBy,
	query,
	where,
} from 'firebase/firestore';

export const generateQueryGetMessages = (conversationId?: string) => {
	return query(
		collection(db, 'messages'),
		where('conversation_id', '==', conversationId),
		orderBy('sent_at', 'asc')
	);
};

export const transformMessage = (
	message: QueryDocumentSnapshot<DocumentData>
) => {
	return {
		id: message.id,
		...message.data(),
		sent_at: message.data().sent_at
			? convertFirestoreTimestampToString(
					message.data().sent_at as Timestamp
			  )
			: null,
	} as IMessage;
};

export const convertFirestoreTimestampToString = (
	timestamp: Timestamp
): string => {
	// serialized as JSON error
	return new Date(timestamp.toDate().getTime()).toLocaleString();
};
