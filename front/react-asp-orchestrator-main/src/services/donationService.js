import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const donationService = {
  async getProjects() {
    try {
      const response = await axios.get(
        `${API_URL}/donations/projects`,
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async donate(serviceRequestId, amount) {
    try {
      const response = await axios.post(
        `${API_URL}/donations`,
        { serviceRequestId, amount },
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

  async getDonationsByServiceRequest(serviceRequestId) {
    try {
      const response = await axios.get(
        `${API_URL}/donations/by-request/${serviceRequestId}`,
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getMyDonations() {
    try {
      const response = await axios.get(
        `${API_URL}/donations/my-donations`,
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default donationService; 