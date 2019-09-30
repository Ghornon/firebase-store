import { admin, db } from '../utils/admin';

const getAll = async (req, res) => {
	const users = await db
		.collection('users')
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return [...snapshot.docs].map(doc => doc.data());
			}
			return null;
		});

	if (!users) return res.status(404).json({ error: 'Not found!' });

	return res.status(200).json({ users });
};

const get = async (req, res) => {
	const { userId } = req.params;

	const user = await db
		.collection('users')
		.where('userId', '==', userId)
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return snapshot.docs[0].data();
			}
			return null;
		});

	if (!user) return res.status(404).json({ error: 'User not found!' });

	return res.status(200).json({ ...user });
};

const update = async (req, res) => {
	const { userId } = req.params;
	const { displayName, imageUrl } = req.body;

	const docId = await db
		.collection('users')
		.where('userId', '==', userId)
		.limit(1)
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return snapshot.docs[0].id;
			}
			return null;
		});

	if (!docId) return res.status(404).json({ error: 'User not found!' });

	const user = await db
		.collection('users')
		.doc(docId)
		.update({
			displayName,
			imageUrl
		});

	if (!user) return res.status(404).json({ error: 'User not found!' });

	return res.status(204).json();
};

const remove = async (req, res) => {
	const { userId } = req.params;

	const docId = await db
		.collection('users')
		.where('userId', '==', userId)
		.limit(1)
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return snapshot.docs[0].id;
			}
			return null;
		});

	if (!docId) return res.status(404).json({ error: 'User not found!' });

	const success = await db
		.collection('users')
		.doc(docId)
		.delete();

	if (!success) return res.status(404).json({ error: 'User not found!' });

	return res.status(204).json();
};

const setRoleClaims = async (req, res) => {
	const { userId } = req.params;

	const user = await db
		.collection('users')
		.where('userId', '==', userId)
		.get()
		.then(snapshot => (!snapshot.empty ? snapshot.docs[0].data() : null))
		.catch(err => console.error(err));

	if (!user || user.error) {
		return res.status(404).json({ error: 'User not found!' });
	}

	await admin.auth().setCustomUserClaims(userId, { role: user.role || 'User' });

	return res.status(200).json({ status: 'success' });
};

export { getAll, get, update, remove, setRoleClaims };
