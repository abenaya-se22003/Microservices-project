import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically attach the JWT token (if present) to every outgoing request.
 */
api.interceptors.request.use(
  function (config) {
    var token = localStorage.getItem('hotelHub_token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * If any response comes back as 401 Unauthorized, clear the stored
 * token/user and redirect to the login page.
 */
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('hotelHub_token');
      localStorage.removeItem('hotelHub_user');

      // Only redirect if not already on the login or register page
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/signup')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
