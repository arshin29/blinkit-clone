export type Role = 'CUSTOMER' | 'ADMIN' | 'RIDER';

export type OrderStatus =
  | 'PLACED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'MOCK_PAYMENT' | string;

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | string;

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
  createdAt: string;
  updatedAt?: string;
}

export interface Rider {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  createdAt: string;
}

export interface CustomerInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
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
  product?: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    mrp: number;
    unit: string;
    stock: number;
    image?: string | null;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  riderId?: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  total: number;
  totalAmount?: number;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: CustomerInfo;
  rider?: {
    id: string;
    name: string;
    email?: string;
    phone?: string | null;
  } | null;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
