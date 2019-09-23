import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Routers
import authRouter from './routes/authRouter';

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Routes
app.use(authRouter);

// API endpoint

/* eslint import/prefer-default-export: */
export const api = functions.region('europe-west1').https.onRequest(app);
