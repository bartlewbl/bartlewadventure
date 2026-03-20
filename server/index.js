import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDb } from './db.js';
import authRouter from './routes/auth.js';
import saveRouter from './routes/save.js';
import invitesRouter from './routes/invites.js';
import dailyRewardsRouter from './routes/dailyRewards.js';
import tradesRouter from './routes/trades.js';
import marketRouter from './routes/market.js';
import probabilityConfigRouter from './routes/probabilityConfig.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

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

// Serve static frontend in production
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('/{*path}', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// Initialize database then start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
