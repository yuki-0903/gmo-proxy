import express from 'express';
import cors from 'cors';
import { gmoRoutes } from './routes/gmo';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'GMO Proxy Server is running!',
    version: '1.0.0',
    endpoints: [
      '/health',
      '/api/v1/status',
      '/api/v1/ticker',
      '/api/v1/klines',
      '/api/v1/symbols'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/v1', gmoRoutes);

app.use(errorHandler);

export default app;