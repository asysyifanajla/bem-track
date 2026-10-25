export type UserRole =
  | 'GUBERNUR'
  | 'SEKRETARIS_UMUM'
  | 'BENDAHARA_UMUM'
  | 'DEPARTEMEN_1'
  | 'DEPARTEMEN_2'
  | 'DEPARTEMEN_3'
  | 'DEPARTEMEN_4';

export const ROLE_LABELS: Record<UserRole, string> = {
  GUBERNUR: 'Gubernur BEM',
  SEKRETARIS_UMUM: 'Sekretaris Umum',
  BENDAHARA_UMUM: 'Bendahara Umum',
  DEPARTEMEN_1: 'Departemen Pelaksana I',
  DEPARTEMEN_2: 'Departemen Pelaksana II',
  DEPARTEMEN_3: 'Departemen Pelaksana III',
  DEPARTEMEN_4: 'Departemen Pelaksana IV',
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departemen?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
