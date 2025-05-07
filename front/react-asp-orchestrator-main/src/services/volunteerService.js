import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const volunteerService = {
  async applyToServiceRequest(serviceRequestId) {
    try {
      const response = await axios.post(`${API_URL}/volunteerapplications`, 
        { serviceRequestId },
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getApplicationsByServiceRequest(serviceRequestId) {
    try {
      const response = await axios.get(`${API_URL}/volunteerapplications/by-request/${serviceRequestId}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getMyApplications() {
    try {
      const response = await axios.get(`${API_URL}/volunteerapplications/my-applications`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateApplicationStatus(id, status) {
    try {
      const response = await axios.put(`${API_URL}/volunteerapplications/${id}/status`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default volunteerService; 