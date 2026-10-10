export type Role = 'CUSTOMER' | 'ADMIN' | 'RIDER';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  createdAt?: string;
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
  deliveryTime?: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  subtotal: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export type OrderStatus =
  | 'PLACED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'MOCK_PAYMENT' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
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
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: User;
  rider?: User | null;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export interface CreateOrderInput {
  deliveryAddress?: string;
  paymentMethod?: PaymentMethod;
}
