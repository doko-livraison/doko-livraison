import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'transporter' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.multiGet(['token', 'user']).then(([tokenItem, userItem]) => {
      if (tokenItem[1]) setToken(tokenItem[1]);
      if (userItem[1]) setUser(JSON.parse(userItem[1]));
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const { user, token } = res.data;
    await AsyncStorage.multiSet([['token', token], ['user', JSON.stringify(user)]]);
    setUser(user);
    setToken(token);
  };

  const register = async (data: any) => {
    const res = await authAPI.register(data);
    const { user, token } = res.data;
    await AsyncStorage.multiSet([['token', token], ['user', JSON.stringify(user)]]);
    setUser(user);
    setToken(token);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
