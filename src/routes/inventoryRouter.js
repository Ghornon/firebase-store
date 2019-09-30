import Router from 'express-promise-router';
import { isAuthenticated, accessGuard } from '../utils/accessGuard';
import validateBody from '../utils/validateBody';
import * as schemas from '../schemas/inventorySchemas';
import * as controllers from '../controllers/inventoryController';

const inventoryRouter = Router();

inventoryRouter
	.route('/inventory')
	.get(controllers.get)
	.post(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		validateBody(schemas.inventory),
		controllers.create
	);

inventoryRouter
	.route('/inventory/all')
	.get(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		controllers.getAll
	);

inventoryRouter
	.route('/inventory/:inventoryId')
	.get(controllers.getOne)
	.patch(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		validateBody(schemas.inventory),
		controllers.update
	)
	.delete(
		isAuthenticated,
		accessGuard({ hasRole: 'Admin', allowSameUser: false }),
		controllers.remove
	);

export default inventoryRouter;
