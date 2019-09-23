import fetch from 'node-fetch';
import { admin, db } from '../utils/admin';
import config from '../utils/config';

const signIn = async (req, res) => {
	const { email, password } = req.body;

	const { localId, displayName, error } = await fetch(
		`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.apiKey}`,
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password, returnSecureToken: true })
		}
	)
		.then(data => (data ? data.json() : null))
		.catch(err => console.error('User fetch error: ', err));

	if (error) {
		const { code, message } = error;

		switch (message) {
			case 'EMAIL_NOT_FOUND':
				return res.status(code).json({
					error: 'There is no user record corresponding to this identifier.'
				});

			case 'INVALID_PASSWORD':
				return res.status(code).json({
					error: 'The password is invalid or the user does not have a password.'
				});

			case 'USER_DISABLED':
				return res.status(code).json({
					error: 'The user account has been disabled by an administrator.'
				});

			default:
				return res.status(code).json({ error: message });
		}
	}

	const role = await db
		.collection('users')
		.where('userId', '==', localId)
		.limit(1)
		.get()
		.then(querySnapshot => {
			if (!querySnapshot.empty) {
				return querySnapshot.docs[0].data().role;
			}
			return null;
		})
		.catch(err => {
			console.error('Error getting document:', err);
		});

	const customToken = await admin
		.auth()
		.createCustomToken(localId, { role })
		.catch(err => {
			console.error('Error creating custom token:', err);
		});

	if (!customToken) return res.status(500);

	return res.status(200).json({
		userId: localId,
		email,
		displayName,
		idToken: customToken
	});
};

const signUp = async (req, res) => {
	const { email, password } = req.body;

	const { idToken, refreshToken, expiresIn, localId, error } = await fetch(
		`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.apiKey}`,
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password, returnSecureToken: true })
		}
	)
		.then(data => (data ? data.json() : null))
		.catch(err => console.error('User create error: ', err));

	if (error) {
		const { code, message } = error;

		switch (message) {
			case 'EMAIL_EXISTS':
				return res.status(code).json({
					error: 'The email address is already in use by another account.'
				});

			case 'OPERATION_NOT_ALLOWED':
				return res.status(code).json({
					error: 'Password sign-in is disabled for this project.'
				});

			case 'TOO_MANY_ATTEMPTS_TRY_LATER':
				return res.status(code).json({
					error:
						'We have blocked all requests from this device due to unusual activity. Try again later.'
				});

			default:
				return res.status(code).json({ error: message });
		}
	}

	return res.status(201).json({
		userId: localId,
		email,
		idToken,
		refreshToken,
		expiresIn
	});
};

export { signIn, signUp };
