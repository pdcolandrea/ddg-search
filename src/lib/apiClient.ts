import axios from 'axios';

export const wAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
