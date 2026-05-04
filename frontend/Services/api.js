import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const MY_IP = '192.168.8.198'; 
const PORT = '5000';


export const API_BASE_URL = Platform.OS === 'web' 
  ? `http://localhost:5000/api` 
  : `http://192.168.8.198:5000/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;