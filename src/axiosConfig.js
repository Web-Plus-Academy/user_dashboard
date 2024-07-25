import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // corns include
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
