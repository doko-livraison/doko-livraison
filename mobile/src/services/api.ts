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
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getMissions: () => api.get('/admin/missions'),
  getUsers: () => api.get('/admin/users'),
  suspendUser: (id: string) => api.patch(`/admin/users/${id}/suspend`),
  cancelMission: (id: string) => api.patch(`/admin/missions/${id}/cancel`),
};

// Push notifications
export const notificationsAPI = {
  registerToken: (pushToken: string) => api.post('/notifications/register-token', { pushToken }),
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

export const transporterAPI = transportersAPI;

// Messages
export const messagesAPI = {
  getByMission: (missionId: string) => api.get(`/messages/${missionId}`),
  send: (missionId: string, content: string) =>
    api.post(`/messages/${missionId}`, { content }),
};

// Avis / Reviews
export const reviewsAPI = {
  submit: (data: { missionId: string; transporterId: string; rating: number; comment?: string }) =>
    api.post('/reviews', data),
  getForTransporter: (transporterId: string) => api.get(`/reviews/transporter/${transporterId}`),
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
