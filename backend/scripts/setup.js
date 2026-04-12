// Setup script for initializing the backend
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up AI Event Decor Material Analyzer Backend...\n');

// Create necessary directories
const directories = [
  'uploads',
  'logs'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}/`);
  } else {
    console.log(`📁 Directory already exists: ${dir}/`);
  }
});

// Check environment file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Environment file (.env) found');
} else {
  console.log('⚠️  Environment file (.env) not found - using defaults');
}

console.log('\n🎉 Backend setup completed!');
console.log('\nNext steps:');
console.log('1. Install MongoDB locally or use MongoDB Atlas');
console.log('2. Update MONGODB_URI in .env if needed (default: mongodb://localhost:27017/ai-event-analyzer)');
console.log('3. Run: npm install');
console.log('4. Run: npm run dev (development) or npm start (production)');
console.log('5. Test API at: http://localhost:5000');
console.log('\n📚 Available endpoints:');
console.log('   GET  /api/health - Health check');
console.log('   POST /api/upload - File upload');
console.log('   POST /api/analyze - Material analysis');
console.log('   GET  /api/events - Event templates');
console.log('   POST /api/save - Save analysis');
console.log('   GET  /api/history - Analysis history');
console.log('\n📚 Check README.md for detailed documentation');