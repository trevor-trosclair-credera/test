import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const register = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => apiClient.post('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  apiClient.post('/auth/login', data);

// ─── Products ─────────────────────────────────────────────────────────────────
export const getProducts = (params?: { category?: string; search?: string }) =>
  apiClient.get('/products', { params });

export const getProduct = (id: number) => apiClient.get(`/products/${id}`);

// ─── Cart ──────────────────────────────────────────────────────────────────────
export const getCart = () => apiClient.get('/cart');

export const addToCart = (productId: number, quantity: number) =>
  apiClient.post('/cart/items', { productId, quantity });

export const updateCartItem = (itemId: number, quantity: number) =>
  apiClient.put(`/cart/items/${itemId}?quantity=${quantity}`);

export const removeCartItem = (itemId: number) =>
  apiClient.delete(`/cart/items/${itemId}`);

export const clearCart = () => apiClient.delete('/cart');

// ─── Orders ────────────────────────────────────────────────────────────────────
export const getOrders = () => apiClient.get('/orders');

export const getOrder = (id: number) => apiClient.get(`/orders/${id}`);

export const createOrder = (shippingAddress: string) =>
  apiClient.post('/orders', { shippingAddress });

export default apiClient;
