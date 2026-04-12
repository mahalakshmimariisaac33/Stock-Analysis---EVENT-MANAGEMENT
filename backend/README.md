# AI Event Decor Material Analyzer - Backend

A Node.js Express backend server for the AI Event Decor Material Analyzer application.

## 🚀 Features

- **File Upload**: Upload images and videos of event setups
- **Material Analysis**: Analyze uploaded files for decorative materials (mock implementation)
- **Event Templates**: Get predefined event requirements and templates
- **Database Storage**: MongoDB integration for saving analysis results
- **History Management**: Track and retrieve past analyses with pagination
- **CORS Enabled**: Ready to connect with React frontend
- **Error Handling**: Comprehensive error handling and validation
- **File Management**: Automatic file cleanup and validation

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   └── database.js      # MongoDB connection
├── controllers/         # Request handlers
│   ├── uploadController.js
│   ├── analyzeController.js
│   ├── eventController.js
│   ├── saveController.js
│   └── historyController.js
├── models/              # Database models
│   └── Analysis.js      # Analysis result schema
├── routes/              # API routes
│   ├── uploadRoutes.js
│   ├── analyzeRoutes.js
│   ├── eventRoutes.js
│   ├── saveRoutes.js
│   └── historyRoutes.js
├── services/            # Business logic
│   ├── uploadService.js
│   └── eventService.js
├── uploads/             # Uploaded files (auto-created)
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── server.js            # Main server file
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up MongoDB**:
   - **Local MongoDB**: Install and start MongoDB service
   - **MongoDB Atlas**: Get connection string from Atlas dashboard

4. **Set up environment variables**:
   - Update `.env` file with your MongoDB URI
   - Default port is 5001

5. **Start the server**:
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Health Check
- **GET** `/api/health` - Server health status

### File Upload
- **POST** `/api/upload`
  - Upload image or video file
  - Accepts: JPEG, PNG, GIF, MP4, AVI, MOV
  - Max size: 10MB

### Material Analysis
- **POST** `/api/analyze`
  - Analyze uploaded file for materials
  - Returns mock detected items (replace with real AI model)

### Event Templates
- **GET** `/api/events` - Get all event templates
- **GET** `/api/events/:eventType` - Get specific event template

### Save Analysis
- **POST** `/api/save` - Save analysis result to database
- **GET** `/api/save/:id` - Get specific analysis by ID
- **DELETE** `/api/save/:id` - Delete specific analysis

### Analysis History
- **GET** `/api/history` - Get analysis history (with pagination)
- **GET** `/api/history/recent` - Get recent analyses
- **GET** `/api/history/stats` - Get analysis statistics
- **GET** `/api/history/event/:eventType` - Get analyses by event type
- **DELETE** `/api/history/clear` - Clear all history (admin)

## 🔧 Configuration

### Environment Variables (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ai-event-analyzer
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Supported File Types
- **Images**: JPEG, JPG, PNG, GIF
- **Videos**: MP4, AVI, MOV

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🎭 Event Templates

Currently supported event types:
- **wedding** - Wedding ceremonies and receptions
- **birthday** - Birthday party celebrations
- **corporate** - Business and corporate events
- **anniversary** - Anniversary celebrations
- **graduation** - Graduation parties

## 🔮 Future Enhancements

### AI Model Integration
Replace mock analysis with real AI models:
```javascript
// TODO: Integrate with YOLO, TensorFlow, or other AI services
// Example integration points marked in analyzeController.js
```

### Database Integration
- Store event templates in database
- User management and file history
- Analytics and reporting

### Advanced Features
- Real-time analysis progress
- Batch file processing
- Image preprocessing
- Confidence scoring
- Bounding box detection

## 🧪 Testing

### Manual Testing
1. Start the server: `npm run dev`
2. Test endpoints using Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Upload file
curl -X POST -F "file=@image.jpg" http://localhost:5000/api/upload

# Get events
curl http://localhost:5000/api/events
```

### Frontend Integration
The backend is configured to work with the React frontend running on `http://localhost:3000`.

## 🔒 Security Features

- File type validation
- File size limits
- CORS configuration
- Input sanitization
- Error handling without exposing internals

## 📝 Development Notes

### Adding New Event Types
1. Add template to `services/eventService.js`
2. Update mock data in `controllers/analyzeController.js`

### File Upload Customization
- Modify `services/uploadService.js` for different storage options
- Update file filters and size limits as needed

### AI Model Integration
- Replace mock functions in `analyzeController.js`
- Add model configuration to `.env`
- Implement proper error handling for AI service calls

## 🚨 Important Notes

- **Mock Data**: Current analysis returns mock data for frontend development
- **File Cleanup**: Uploaded files are stored locally (implement cleanup strategy)
- **Production**: Configure proper file storage (AWS S3, etc.) for production
- **Security**: Add authentication and rate limiting for production use

## 📞 Support

For questions or issues:
1. Check the console logs for detailed error messages
2. Verify file permissions for uploads directory
3. Ensure all dependencies are installed correctly
4. Check CORS configuration if frontend connection fails