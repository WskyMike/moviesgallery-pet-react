// server.js
import express from 'express';
import dotenv from 'dotenv';
import process from 'process';
import seoRouter from './module_seo.cjs';
import trackerRouter from './module_tracker.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware для разбора JSON и доверия заголовкам прокси
app.use(express.json());
app.set('trust proxy', true);

app.use('/seo', seoRouter);
app.use('/back', trackerRouter);

app.listen(port, () => {
  console.log(`🔎 Cервер запущен на порту ${port}`);
});
