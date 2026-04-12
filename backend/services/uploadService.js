// Service for handling file uploads with multer
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    
    // Clean filename (remove special characters)
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${cleanBaseName}_${uniqueSuffix}${extension}`;
    
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/quicktime'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 1 // Only allow 1 file at a time
  }
});

// Middleware for single file upload
const uploadMiddleware = upload.single('file');

// Helper function to clean up old files (optional)
const cleanupOldFiles = (maxAge = 24 * 60 * 60 * 1000) => { // 24 hours default
  const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
  
  if (!fs.existsSync(uploadDir)) return;
  
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('❌ Error reading upload directory:', err);
      return;
    }
    
    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        
        const now = new Date().getTime();
        const fileAge = now - stats.mtime.getTime();
        
        if (fileAge > maxAge) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('❌ Error deleting old file:', err);
            } else {
              console.log('🗑️ Deleted old file:', file);
            }
          });
        }
      });
    });
  });
};

module.exports = {
  uploadMiddleware,
  cleanupOldFiles
};