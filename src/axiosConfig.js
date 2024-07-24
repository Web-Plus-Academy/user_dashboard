import axios from 'axios';

const instance = axios.create({
  baseURL: "https://wpa-user-server.onrender.com",
  withCredentials: true, // corns include
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
