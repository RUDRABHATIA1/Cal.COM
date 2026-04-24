require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

// Pre-register models
require('./models/User');
require('./models/EventType');
require('./models/Availability');
require('./models/Booking');
require('./models/Team');
require('./models/Workflow');

const seed = require('./seed');
const app  = express();

// ── CORS ───────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => cb(null, true), // allow all origins for clone app
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// ── Request Logger ─────────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ── DB Guard Middleware ────────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (
    mongoose.connection.readyState !== 1 &&
    req.path.startsWith('/api/') &&
    req.path !== '/api/health'
  ) {
    return res.status(503).json({
      error: 'Database Unavailable',
      message: 'Server is connecting to the database. Please retry in a moment.',
    });
  }
  next();
});

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/users',        require('./routes/users'));
app.use('/api/event-types',  require('./routes/eventTypes'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/bookings',     require('./routes/bookings'));
app.use('/api/teams',        require('./routes/teams'));

// ── Health ─────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.floor(process.uptime()),
  });
});

app.get('/api/debug/db', async (_req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'DB not connected', readyState: mongoose.connection.readyState });
    }
    res.json({
      users:      await mongoose.model('User').countDocuments(),
      eventTypes: await mongoose.model('EventType').countDocuments(),
      bookings:   await mongoose.model('Booking').countDocuments(),
      teams:      await mongoose.model('Team').countDocuments(),
      connected:  true,
      env:        process.env.NODE_ENV || 'development',
      has_uri:    !!process.env.MONGODB_URI,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 404 & Global Error Handlers ────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ── Start HTTP Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Cal.com Clone API starting...`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🗄  DB: ${process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local MongoMemoryServer'}`);
  console.log(`──────────────────────────────────────────\n`);
});

// ── Graceful Shutdown (SIGTERM from Railway/Docker) ────────────────────────────
const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(async () => {
    try {
      await mongoose.connection.close(false);
      console.log('✅ MongoDB connection closed.');
    } catch (e) {
      console.error('Error closing MongoDB:', e.message);
    }
    process.exit(0);
  });
  // Force exit after 15s if graceful shutdown hangs
  setTimeout(() => { console.error('Forced shutdown.'); process.exit(1); }, 15000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ── Prevent crashes from unhandled promise rejections ─────────────────────────
// Node 15+ exits on unhandledRejection by default — this prevents that crash loop
process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Unhandled Promise Rejection (non-fatal):', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  // Only exit for truly unrecoverable errors
  process.exit(1);
});

// ── Database Connection ────────────────────────────────────────────────────────
// KEY FIX: Use MONGODB_URI *presence* to decide mode, not NODE_ENV.
// This ensures Railway always uses Atlas when the env var is set.
const USE_ATLAS = !!process.env.MONGODB_URI;
const DATA_DIR  = path.join(__dirname, 'data');

const MONGOOSE_OPTS = {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS:          45000,
  connectTimeoutMS:         15000,
  maxPoolSize:              10,
  minPoolSize:              2,
  retryWrites:              true,
};

async function connectDatabase() {
  if (USE_ATLAS) {
    console.log('⏳ Connecting to MongoDB Atlas...');
    try {
      await mongoose.connect(process.env.MONGODB_URI, MONGOOSE_OPTS);
      console.log('✅ Connected to MongoDB Atlas!');
    } catch (err) {
      console.error('❌ Atlas connection FAILED:', err.message);
      console.error('→ Check MONGODB_URI in Railway dashboard.');
      console.error('→ Ensure Atlas IP whitelist includes 0.0.0.0/0.');
      // In production, we MUST fail if Atlas is expected but unreachable
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      console.warn('⚠️  Continuing in development mode...');
    }
  } else {
    // Check if we are in production but missing the URI
    if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
      console.error('❌ CRITICAL ERROR: MONGODB_URI is missing in production!');
      console.error('→ Please set MONGODB_URI in your environment variables.');
      process.exit(1);
    }

    console.log('⏳ Starting local MongoDB (development mode)...');
    try {
      // Try to require the memory server only if it exists
      let MongoMemoryServer;
      try {
        const mms = require('mongodb-memory-server');
        MongoMemoryServer = mms.MongoMemoryServer;
      } catch (e) {
        throw new Error('mongodb-memory-server not installed (run npm install --save-dev)');
      }

      const mongoServer = await MongoMemoryServer.create({
        instance: { dbPath: DATA_DIR, storageEngine: 'wiredTiger' },
      });
      await mongoose.connect(mongoServer.getUri());
      console.log('✅ Connected to local persistent MongoDB!');
      console.log('📂 Data directory:', DATA_DIR);
    } catch (devErr) {
      console.warn('⚠️  Local DB failed:', devErr.message);
      console.log('⏳ Falling back to in-memory...');
      try {
        const { MongoMemoryServer: MMS } = require('mongodb-memory-server');
        const mem = await MMS.create();
        await mongoose.connect(mem.getUri());
        console.log('✅ Connected to in-memory MongoDB (data will NOT persist)');
      } catch (finalErr) {
        console.error('❌ All DB attempts failed:', finalErr.message);
        process.exit(1);
      }
    }
  }

  // Reconnect event handlers
  mongoose.connection.on('disconnected', () =>
    console.warn('⚠️  MongoDB disconnected. Mongoose will auto-reconnect...')
  );
  mongoose.connection.on('reconnected', () =>
    console.log('✅ MongoDB reconnected!')
  );
  mongoose.connection.on('error', (err) =>
    console.error('MongoDB error:', err.message)
  );

  // Seed
  try {
    console.log('🌱 Seeding database...');
    await seed();
    console.log('✨ Database ready!\n');
  } catch (seedErr) {
    console.error('⚠️  Seed error (non-fatal):', seedErr.message);
  }
}

connectDatabase();