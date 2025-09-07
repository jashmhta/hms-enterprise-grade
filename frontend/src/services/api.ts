import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
baseURL: API_BASE,
headers: {
'Content-Type': 'application/json',
},
});

// Request interceptor to add auth token
api.interceptors.request.use(
(config) => {
const token = localStorage.getItem('access_token');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
},
(error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
(response) => response,
async (error) => {
if (error.response?.status === 401) {
// Handle token refresh here
}
return Promise.reject(error);
}
);

export default api;
