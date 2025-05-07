import axios from 'axios';
import authService from './authService';

// This is a placeholder API URL - you'll need to replace this with your actual API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const serviceRequestService = {
  // Get all service requests
  async getAllRequests() {
    try {
      const response = await axios.get(
        `${API_URL}/servicerequests`,
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

  // Get a single service request by ID
  async getById(id) {
    try {
      const response = await axios.get(
        `${API_URL}/servicerequests/${id}`,
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

  // Create a new service request
  async createRequest(requestData) {
    try {
      const response = await axios.post(
        `${API_URL}/servicerequests`,
        requestData,
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

  // Update service request status
  async updateStatus(id, statusData) {
    try {
      const response = await axios.put(
        `${API_URL}/servicerequests/${id}/status`,
        statusData,
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

  // Delete a service request (Admin only)
  async deleteRequest(id) {
    try {
      const response = await axios.delete(
        `${API_URL}/servicerequests/${id}`,
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

  // Get service requests by status
  getRequestsByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_URL}/service-requests?status=${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${status} service requests:`, error);
      throw error;
    }
  },

  // Get top volunteers
  getTopVolunteers: async (limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/volunteers/top?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top volunteers:', error);
      throw error;
    }
  },

  // For demo purposes - placeholder data
  getTopVolunteersDemo: async () => {
    // Sample data for demonstration
    const demoVolunteers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', credibilityScore: 98, completedServices: 45 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', credibilityScore: 96, completedServices: 38 },
      { id: 3, name: 'Robert Johnson', email: 'robert@example.com', credibilityScore: 94, completedServices: 32 },
      { id: 4, name: 'Maria Garcia', email: 'maria@example.com', credibilityScore: 92, completedServices: 29 },
      { id: 5, name: 'David Chen', email: 'david@example.com', credibilityScore: 91, completedServices: 27 }
    ];
    
    return demoVolunteers;
  },

  // For demo purposes - placeholder data for service requests
  getServiceRequestsDemo: async (status) => {
    // Sample data for demonstration
    const demoRequests = [
      {
        id: 1,
        title: 'Grocery Shopping for Elderly',
        description: 'Need help with weekly grocery shopping for an elderly couple.',
        status: status === 'completed' ? 'completed' : status === 'inProgress' ? 'inProgress' : 'cancelled',
        requesterName: 'Emily Johnson',
        requesterEmail: 'emily@example.com',
        createdAt: '2025-05-01T10:00:00',
        updatedAt: '2025-05-02T14:30:00',
        assignedVolunteerName: 'John Doe',
        assignedVolunteerId: 1,
        cancelReason: status === 'cancelled' ? 'Volunteer unavailable due to emergency' : undefined
      },
      {
        id: 2,
        title: 'Garden Maintenance',
        description: 'Need help with garden maintenance for a disabled veteran.',
        status: status === 'completed' ? 'completed' : status === 'inProgress' ? 'inProgress' : 'cancelled',
        requesterName: 'Michael Brown',
        requesterEmail: 'michael@example.com',
        createdAt: '2025-05-02T09:15:00',
        updatedAt: '2025-05-03T11:45:00',
        assignedVolunteerName: 'Jane Smith',
        assignedVolunteerId: 2,
        cancelReason: status === 'cancelled' ? 'Service no longer required' : undefined
      },
      {
        id: 3,
        title: 'Technology Help for Seniors',
        description: 'Need assistance teaching basic computer skills to seniors.',
        status: status === 'completed' ? 'completed' : status === 'inProgress' ? 'inProgress' : 'cancelled',
        requesterName: 'Sarah Wilson',
        requesterEmail: 'sarah@example.com',
        createdAt: '2025-05-03T13:20:00',
        updatedAt: '2025-05-04T10:10:00',
        assignedVolunteerName: 'Robert Johnson',
        assignedVolunteerId: 3,
        cancelReason: status === 'cancelled' ? 'Scheduling conflict' : undefined
      }
    ];
    
    return demoRequests;
  }
};

export default serviceRequestService; 