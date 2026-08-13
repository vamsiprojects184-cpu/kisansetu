'use client';

const API_BASE = '/api/backend';

// ============== TYPES ==============
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface LoginResponse {
  token: string;
  user: ApiUser;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  language: string;
  state: string;
  district: string;
  village: string;
  location: string;
  isOnboarded: boolean;
  joinedDate: string;
}

// ============== AUTH TOKEN ==============
let authToken: string | null = null;
let currentUser: ApiUser | null = null;

export function setToken(token: string | null) {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('krishiai_token', token);
    else localStorage.removeItem('krishiai_token');
  }
}

export function getToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('krishiai_token');
  }
  return authToken;
}

export function setUser(user: ApiUser | null) {
  currentUser = user;
  if (typeof window !== 'undefined') {
    if (user) localStorage.setItem('krishiai_user', JSON.stringify(user));
    else localStorage.removeItem('krishiai_user');
  }
}

export function getUser(): ApiUser | null {
  if (currentUser) return currentUser;
  if (typeof window !== 'undefined') {
    const s = localStorage.getItem('krishiai_user');
    if (s) { try { currentUser = JSON.parse(s); } catch { /* */ } }
  }
  return currentUser;
}

// ============== FETCH HELPER ==============
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API Error');
  return json.data as T;
}

// ============== AUTH ==============
export async function apiLogin(emailOrPhone: string, password: string) {
  const data = await apiFetch<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email_or_phone: emailOrPhone, password }) });
  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function apiRegister(input: { name: string; email: string; phone: string; password: string; role: string }) {
  const data = await apiFetch<any>('/auth/register', { method: 'POST', body: JSON.stringify(input) });
  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function apiGetProfile() { return apiFetch<ApiUser>('/auth/profile'); }

export async function apiVerifyToken() { try { return await apiFetch<{ userId: string; role: string; name: string }>('/auth/verify'); } catch { return null; } }

export function apiLogout() { setToken(null); setUser(null); }

// ============== FARMS ==============
export async function apiGetFarms() { return apiFetch<any[]>('/farms'); }
export async function apiGetFarm(id: string) { return apiFetch<any>(`/farms/${id}`); }
export async function apiCreateFarm(data: any) { return apiFetch('/farms', { method: 'POST', body: JSON.stringify(data) }); }

// ============== CROPS ==============
export async function apiGetCrops() { return apiFetch<any[]>('/crops'); }

// ============== PRODUCTS ==============
export async function apiGetProducts(params?: { category?: string; search?: string; sort?: string; limit?: number }) {
  const q = new URLSearchParams();
  if (params?.category) q.set('category', params.category);
  if (params?.search) q.set('search', params.search);
  if (params?.sort) q.set('sort', params.sort);
  if (params?.limit) q.set('limit', String(params.limit));
  const qs = q.toString();
  return apiFetch<any[]>(`/products${qs ? '?' + qs : ''}`);
}
export async function apiGetProduct(id: string) { return apiFetch<any>(`/products/${id}`); }

// ============== ORDERS ==============
export async function apiGetOrders() { return apiFetch<any[]>('/orders'); }
export async function apiCreateOrder(data: any) { return apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }); }

// ============== CART ==============
export async function apiGetCart() { return apiFetch<any[]>('/cart'); }
export async function apiAddToCart(productId: string, quantity: number) { return apiFetch('/cart', { method: 'POST', body: JSON.stringify({ product_id: productId, quantity }) }); }
export async function apiClearCart() { return apiFetch('/cart', { method: 'DELETE' }); }
export async function apiRemoveFromCart(id: string) { return apiFetch(`/cart/${id}`, { method: 'DELETE' }); }

// ============== MARKET ==============
export async function apiGetMarketPrices() { return apiFetch<any[]>('/market-prices'); }
export async function apiGetMarketPredictions() { return apiFetch<any>('/market-predictions'); }

// ============== COLLECTION CENTERS ==============
export async function apiGetCollectionCenters() { return apiFetch<any[]>('/collection-centers'); }
export async function apiGetCollectionCenter(id: string) { return apiFetch(`/collection-centers/${id}`); }

// ============== NOTIFICATIONS ==============
export async function apiGetNotifications() { return apiFetch<any[]>('/notifications'); }
export async function apiMarkNotificationRead(id: string) { return apiFetch(`/notifications/${id}`, { method: 'PUT' }); }

// ============== SOIL HEALTH ==============
export async function apiGetSoilHealth() { return apiFetch<any[]>('/soil-health'); }

// ============== DISEASE ==============
export async function apiGetDiseaseScans() { return apiFetch<any[]>('/disease-scans'); }
export async function apiCreateDiseaseScan(data: any) { return apiFetch('/disease-scans', { method: 'POST', body: JSON.stringify(data) }); }

// ============== CHAT ==============
export async function apiGetChatHistory() { return apiFetch<any[]>('/chat'); }
export async function apiSendChatMessage(content: string) { return apiFetch('/chat', { method: 'POST', body: JSON.stringify({ content, role: 'user' }) }); }

// ============== ADMIN ==============
export async function apiGetAdminStats() { return apiFetch<any>('/admin/stats'); }
export async function apiGetUsers() { return apiFetch<any[]>('/users'); }

// ============== QUALITY CHECKS ==============
export async function apiGetQualityChecks() { return apiFetch<any[]>('/quality-checks'); }
export async function apiCreateQualityCheck(data: any) { return apiFetch('/quality-checks', { method: 'POST', body: JSON.stringify(data) }); }

// ============== PAYOUTS ==============
export async function apiGetPayouts() { return apiFetch<any[]>('/payouts'); }

// ============== ACTIVITIES ==============
export async function apiGetActivities() { return apiFetch<any[]>('/activities'); }
export async function apiCreateActivity(data: any) { return apiFetch('/activities', { method: 'POST', body: JSON.stringify(data) }); }
