import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import ritualsRoutes from './routes/rituals.js';
import usersRoutes from './routes/users.js';
import connectionsRoutes from './routes/connections.js';
import categoriesRoutes from './routes/categories.js';
import interactionsRoutes from './routes/interactions.js';
import { errorHandler } from './middleware/auth.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rituals', ritualsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/rituals', interactionsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

export default app;
