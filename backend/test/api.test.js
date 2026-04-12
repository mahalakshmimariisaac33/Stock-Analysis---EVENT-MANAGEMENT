// Basic API tests for manual testing
// Run these tests manually using curl or Postman

const testEndpoints = {
  // Health check
  health: {
    method: 'GET',
    url: 'http://localhost:5000/api/health',
    description: 'Check if server is running'
  },

  // Get all events
  events: {
    method: 'GET', 
    url: 'http://localhost:5000/api/events',
    description: 'Get all event templates'
  },

  // Get specific event
  specificEvent: {
    method: 'GET',
    url: 'http://localhost:5000/api/events/wedding',
    description: 'Get wedding event template'
  },

  // Upload file (requires actual file)
  upload: {
    method: 'POST',
    url: 'http://localhost:5000/api/upload',
    description: 'Upload image/video file',
    curl: 'curl -X POST -F "file=@your-image.jpg" http://localhost:5000/api/upload'
  },

  // Analyze file (requires uploaded file data)
  analyze: {
    method: 'POST',
    url: 'http://localhost:5000/api/analyze',
    description: 'Analyze uploaded file',
    body: {
      filePath: 'uploads/filename.jpg',
      filename: 'filename.jpg',
      eventType: 'wedding'
    }
  }
};

console.log('🧪 API Test Endpoints:');
console.log('='.repeat(50));

Object.entries(testEndpoints).forEach(([name, test]) => {
  console.log(`\n📍 ${name.toUpperCase()}`);
  console.log(`   Method: ${test.method}`);
  console.log(`   URL: ${test.url}`);
  console.log(`   Description: ${test.description}`);
  
  if (test.curl) {
    console.log(`   Curl: ${test.curl}`);
  }
  
  if (test.body) {
    console.log(`   Body: ${JSON.stringify(test.body, null, 2)}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log('💡 To test manually:');
console.log('1. Start server: npm run dev');
console.log('2. Use curl, Postman, or browser for GET requests');
console.log('3. Check console logs for detailed information');

module.exports = testEndpoints;