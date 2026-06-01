import { StorageService } from '@/shared/utils/StorageService';

export const fetchWithAuth = (url: string, options: RequestInit = {}) => {
  const token = StorageService.getItem('authToken');
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(url, { ...options, headers });
};