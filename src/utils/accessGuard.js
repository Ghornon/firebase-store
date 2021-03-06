import { admin } from './admin';

const isAuthenticated = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) return res.status(401).json({ error: 'Unauthorized' });

	if (!authorization.startsWith('Bearer')) return res.status(401).json({ error: 'Unauthorized' });

	const split = authorization.split('Bearer ');
	if (split.length !== 2) return res.status(401).json({ error: 'Unauthorized' });

	const idToken = split[1];

	const { uid, role = 'User', code } = await admin
		.auth()
		.verifyIdToken(idToken)
		.catch(({ errorInfo }) => {
			console.error('Decoding token error: ', errorInfo);
			return errorInfo;
		});

	if (code === 'auth/id-token-expired')
		return res.status(401).json({
			error: 'ID token has expired. Get a fresh ID token from your client app and try again'
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
	const { userId } = req.params;

	if (allowSameUser && userId && uid === userId) return next();

	if (!role || !hasRole.includes(role))
		res.status(403).json({ error: 'The client does not have access rights to the content.' });

	return next();
};

export { isAuthenticated, accessGuard };
