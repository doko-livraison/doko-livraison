import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

// Missions
export const missionsAPI = {
  create: (data: any) => api.post('/missions', data),
  getAll: () => api.get('/missions'),
  getPending: () => api.get('/missions/pending'),
  getMy: () => api.get('/missions/my'),
  getTransporterMissions: () => api.get('/missions/transporter'),
  getOne: (id: string) => api.get(`/missions/${id}`),
  accept: (id: string) => api.patch(`/missions/${id}/accept`),
  submitProof: (id: string, data: any) => api.patch(`/missions/${id}/proof`, data),
  validate: (id: string) => api.patch(`/missions/${id}/validate`),
  cancel: (id: string) => api.patch(`/missions/${id}/cancel`),
};

// Transporteurs
export const transportersAPI = {
  createProfile: (data: any) => api.post('/transporters/profile', data),
  getAll: () => api.get('/transporters'),
  getMe: () => api.get('/transporters/me'),
  getOne: (id: string) => api.get(`/transporters/${id}`),
  updateAvailability: (isAvailable: boolean) =>
    api.patch('/transporters/availability', { isAvailable }),
};

// Paiements
export const paymentsAPI = {
  createDeposit: (missionId: string, amount: number) =>
    api.post(`/payments/deposit/${missionId}`, { amount }),
  confirmDeposit: (missionId: string) =>
    api.post(`/payments/deposit/${missionId}/confirm`),
  releasePayment: (missionId: string) =>
    api.post(`/payments/release/${missionId}`),
};

export default api;
