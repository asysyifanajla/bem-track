import { API_BASE_URL } from './constants';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bem_track_token');
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const token = getAuthToken();

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function uploadFile(
  endpoint: string,
  formData: FormData
): Promise<{ url: string; filename: string }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: HTTP ${response.status}`);
  }

  return response.json();
}

// ─── Programs ────────────────────────────────────────────────────────────────
export const programsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<{ data: unknown[]; total: number; page: number }>(`/programs${query}`);
  },
  getById: (id: string) => apiRequest<unknown>(`/programs/${id}`),
  create: (data: unknown) => apiRequest<unknown>('/programs', { method: 'POST', body: data }),
  update: (id: string, data: unknown) => apiRequest<unknown>(`/programs/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest<void>(`/programs/${id}`, { method: 'DELETE' }),
  submitForReview: (id: string) => apiRequest<unknown>(`/programs/${id}/submit`, { method: 'POST' }),
};

// ─── Verifications ────────────────────────────────────────────────────────────
export const verificationsApi = {
  getPending: () => apiRequest<unknown[]>('/verifications/pending'),
  getById: (id: string) => apiRequest<unknown>(`/verifications/${id}`),
  decide: (id: string, data: { action: string; note: string }) =>
    apiRequest<unknown>(`/verifications/${id}/decide`, { method: 'POST', body: data }),
};

// ─── Finance ─────────────────────────────────────────────────────────────────
export const financeApi = {
  getSummary: () => apiRequest<unknown>('/finance/summary'),
  getTransactions: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<{ data: unknown[]; total: number }>(`/finance/transactions${query}`);
  },
  createTransaction: (data: unknown) =>
    apiRequest<unknown>('/finance/transactions', { method: 'POST', body: data }),
  getById: (id: string) => apiRequest<unknown>(`/finance/transactions/${id}`),
};

// ─── Documents / Archives ─────────────────────────────────────────────────────
export const archivesApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<{ data: unknown[]; total: number }>(`/archives${query}`);
  },
  getById: (id: string) => apiRequest<unknown>(`/archives/${id}`),
  upload: (formData: FormData) => uploadFile('/archives/upload', formData),
  delete: (id: string) => apiRequest<void>(`/archives/${id}`, { method: 'DELETE' }),
};

// ─── Vault ────────────────────────────────────────────────────────────────────
export const vaultApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<{ data: unknown[]; total: number }>(`/vault${query}`);
  },
  getById: (id: string) => apiRequest<unknown>(`/vault/${id}`),
  upload: (formData: FormData) => uploadFile('/vault/upload', formData),
  delete: (id: string) => apiRequest<void>(`/vault/${id}`, { method: 'DELETE' }),
};

// ─── Timeline ─────────────────────────────────────────────────────────────────
export const timelineApi = {
  getAll: () => apiRequest<unknown[]>('/timeline'),
  create: (data: unknown) => apiRequest<unknown>('/timeline', { method: 'POST', body: data }),
  update: (id: string, data: unknown) =>
    apiRequest<unknown>(`/timeline/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest<void>(`/timeline/${id}`, { method: 'DELETE' }),
};

// ─── Activity Logs ────────────────────────────────────────────────────────────
export const activityLogsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<{ data: unknown[]; total: number }>(`/activity-logs${query}`);
  },
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll: () => apiRequest<unknown[]>('/users'),
  getById: (id: string) => apiRequest<unknown>(`/users/${id}`),
  create: (data: unknown) => apiRequest<unknown>('/users', { method: 'POST', body: data }),
  update: (id: string, data: unknown) =>
    apiRequest<unknown>(`/users/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest<void>(`/users/${id}`, { method: 'DELETE' }),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ token: string; user: unknown }>('/auth/login', {
      method: 'POST',
      body: credentials,
    }),
  logout: () => apiRequest<void>('/auth/logout', { method: 'POST' }),
  me: () => apiRequest<unknown>('/auth/me'),
};
