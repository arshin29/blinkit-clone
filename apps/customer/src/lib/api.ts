import type {
  AuthResponse,
  Cart,
  Category,
  CreateOrderInput,
  LoginInput,
  Order,
  Product,
  RegisterInput,
  User,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const TOKEN_KEY = 'blinkit_customer_token';
const USER_KEY = 'blinkit_customer_user';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

type UnauthorizedHandler = () => void;
let onUnauthorizedCallback: UnauthorizedHandler | null = null;

export const setOnUnauthorized = (cb: UnauthorizedHandler) => {
  onUnauthorizedCallback = cb;
};

export class ApiError extends Error {
  statusCode?: number;
  details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new ApiError(
      'Network error. Please check if the server is running.',
      undefined,
      err,
    );
  }

  // Parse response
  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (response.status === 401) {
    const isAuthRoute = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
    if (!isAuthRoute) {
      tokenStorage.remove();
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }

    let errorMessage = isAuthRoute
      ? 'Invalid email or password. Please try again.'
      : 'Session expired or unauthorized. Please log in again.';

    if (data && typeof data === 'object') {
      if (typeof data.message === 'string') {
        errorMessage = data.message;
      } else if (Array.isArray(data.message) && data.message.length > 0) {
        errorMessage = data.message.join(', ');
      }
    }
    throw new ApiError(errorMessage, 401, data);
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    if (data && typeof data === 'object') {
      if (typeof data.message === 'string') {
        errorMessage = data.message;
      } else if (Array.isArray(data.message) && data.message.length > 0) {
        errorMessage = data.message.join(', ');
      } else if (data.error) {
        errorMessage = data.error;
      }
    }
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const api = {
  auth: {
    login: (credentials: LoginInput) =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData: RegisterInput) =>
      request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    getProfile: () => request<User>('/auth/me'),
  },

  categories: {
    getAll: () => request<Category[]>('/categories'),
    getById: (id: string) => request<Category>(`/categories/${id}`),
  },

  products: {
    getAll: (params?: { categoryId?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
      if (params?.search && params.search.trim()) searchParams.append('search', params.search.trim());
      const query = searchParams.toString();
      return request<Product[]>(`/products${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => request<Product>(`/products/${id}`),
  },

  cart: {
    get: () => request<Cart>('/cart'),
    addItem: (productId: string, quantity: number = 1) =>
      request<Cart>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      }),
    updateQuantity: (productId: string, quantity: number) =>
      request<Cart>(`/cart/items/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      }),
    removeItem: (productId: string) =>
      request<Cart>(`/cart/items/${productId}`, {
        method: 'DELETE',
      }),
    clear: () =>
      request<{ message: string }>('/cart', {
        method: 'DELETE',
      }),
  },

  orders: {
    create: (dto: CreateOrderInput = {}) =>
      request<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
    getAll: () => request<Order[]>('/orders'),
    getById: (id: string) => request<Order>(`/orders/${id}`),
  },
};
