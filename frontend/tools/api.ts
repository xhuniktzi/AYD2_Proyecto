import axios, { AxiosInstance } from 'axios';

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Interceptor de Axios para agregar el token JWT a cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener el token de localStorage o sessionStorage
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // Si hay un token, se agrega a los headers de Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);