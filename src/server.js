import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load env variables from .env
dotenv.config();

// Import routes
import healthRoutes from './routes/health.js';
import callRoutes from './routes/calls.js';
import aiRoutes from './routes/ai.js';
import suggestRoutes from './routes/suggest.js';

// App setup
const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// Middleware Setup
// ─────────────────────────────────────────────────────────────
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ MUST come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined'));

// ─────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/suggest', suggestRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'CallMate AI',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      calls: '/api/calls',
      ai: '/api/ai',
      suggest: '/api/suggest'
    }
  });
});

// 404 Not Found Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ─────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CallMate AI server running on http://localhost:${PORT}`);
});
