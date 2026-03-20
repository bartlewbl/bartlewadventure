import express from 'express';
import cors from 'cors';
import authRouter from '../server/routes/auth.js';
import saveRouter from '../server/routes/save.js';
import invitesRouter from '../server/routes/invites.js';
import dailyRewardsRouter from '../server/routes/dailyRewards.js';
import tradesRouter from '../server/routes/trades.js';
import marketRouter from '../server/routes/market.js';
import probabilityConfigRouter from '../server/routes/probabilityConfig.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/save', saveRouter);
app.use('/api/invites', invitesRouter);
app.use('/api/daily-rewards', dailyRewardsRouter);
app.use('/api/trades', tradesRouter);
app.use('/api/market', marketRouter);
app.use('/api/probability-config', probabilityConfigRouter);

export default app;
