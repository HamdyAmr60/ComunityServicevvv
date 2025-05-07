import api from './api';

const feedbackService = {
  // Leave feedback on a completed service request
  async leaveFeedback(serviceRequestId, rating, comment) {
    try {
      const response = await api.post('/feedback', {
        serviceRequestId,
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all feedback for a specific service request
  async getFeedbackByServiceRequest(serviceRequestId) {
    try {
      const response = await api.get(`/feedback/by-request/${serviceRequestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all feedback (Admin only)
  async getAllFeedback() {
    try {
      const response = await api.get('/feedback');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get testimonials (high-rated feedback)
  async getTestimonials(limit = 6) {
    try {
      const response = await api.get('/feedback/testimonials', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get feedback statistics
  async getFeedbackStatistics() {
    try {
      const response = await api.get('/feedback/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default feedbackService; 