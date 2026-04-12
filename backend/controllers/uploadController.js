// Controller for handling file uploads
const path = require('path');
const fs = require('fs');

/**
 * Handle file upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select an image or video file.'
      });
    }

    const file = req.file;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mov'];
    if (!allowedTypes.includes(file.mimetype)) {
      // Delete uploaded file if invalid type
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload an image (JPEG, PNG, GIF) or video (MP4, AVI, MOV).'
      });
    }

    // Generate file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    
    console.log('✅ File uploaded successfully:', file.filename);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        url: fileUrl,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('❌ File cleanup error:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};

module.exports = {
  uploadFile
};