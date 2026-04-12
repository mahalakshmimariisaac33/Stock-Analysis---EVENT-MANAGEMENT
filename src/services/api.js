import axios from 'axios';

// Configure base URL for your backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Upload file to backend
 * @param {File} file - File to upload
 * @returns {Promise} Upload response
 */
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    const message = error.response?.data?.message || 'Failed to upload file';
    throw new Error(message);
  }
};

/**
 * Analyze uploaded file for materials
 * @param {File} file - File to analyze
 * @param {string} eventType - Type of event (optional)
 * @returns {Promise} Analysis results
 */
export const fetchDetectedItems = async (file, eventType = null) => {
  try {
    // First upload the file
    const uploadResponse = await uploadFile(file);
    
    if (!uploadResponse.success) {
      throw new Error('File upload failed');
    }
    
    // Then analyze the uploaded file
    const analyzePayload = {
      filePath: uploadResponse.data.path,
      filename: uploadResponse.data.filename,
      eventType: eventType
    };
    
    const response = await api.post('/analyze', analyzePayload);
    
    if (response.data.success) {
      return response.data.data.detectedItems || [];
    } else {
      throw new Error(response.data.message || 'Analysis failed');
    }
  } catch (error) {
    console.error('Error analyzing file:', error);
    const message = error.response?.data?.message || error.message || 'Failed to analyze file';
    throw new Error(message);
  }
};

/**
 * Get all event templates
 * @returns {Promise} Event templates
 */
export const getEventTemplates = async () => {
  try {
    const response = await api.get('/events');
    
    if (response.data.success) {
      return response.data.data.templates || {};
    } else {
      throw new Error(response.data.message || 'Failed to fetch event templates');
    }
  } catch (error) {
    console.error('Error fetching event templates:', error);
    const message = error.response?.data?.message || 'Failed to fetch event templates';
    throw new Error(message);
  }
};

/**
 * Get specific event template
 * @param {string} eventType - Type of event
 * @returns {Promise} Event template
 */
export const getEventTemplate = async (eventType) => {
  try {
    const response = await api.get(`/events/${eventType}`);
    
    if (response.data.success) {
      return response.data.data.template || null;
    } else {
      throw new Error(response.data.message || 'Event template not found');
    }
  } catch (error) {
    console.error('Error fetching event template:', error);
    const message = error.response?.data?.message || 'Failed to fetch event template';
    throw new Error(message);
  }
};

/**
 * Check backend health
 * @returns {Promise} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw new Error('Backend server is not responding');
  }
};

/**
 * Save analysis result to database
 * @param {Object} analysisData - Analysis data to save
 * @returns {Promise} Save response
 */
export const saveAnalysis = async (analysisData) => {
  try {
    const response = await api.post('/save', analysisData);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to save analysis');
    }
  } catch (error) {
    console.error('Error saving analysis:', error);
    const message = error.response?.data?.message || 'Failed to save analysis';
    throw new Error(message);
  }
};

/**
 * Get analysis history with pagination
 * @param {Object} options - Query options (page, limit, eventType, etc.)
 * @returns {Promise} History response
 */
export const getAnalysisHistory = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.eventType) params.append('eventType', options.eventType);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    
    const response = await api.get(`/history?${params.toString()}`);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch history');
    }
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    const message = error.response?.data?.message || 'Failed to fetch analysis history';
    throw new Error(message);
  }
};

/**
 * Get recent analyses
 * @param {number} limit - Number of recent analyses to fetch
 * @returns {Promise} Recent analyses
 */
export const getRecentAnalyses = async (limit = 10) => {
  try {
    const response = await api.get(`/history/recent?limit=${limit}`);
    
    if (response.data.success) {
      return response.data.data.analyses || [];
    } else {
      throw new Error(response.data.message || 'Failed to fetch recent analyses');
    }
  } catch (error) {
    console.error('Error fetching recent analyses:', error);
    const message = error.response?.data?.message || 'Failed to fetch recent analyses';
    throw new Error(message);
  }
};

/**
 * Get analysis statistics
 * @returns {Promise} Analysis statistics
 */
export const getAnalysisStats = async () => {
  try {
    const response = await api.get('/history/stats');
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch statistics');
    }
  } catch (error) {
    console.error('Error fetching analysis statistics:', error);
    const message = error.response?.data?.message || 'Failed to fetch analysis statistics';
    throw new Error(message);
  }
};

/**
 * Delete analysis by ID
 * @param {string} analysisId - ID of analysis to delete
 * @returns {Promise} Delete response
 */
export const deleteAnalysis = async (analysisId) => {
  try {
    const response = await api.delete(`/save/${analysisId}`);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to delete analysis');
    }
  } catch (error) {
    console.error('Error deleting analysis:', error);
    const message = error.response?.data?.message || 'Failed to delete analysis';
    throw new Error(message);
  }
};

export default api;