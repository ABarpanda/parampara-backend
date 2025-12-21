import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import ritualsRoutes from './routes/rituals.js';
import usersRoutes from './routes/users.js';
import connectionsRoutes from './routes/connections.js';
import categoriesRoutes from './routes/categories.js';
import interactionsRoutes from './routes/interactions.js';
import statesRoutes from './routes/states.js';
import regionsRoutes from './routes/regions.js';
import { errorHandler } from './middleware/auth.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL.split(","),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Parampara Backend API', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rituals', ritualsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/interactions', interactionsRoutes);
app.use('/api/states', statesRoutes);
app.use('/api/regions', regionsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

export default app;
