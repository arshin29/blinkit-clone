import type {
  AuthResponse,
  Order,
  OrderStatus,
  User,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const TOKEN_KEY = 'blinkit_rider_token';
const USER_KEY = 'blinkit_rider_user';

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
  } else {
    try {
      data = await response.text();
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

    if (response.status === 403) {
      errorMessage = data?.message || 'Access forbidden: You do not have permissions for this action.';
    } else if (response.status === 404) {
      errorMessage = data?.message || 'The requested resource was not found.';
    } else if (response.status === 400 && !data?.message) {
      errorMessage = 'Invalid request. Please check your inputs.';
    }

    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }): Promise<AuthResponse> =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    me: (): Promise<User> => request<User>('/auth/me'),
  },

  rider: {
    getOrders: (): Promise<Order[]> => request<Order[]>('/rider/orders'),
    getOrder: (id: string): Promise<Order> => request<Order>(`/rider/orders/${id}`),
    updateStatus: (id: string, status: OrderStatus): Promise<Order> =>
      request<Order>(`/rider/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
};
