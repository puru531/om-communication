require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoices');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

async function start() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI not set in environment. See .env.example');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }

  app.use('/api/auth', authRoutes);
  app.use('/api/invoices', invoiceRoutes);

  app.get('/', (req, res) => res.json({ ok: true, message: 'Om Communication API' }));

  // simple error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: true, message: err.message || 'Internal Server Error' });
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
