# 🚀 Complete Setup Guide - AI Event Decor Material Analyzer

This guide will help you set up both the React frontend and Node.js backend for the AI Event Decor Material Analyzer.

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git** (optional)

## 🏗️ Project Structure

```
ai-event-decor-analyzer/
├── frontend/                 # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/                  # Node.js Express server
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── ...
└── SETUP_GUIDE.md           # This file
```

## 🎯 Quick Start (5 Minutes)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run setup script (creates directories)
npm run setup

# Start development server
npm run dev
```

The backend will start on **http://localhost:5000**

### Step 2: Frontend Setup

```bash
# Open new terminal and navigate to frontend (root directory)
cd ..

# Install dependencies (if not already done)
npm install

# Start React development server
npm start
```

The frontend will start on **http://localhost:3000**

### Step 3: Test the Application

1. Open **http://localhost:3000** in your browser
2. Upload an image or video file
3. Select an event type (Wedding, Birthday, Corporate)
4. Add manual items using voice input or typing
5. Click "Analyze Materials" to see results

## 🔧 Detailed Setup

### Backend Configuration

1. **Environment Variables** (backend/.env):
   ```env
   PORT=5000
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=10485760
   FRONTEND_URL=http://localhost:3000
   ```

2. **Test Backend Endpoints**:
   ```bash
   # Health check
   curl http://localhost:5000/api/health
   
   # Get event templates
   curl http://localhost:5000/api/events
   
   # Upload file
   curl -X POST -F "file=@image.jpg" http://localhost:5000/api/upload
   ```

### Frontend Configuration

1. **API Configuration** (src/services/api.js):
   - Backend URL: `http://localhost:5000/api`
   - Automatic error handling and logging
   - File upload and analysis integration

2. **Environment Variables** (optional .env):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

## 🎨 Features Overview

### Frontend Features
- ✅ **Glassmorphism Dashboard** - Premium brown-themed UI
- ✅ **Voice Input** - Speech recognition for manual item entry
- ✅ **File Upload** - Images and videos support
- ✅ **Event Selection** - Wedding, Birthday, Corporate templates
- ✅ **Material Analysis** - Interactive charts and results
- ✅ **Multi-language** - English and Tamil support
- ✅ **Responsive Design** - Mobile and desktop optimized

### Backend Features
- ✅ **File Upload API** - Secure file handling with validation
- ✅ **Material Analysis** - Mock AI analysis (ready for real AI integration)
- ✅ **Event Templates** - Predefined event requirements
- ✅ **CORS Enabled** - Frontend integration ready
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **File Management** - Automatic cleanup and validation

## 🧪 Testing

### Manual Testing Checklist

**Backend Tests:**
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] File upload works
- [ ] Event templates load
- [ ] Analysis returns mock data

**Frontend Tests:**
- [ ] Dashboard loads with glassmorphism design
- [ ] Voice input works in manual entry
- [ ] File upload shows preview
- [ ] Event selection updates
- [ ] Analysis shows results and charts
- [ ] Language toggle works (English/Tamil)

**Integration Tests:**
- [ ] Frontend connects to backend
- [ ] File upload → analysis workflow
- [ ] Error handling displays properly
- [ ] Loading states work correctly

## 🔮 Next Steps & AI Integration

### Ready for AI Model Integration

The backend is structured to easily integrate real AI models:

1. **Replace Mock Analysis** (backend/controllers/analyzeController.js):
   ```javascript
   // Current: Mock data generation
   const mockDetectedItems = generateMockDetectedItems(eventType);
   
   // Future: Real AI model integration
   const detectedItems = await aiModelService.analyzeImage(filePath);
   ```

2. **AI Model Options**:
   - **YOLO** - Object detection
   - **TensorFlow.js** - Browser-based ML
   - **Google Vision API** - Cloud-based analysis
   - **Custom trained models** - Event-specific detection

3. **Integration Points**:
   - File preprocessing
   - Model inference
   - Confidence scoring
   - Bounding box detection

### Production Deployment

**Backend:**
- Configure cloud storage (AWS S3, Google Cloud)
- Add authentication and rate limiting
- Set up database for user data
- Implement real AI model endpoints

**Frontend:**
- Build production bundle: `npm run build`
- Deploy to Vercel, Netlify, or AWS
- Configure environment variables
- Set up CDN for assets

## 🚨 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 5000 is available
- Verify Node.js version (v14+)
- Run `npm install` in backend directory

**Frontend can't connect to backend:**
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API_BASE_URL in api.js

**File upload fails:**
- Check file size (max 10MB)
- Verify file type (images/videos only)
- Ensure uploads directory exists

**Voice input not working:**
- Use HTTPS or localhost only
- Allow microphone permissions
- Check browser compatibility

### Debug Mode

**Backend Logging:**
```bash
# Start with detailed logging
DEBUG=* npm run dev
```

**Frontend Debugging:**
- Open browser developer tools
- Check console for API calls
- Verify network requests in Network tab

## 📞 Support

**File Structure Issues:**
- Ensure all files are in correct directories
- Check import/export statements
- Verify package.json dependencies

**API Integration:**
- Test endpoints individually with curl/Postman
- Check request/response formats
- Verify error handling

**UI/UX Issues:**
- Check CSS imports
- Verify component props
- Test responsive design on different screens

## 🎉 Success!

If everything is working:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:3000
- ✅ File upload and analysis working
- ✅ Voice input functional
- ✅ Dashboard displaying properly

You now have a fully functional AI Event Decor Material Analyzer with a premium glassmorphism UI, voice input capabilities, and a robust backend ready for AI model integration!