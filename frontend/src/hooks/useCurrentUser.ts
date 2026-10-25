'use client';

import { useSyncExternalStore } from 'react';
import { DEMO_USERS } from '@/lib/mockData';
import { UserRole } from '@/types/auth';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  departemen?: string;
}

const defaultUser: StoredUser = DEMO_USERS[0] as unknown as StoredUser;

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('bem_track_user_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('bem_track_user_changed', callback);
  };
}

let cachedRaw: string | null = null;
let cachedUser: StoredUser = defaultUser;

function getSnapshot(): StoredUser {
  if (typeof window === 'undefined') return defaultUser;
  try {
    const raw = localStorage.getItem('bem_track_user');
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedUser = raw ? JSON.parse(raw) : defaultUser;
    }
  } catch {
    cachedUser = defaultUser;
  }
  return cachedUser;
}

function getServerSnapshot(): StoredUser {
  return defaultUser;
}

export function useCurrentUser(): StoredUser {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
