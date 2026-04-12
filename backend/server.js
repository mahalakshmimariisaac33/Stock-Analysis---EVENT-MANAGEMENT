// Main server file for AI Event Decor Material Analyzer
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import database configuration
const { connectDB, setupDatabaseEvents, getDatabaseInfo } = require('./config/database');

// Import routes
const uploadRoutes = require('./routes/uploadRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const saveRoutes = require('./routes/saveRoutes');
const historyRoutes = require('./routes/historyRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Middleware Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/save', saveRoutes);
app.use('/api/history', historyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbInfo = getDatabaseInfo();
  
  res.json({
    status: 'OK',
    message: 'AI Event Decor Material Analyzer Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: dbInfo
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI Event Decor Material Analyzer API',
    endpoints: {
      health: '/api/health',
      upload: '/api/upload (POST)',
      analyze: '/api/analyze (POST)',
      events: '/api/events (GET)',
      save: '/api/save (POST)',
      history: '/api/history (GET)'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field.'
    });
  }
  
  // Generic error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
const startServer = async () => {
  // Setup database events
  setupDatabaseEvents();
  
  // Connect to database (optional in development)
  await connectDB();
  
  // Start Express server
  app.listen(PORT, () => {
    console.log('🚀 AI Event Decor Material Analyzer Backend Started');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`📁 Upload directory: ${uploadsDir}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log('📋 Available endpoints:');
    console.log('   GET  / - API information');
    console.log('   GET  /api/health - Health check');
    console.log('   POST /api/upload - File upload');
    console.log('   POST /api/analyze - Material analysis');
    console.log('   GET  /api/events - Event templates');
    console.log('   POST /api/save - Save analysis result');
    console.log('   GET  /api/history - Analysis history');
  });
};

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = app;