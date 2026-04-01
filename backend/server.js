const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'GROQ_API_KEY'];
if (process.env.NODE_ENV === 'production') {
  requiredEnvVars.push('FRONTEND_URL');
}

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const app = express();

// Required when behind a reverse proxy so rate limiting uses real client IPs.
app.set('trust proxy', 1);

// ─── Security Middleware ─────────────────────────────

// HTTP security headers (configured for API)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: false,
}));

// CORS — only allow frontend origin
const normalizeOrigin = (origin) => (typeof origin === 'string' ? origin.replace(/\/$/, '') : origin);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || '').split(',').map((o) => o.trim()),
].map(normalizeOrigin).filter(Boolean);

const vercelProjectPrefix = process.env.VERCEL_PROJECT_PREFIX?.trim();
const vercelPreviewRegex = vercelProjectPrefix
  ? new RegExp(`^https://${escapeRegex(vercelProjectPrefix)}(?:-[a-z0-9-]+)?\\.vercel\\.app$`, 'i')
  : null;

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (server-to-server, curl, etc.)
    if (!origin) return callback(null, true);

    const normalized = normalizeOrigin(origin);
    const isExplicitlyAllowed = allowedOrigins.includes(normalized);
    const isVercelPreview = vercelPreviewRegex ? vercelPreviewRegex.test(normalized) : false;

    if (isExplicitlyAllowed || isVercelPreview) return callback(null, true);

    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Rate limiting — general API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  message: { message: 'Too many requests, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', generalLimiter);

// Stricter rate limit for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,                   // 15 login/register attempts per window
  message: { message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Even stricter limit for AI trip generation (expensive calls)
const tripGenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,                   // 10 trip generations per hour
  message: { message: 'Trip generation limit reached. Please try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/trips', (req, res, next) => {
  if (req.method === 'POST') return tripGenLimiter(req, res, next);
  next();
});

// Body parser with size limit (prevent large payloads)
app.use(express.json({ limit: '10kb' }));

// Sanitize req.body against NoSQL injection (strip keys with $ or .)
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
    return obj;
  };
  if (req.body) sanitize(req.body);
  next();
});

// ─── Routes ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

app.get('/', (req, res) => {
  res.send('Trippzy API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected successfully');
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.log('MongoDB connection error:', err));
