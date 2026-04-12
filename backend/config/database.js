// Database connection configuration
const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-event-analyzer';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(mongoURI, options);
    
    console.log('🗄️  MongoDB Connected Successfully');
    console.log(`📍 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}:${conn.connection.port}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    
    // For development, continue without database
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Continuing without database in development mode');
      return null;
    }
    
    // In production, exit the process
    process.exit(1);
  }
};

/**
 * Handle database connection events
 */
const setupDatabaseEvents = () => {
  // Connection events
  mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  Mongoose disconnected from MongoDB');
  });

  // Handle app termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error);
      process.exit(1);
    }
  });
};

/**
 * Check database connection status
 */
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get database connection info
 */
const getDatabaseInfo = () => {
  if (!isDatabaseConnected()) {
    return { connected: false, message: 'Database not connected' };
  }
  
  return {
    connected: true,
    name: mongoose.connection.name,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    readyState: mongoose.connection.readyState,
    collections: Object.keys(mongoose.connection.collections)
  };
};

module.exports = {
  connectDB,
  setupDatabaseEvents,
  isDatabaseConnected,
  getDatabaseInfo
};