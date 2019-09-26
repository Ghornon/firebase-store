import Router from 'express-promise-router';
import { isAuthenticated, accessGuard } from '../utils/accessGuard';
import validateBody from '../utils/validateBody';
import * as schemas from '../schemas/authSchemas';
import * as controllers from '../controllers/userController';

const userRouter = Router();

userRouter
	.route('/users')
	.get(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		controllers.getAll
	)
	.post(isAuthenticated, accessGuard({ hasRole: 'Admin', allowSameUser: false }));

userRouter
	.route('/users/:userId')
	.get(isAuthenticated, accessGuard({ hasRole: 'Admin', allowSameUser: true }), controllers.get)
	.patch(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: true }),
		validateBody(schemas.user),
		controllers.update
	)
	.delete(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		controllers.remove
	);

userRouter
	.route('/users/:userId/setCustomClaims')
	.get(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		controllers.setRoleClaims
	);

export default userRouter;
