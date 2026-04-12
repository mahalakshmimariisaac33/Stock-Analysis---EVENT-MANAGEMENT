
# AI Event Decor Material Analyzer

A responsive React.js frontend application for analyzing event decoration materials using AI. The application allows users to upload images/videos, manually input items, view detected materials, and get voice feedback in English and Tamil.

## Features

### 🔧 Core Functionality
- **File Upload**: Upload images or videos of event decoration setups with drag-and-drop support
- **Manual Input**: Add, edit, and delete items manually with material categorization
- **AI Detection**: Display detected items from backend API with confidence scores
- **Material Visualization**: Interactive pie and bar charts showing material distribution
- **Multilingual Support**: Toggle between English and Tamil languages
- **Voice Output**: Text-to-speech functionality in both languages
- **Responsive Design**: Mobile-first design that works on all devices

### 📊 Data Visualization
- Material distribution charts (Pie & Bar charts)
- Real-time updates based on detected and manual items
- Color-coded materials for easy identification
- Summary statistics display

### 🎯 User Experience
- Clean and modern UI with card-based layout
- Loading spinners and error handling
- Drag-and-drop file upload with preview
- Smooth animations and transitions
- Accessibility-compliant design

## Tech Stack

- **Frontend**: React.js 18
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios
- **Styling**: CSS3 with Flexbox/Grid
- **Voice**: Web Speech API
- **Build Tool**: Create React App

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-event-decor-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/           # React components
│   ├── FileUpload.js    # File upload with preview
│   ├── ManualInput.js   # Manual item input form
│   ├── DetectedItems.js # Display AI-detected items
│   ├── MaterialChart.js # Chart visualization
│   ├── LanguageToggle.js# Language switcher
│   ├── VoiceOutput.js   # Text-to-speech
│   └── LoadingSpinner.js# Loading indicator
├── services/
│   └── api.js           # API service layer
├── App.js               # Main application component
├── App.css              # Global styles
└── index.js             # Application entry point
```

## API Integration

The application is designed to work with a Node.js backend API. Currently, it uses mock data for demonstration.

### Expected API Endpoints

```javascript
POST /api/analyze
- Body: FormData with 'file' field
- Response: { items: [{ name, category, material, confidence }] }

POST /api/upload  
- Body: FormData with 'file' field
- Response: { success: true, fileId: string }
```

### Connecting to Real Backend

1. Update `src/services/api.js`
2. Replace mock data with actual API calls
3. Configure `REACT_APP_API_URL` environment variable

## Usage

### File Upload
1. Drag and drop an image/video or click to browse
2. Preview appears after selection
3. AI analysis starts automatically
4. Results appear in "Detected Items" section

### Manual Input
1. Enter item name, category, and material
2. Click "Add Item" or press Enter
3. Edit existing items using the Edit button
4. Delete items using the Delete button

### Material Visualization
1. Charts update automatically as items are added
2. Toggle between Pie and Bar chart views
3. View summary statistics below charts

### Voice Output
1. Click the "Voice Output" button
2. Hear material analysis in selected language
3. Stop playback using the Stop button

### Language Toggle
1. Use dropdown in header to switch languages
2. All UI text updates immediately
3. Voice output uses appropriate language

## Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- **Speech Synthesis**: Supported in most modern browsers
- **File API**: Required for drag-and-drop functionality

## Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px  
- **Mobile**: 320px - 767px

## Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## Customization

### Adding New Languages
1. Update translations objects in components
2. Add language option to `LanguageToggle.js`
3. Configure speech synthesis language codes

### Styling
- Modify CSS files in `src/components/`
- Update color scheme in CSS custom properties
- Adjust responsive breakpoints as needed

### Chart Types
- Add new chart types in `MaterialChart.js`
- Import additional Chart.js components
- Update chart toggle buttons

## Performance Optimization

- Images are automatically resized for preview
- Charts use efficient rendering with Chart.js
- API calls include timeout configuration
- Loading states prevent multiple simultaneous requests

## Accessibility Features

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast color scheme
- Screen reader compatible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


