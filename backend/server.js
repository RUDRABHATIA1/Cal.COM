require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const seed     = require('./seed');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// DB Status Middleware
app.use((req, res, next) => {
  if (
    mongoose.connection.readyState !== 1 &&
    req.path.startsWith('/api/') &&
    req.path !== '/api/health'
  ) {
    return res.status(503).json({
      error: 'Database Unavailable',
      message: 'The server is unable to connect to the database.',
    });
  }
  next();
});

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/event-types', require('./routes/eventTypes'));
app.use('/api/availability',require('./routes/availability'));
app.use('/api/bookings',    require('./routes/bookings'));
app.use('/api/teams',       require('./routes/teams'));

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cal.com Clone API is running' });
});

// ── STARTUP SEQUENCE ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const IS_PROD = process.env.NODE_ENV === 'production';

// Start HTTP server immediately (Critical for Railway/Render health checks)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Cal.com Clone API is starting...`);
  console.log(`📡 Listening on: http://0.0.0.0:${PORT}`);
  console.log(`🌍 Mode: ${IS_PROD ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`──────────────────────────────────────────\n`);
});

async function startDatabase() {
  try {
    if (IS_PROD) {
      console.log('⏳ Connecting to Production MongoDB Atlas...');
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing in environment variables!');
      }
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB Atlas!');
    } else {
      console.log('⏳ Starting persistent local database (Development Mode)...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create({
          instance: { dbPath: DATA_DIR, storageEngine: 'wiredTiger' },
        });
        await mongoose.connect(mongoServer.getUri());
        console.log('✅ Connected to local MongoDB!');
        console.log('📂 Data directory:', DATA_DIR);
      } catch (devErr) {
        console.warn('⚠️  Could not start persistent local DB. Falling back to in-memory...');
        const { MongoMemoryServer: MMS } = require('mongodb-memory-server');
        const memServer = await MMS.create();
        await mongoose.connect(memServer.getUri());
        console.log('✅ Connected to in-memory MongoDB (Data will NOT persist)');
      }
    }

    // Auto-seed for safety 
    console.log('🌱 Starting database seeding...');
    await seed();
    console.log('✨ Startup complete and database ready!\n');

  } catch (err) {
    console.error('\n❌ FATAL STARTUP ERROR:', err.message);
    if (IS_PROD) {
      console.error('────────────────────────────────────────────────────────────────');
      console.error('1. Check if MONGODB_URI is set correctly in Railway dashboard.');
      console.error('2. Ensure MongoDB Atlas IP Whitelist allows 0.0.0.0/0.');
      console.error('────────────────────────────────────────────────────────────────\n');
      // In production, we exit if DB fails so container can restart
      setTimeout(() => process.exit(1), 5000); 
    }
  }
}

startDatabase();