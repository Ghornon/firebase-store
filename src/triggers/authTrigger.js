import * as functions from 'firebase-functions';
import { admin, db } from '../utils/admin';

const onCreate = functions
	.region('europe-west1')
	.auth.user()
	.onCreate(async user => {
		await db.collection('users').add({
			createdAt: new Date().toISOString(),
			displayName: user.displayName || '',
			imageUrl: '',
			userId: user.uid,
			role: 'User'
		});
	});

const onDelete = functions
	.region('europe-west1')
	.firestore.document('users/{docId}')
	.onDelete(async snap => {
		const uid = snap.data().userId;
		await admin.auth().deleteUser(uid);
	});

export { onCreate, onDelete };
