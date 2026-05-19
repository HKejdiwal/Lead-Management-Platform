import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import leadRoutes from './routes/leads';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (_, res) => {
  res.json({ message: 'Smart Leads API is running' });
});

app.use(errorHandler);

export default app;
