import { admin } from './admin';

const isAuthenticated = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) return res.status(401).json({ error: 'Unauthorized' });

	if (!authorization.startsWith('Bearer')) return res.status(401).json({ error: 'Unauthorized' });

	const split = authorization.split('Bearer ');
	if (split.length !== 2) return res.status(401).json({ error: 'Unauthorized' });

	const idToken = split[1];

	const { uid, role = '' } = await admin
		.auth()
		.verifyIdToken(idToken)
		.catch(error => {
			console.error('Decoding token error: ', error);
		});

	if (!uid) return res.status(401).json({ error: 'Unauthorized' });

	res.locals = {
		...res.locals,
		uid,
		role
	};

	return next();
};

const accessGuard = ({ hasRole, allowSameUser }) => (req, res, next) => {
	const { role, uid } = res.locals;
	const { id } = req.params;

	if (allowSameUser && id && uid === id) return next();

	if (!role || !hasRole.includes(role))
		res.status(403).json({ error: 'The client does not have access rights to the content.' });

	return next();
};

export { isAuthenticated, accessGuard };
