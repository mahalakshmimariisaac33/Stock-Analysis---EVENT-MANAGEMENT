import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import './FileUpload.css';

const FileUpload = forwardRef(({ onFileUpload, uploadedFile, language = 'en' }, ref) => {
  const fileInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    click: () => fileInputRef.current?.click()
  }));

  const translations = {
    en: {
      title: 'File Upload',
      dragDrop: 'Drag & drop an image or video here',
      or: 'or',
      browse: 'Browse Files',
      supportedFormats: 'Supported: JPG, PNG, MP4, MOV',
      preview: 'Preview'
    },
    ta: {
      title: 'கோப்பு பதிவேற்றம்',
      dragDrop: 'படம் அல்லது வீடியோவை இங்கே இழுத்து விடவும்',
      or: 'அல்லது',
      browse: 'கோப்புகளை உலாவவும்',
      supportedFormats: 'ஆதரிக்கப்படுபவை: JPG, PNG, MP4, MOV',
      preview: 'முன்னோட்டம்'
    }
  };

  const t = translations[language] || translations['en'];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const isImage = (file) => {
    return file && file.type.startsWith('image/');
  };

  const isVideo = (file) => {
    return file && file.type.startsWith('video/');
  };

  return (
    <div className="file-upload">
      <h3>{t.title}</h3>
      
      <div 
        className="upload-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {!uploadedFile ? (
          <>
            <div className="upload-icon">📁</div>
            <p>{t.dragDrop}</p>
            <p className="or-text">{t.or}</p>
            <button className="browse-btn">{t.browse}</button>
            <p className="supported-formats">{t.supportedFormats}</p>
          </>
        ) : (
          <div className="file-preview">
            <h4>{t.preview}</h4>
            {isImage(uploadedFile) && (
              <img 
                src={URL.createObjectURL(uploadedFile)} 
                alt="Preview" 
                className="preview-image"
              />
            )}
            {isVideo(uploadedFile) && (
              <video 
                src={URL.createObjectURL(uploadedFile)} 
                controls 
                className="preview-video"
              />
            )}
            <p className="file-name">{uploadedFile.name}</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;