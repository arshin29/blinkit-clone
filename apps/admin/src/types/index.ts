export type Role = 'CUSTOMER' | 'ADMIN' | 'RIDER';

export type OrderStatus =
  | 'PLACED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'MOCK_PAYMENT';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  mrp: number;
  unit: string;
  stock: number;
  image?: string | null;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName?: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  riderId?: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  total: number;
  totalAmount?: number;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email?: string;
    phone?: string | null;
  };
  rider?: {
    id: string;
    name: string;
    email?: string;
    phone?: string | null;
  } | null;
  items: OrderItem[];
}

export interface Rider {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  createdAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  mrp: number;
  unit: string;
  stock: number;
  image?: string;
  categoryId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  mrp?: number;
  unit?: string;
  stock?: number;
  image?: string;
  categoryId?: string;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  image?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  image?: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface ApiError {
  message: string | string[];
  error?: string;
  statusCode?: number;
}
