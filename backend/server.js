require('dotenv').config({ path: __dirname + '/.env' });
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
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

// Database + start
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');

async function startServer() {
  try {
    console.log('Starting persistent local database...');
    const mongoServer = await MongoMemoryServer.create({
      instance: { dbPath: DATA_DIR, storageEngine: 'wiredTiger' },
    });
    await mongoose.connect(mongoServer.getUri());
    console.log('✅ Connected to persistent local MongoDB!');
    console.log('   Data stored in:', DATA_DIR);

    // Seed the database with John Doe
    await seed();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    try {
      console.log('Falling back to in-memory database...');
      const { MongoMemoryServer: MMS } = require('mongodb-memory-server');
      const memServer = await MMS.create();
      await mongoose.connect(memServer.getUri());
      console.log('✅ Connected to in-memory MongoDB (data will NOT persist)');
      await seed();
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (fallbackErr) {
      console.error('Fatal: Could not start database', fallbackErr);
      process.exit(1);
    }
  }
}

startServer();