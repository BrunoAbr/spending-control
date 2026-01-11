import express from 'express';
import admin from 'firebase-admin';
import { authenticateToken } from './middlewares/authenticate-jwt.js';
import { TransactionController } from './transactions/controller.js';
import { transactionsRouter } from './transactions/routes.js';

const app = express();

admin.initializeApp({
  credential: admin.credential.cert("backend/serviceAccountKey.json")
});

app.use('/transactions', transactionsRouter);

app.listen(3000, () => console.log('API rest iniciada em http://localhost:3000'));