import Router from 'express-promise-router';
import { isAuthenticated, accessGuard } from '../utils/accessGuard';
import validateBody from '../utils/validateBody';
import * as schemas from '../schemas/orderSchemas';
import * as controllers from '../controllers/orderController';

const orderRouter = Router();

// Admin access only

orderRouter
	.route('/orders')
	.get(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		controllers.getAll
	)
	.post(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		validateBody(schemas.newOrder),
		controllers.create
	);

orderRouter
	.route('/orders/:orderId')
	.get(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		controllers.getAll
	)
	.patch(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		validateBody(schemas.updateOrder),
		controllers.update
	)
	.delete(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		controllers.remove
	);

// Privileged access

orderRouter
	.route('/users/:userId/orders')
	.get(isAuthenticated, accessGuard({ hasRole: 'Admin', allowSameUser: true }), controllers.get)
	.post(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: true }),
		validateBody(schemas.newOrder),
		controllers.create
	);

orderRouter
	.route('/users/:userId/orders/:orderId')
	.get(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: true }),
		controllers.getOne
	);

export default orderRouter;
