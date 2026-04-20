import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'http://localhost:3000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });
  }
  return socket;
};

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem('token');
  const s = getSocket();
  if (token) {
    s.auth = { token };
  }
  if (!s.connected) s.connect();
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};
