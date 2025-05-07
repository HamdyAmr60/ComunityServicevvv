import axios from 'axios';

// API base URL - replace with your actual API URL
const API_URL = 'http://localhost:5000/api/auth';

// Create authentication service for JWT handling
export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        nationalId: userData.nationalId,
        city: userData.city,
        phoneNumber: userData.phoneNumber,
        role: userData.role
      });
      
      return {
        success: true,
        message: response.data
      };
    } catch (error) {
      if (error.response) {
        // Handle validation errors from the API
        const errors = error.response.data.errors || [];
        return {
          success: false,
          errors: errors.map(err => err.description || err.message)
        };
      }
      return {
        success: false,
        errors: ['An unexpected error occurred during registration.']
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.token) {
        // Store the token and user data
        localStorage.setItem('cc_token', response.data.token);
        
        // Decode the token to get user info
        const tokenData = JSON.parse(atob(response.data.token.split('.')[1]));
        const userData = {
          id: tokenData.sub,
          email: tokenData.email,
          name: tokenData.name,
          roles: tokenData.roles || []
        };
        localStorage.setItem('cc_user', JSON.stringify(userData));
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          errors: [error.response.data || 'Invalid credentials.']
        };
      }
      return {
        success: false,
        errors: ['An unexpected error occurred during login.']
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('cc_user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('cc_token');
  },

  // Get JWT token
  getToken: () => {
    return localStorage.getItem('cc_token');
  },

  // Check if user has specific role
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.roles?.includes(role) || false;
  },

  // Set up axios interceptor for JWT
  setupAxiosInterceptors: () => {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('cc_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle 401 responses (unauthorized)
    axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          authService.logout();
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    );
  }
};

// Initialize interceptors when imported
authService.setupAxiosInterceptors();

export default authService;
