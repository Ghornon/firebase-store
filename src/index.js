import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Routers
import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Routes
app.use(authRouter);
app.use(userRouter);

export const api = functions.region('europe-west1').https.onRequest(app);

// Triggers
export { onCreate as onUserCreate, onDelete as onUserDelete } from './triggers/authTrigger';
