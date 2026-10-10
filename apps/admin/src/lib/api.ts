import type {
  Category,
  CreateCategoryInput,
  CreateProductInput,
  LoginResponse,
  Order,
  OrderStatus,
  Product,
  Rider,
  UpdateCategoryInput,
  UpdateProductInput,
  User,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const TOKEN_KEY = 'blinkit_admin_token';
const USER_KEY = 'blinkit_admin_user';

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

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

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

  if (response.status === 401) {
    tokenStorage.remove();
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    throw new ApiError('Session expired or unauthorized. Please log in again.', 401);
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
  }

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    if (data?.message) {
      if (Array.isArray(data.message)) {
        errorMessage = data.message.join(', ');
      } else {
        errorMessage = String(data.message);
      }
    } else if (response.statusText) {
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }): Promise<LoginResponse> =>
      request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    me: (): Promise<User> => request<User>('/auth/me'),
  },

  products: {
    getAll: (params?: { categoryId?: string; search?: string }): Promise<Product[]> => {
      const searchParams = new URLSearchParams();
      if (params?.categoryId) searchParams.append('categoryId', params.categoryId);
      if (params?.search) searchParams.append('search', params.search);
      const query = searchParams.toString();
      return request<Product[]>(`/products${query ? `?${query}` : ''}`);
    },
    getById: (id: string): Promise<Product> => request<Product>(`/products/${id}`),
    create: (data: CreateProductInput): Promise<Product> =>
      request<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateProductInput): Promise<Product> =>
      request<Product>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      request<{ success: boolean; message: string }>(`/products/${id}`, {
        method: 'DELETE',
      }),
  },

  categories: {
    getAll: (): Promise<Category[]> => request<Category[]>('/categories'),
    getById: (id: string): Promise<Category> => request<Category>(`/categories/${id}`),
    create: (data: CreateCategoryInput): Promise<Category> =>
      request<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateCategoryInput): Promise<Category> =>
      request<Category>(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      request<{ success: boolean; message: string }>(`/categories/${id}`, {
        method: 'DELETE',
      }),
  },

  orders: {
    getAll: (status?: OrderStatus): Promise<Order[]> => {
      const query = status ? `?status=${status}` : '';
      return request<Order[]>(`/admin/orders${query}`);
    },
    getById: (id: string): Promise<Order> => request<Order>(`/admin/orders/${id}`),
    assignRider: (orderId: string, riderId: string): Promise<Order> =>
      request<Order>(`/admin/orders/${orderId}/assign-rider`, {
        method: 'PATCH',
        body: JSON.stringify({ riderId }),
      }),
    updateStatus: (orderId: string, status: OrderStatus): Promise<Order> =>
      request<Order>(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  users: {
    getRiders: (): Promise<Rider[]> => request<Rider[]>('/users/riders'),
  },

  cloudinary: {
    upload: async (
      file: File,
      folder?: string,
    ): Promise<{ success: boolean; secure_url: string; public_id: string; [key: string]: any }> => {
      const token = tokenStorage.get();
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/cloudinary/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMsg = 'Failed to upload image to Cloudinary';
        if (errorData?.message) {
          errorMsg = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : String(errorData.message);
        }
        throw new ApiError(errorMsg, response.status, errorData);
      }

      return response.json();
    },

    uploadUrl: async (
      url: string,
      folder?: string,
    ): Promise<{ success: boolean; secure_url: string; public_id: string; [key: string]: any }> => {
      return request('/cloudinary/upload-url', {
        method: 'POST',
        body: JSON.stringify({ url, folder }),
      });
    },
  },
};

