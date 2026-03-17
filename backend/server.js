require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const serviceRoutes = require('./routes/services');
const companyRoutes = require('./routes/companies');
const invoiceRoutes = require('./routes/invoices');

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:80',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://93.127.198.5:7000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Logger ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/invoices', invoiceRoutes);


// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});


// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found.` });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(500).json({ message: 'Internal server error.' });
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`\n🚀 Auth server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Login:  POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   Me:     GET  http://localhost:${PORT}/api/auth/me\n`);
});
