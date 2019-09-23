import Router from 'express-promise-router';
import validateBody from '../utils/validateBody';
import * as schemas from '../schemas/authSchemas';
import * as controllers from '../controllers/authControllers';

const authRouter = Router();

authRouter.route('/signin').post(validateBody(schemas.signIn), controllers.signIn);

authRouter.route('/signup').post(validateBody(schemas.signUp), controllers.signUp);

export default authRouter;
