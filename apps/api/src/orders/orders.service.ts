import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentMethod, Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private formatOrder(order: any) {
    const total = order.totalAmount;
    const items = (order.items || []).map((item: any) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      productName: item.productName || item.product?.name || 'Product',
      price: item.price,
      quantity: item.quantity,
      subtotal: Math.round(item.price * item.quantity * 100) / 100,
      createdAt: item.createdAt,
      product: item.product,
    }));

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      riderId: order.riderId,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      total,
      totalAmount: total,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items,
      customer: order.customer,
      rider: order.rider,
    };
  }

  validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
    role: Role,
  ) {
    if (currentStatus === newStatus) {
      return;
    }

    if (role === Role.RIDER) {
      const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.ASSIGNED]: [OrderStatus.PICKED_UP],
        [OrderStatus.PICKED_UP]: [OrderStatus.OUT_FOR_DELIVERY],
        [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
        [OrderStatus.PLACED]: [],
        [OrderStatus.DELIVERED]: [],
        [OrderStatus.CANCELLED]: [],
      };

      const allowed = allowedTransitions[currentStatus] || [];
      if (!allowed.includes(newStatus)) {
        throw new BadRequestException(
          `Invalid rider status transition from ${currentStatus} to ${newStatus}. Next allowed status: ${allowed.join(', ') || 'None'}`,
        );
      }
    } else if (role === Role.ADMIN) {
      if (currentStatus === OrderStatus.DELIVERED) {
        throw new BadRequestException(
          `Cannot change status of an order that is already DELIVERED`,
        );
      }
      if (currentStatus === OrderStatus.CANCELLED) {
        throw new BadRequestException(
          `Cannot change status of an order that is already CANCELLED`,
        );
      }

      if (newStatus === OrderStatus.CANCELLED) {
        const cancellable = [
          OrderStatus.PLACED,
          OrderStatus.ASSIGNED,
          OrderStatus.PICKED_UP,
          OrderStatus.OUT_FOR_DELIVERY,
        ];
        if (!cancellable.includes(currentStatus)) {
          throw new BadRequestException(
            `Cannot cancel order from status ${currentStatus}`,
          );
        }
        return;
      }

      const flowOrder: OrderStatus[] = [
        OrderStatus.PLACED,
        OrderStatus.ASSIGNED,
        OrderStatus.PICKED_UP,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED,
      ];

      const currentIndex = flowOrder.indexOf(currentStatus);
      const newIndex = flowOrder.indexOf(newStatus);

      if (newIndex < 0 || newIndex <= currentIndex) {
        throw new BadRequestException(
          `Invalid admin status transition from ${currentStatus} to ${newStatus}. Backward transitions are not allowed.`,
        );
      }
    }
  }

  async createOrder(customerId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId: customerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty. Add products before placing an order.');
    }

    // Validate all products exist and have sufficient stock
    for (const item of cart.items) {
      if (!item.product) {
        throw new BadRequestException(`Product in cart no longer exists`);
      }
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}, in cart: ${item.quantity}`,
        );
      }
    }

    // Calculate total from cart items
    const total =
      Math.round(
        cart.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        ) * 100,
      ) / 100;

    const orderNumber = `BLK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const deliveryAddress = dto.deliveryAddress?.trim() || 'Default Delivery Address';
    const paymentMethod = dto.paymentMethod || PaymentMethod.COD;

    const order = await this.prisma.$transaction(async (tx) => {
      // Re-verify stock inside transaction to prevent race conditions
      for (const item of cart.items) {
        const freshProduct = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!freshProduct) {
          throw new BadRequestException(
            `Product with ID ${item.productId} no longer exists`,
          );
        }
        if (freshProduct.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${freshProduct.name}". Available: ${freshProduct.stock}, requested: ${item.quantity}`,
          );
        }
      }

      // 1. Create Order and OrderItems
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          status: OrderStatus.PLACED,
          paymentMethod,
          paymentStatus: 'PENDING',
          totalAmount: total,
          deliveryAddress,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: {
            select: { id: true, name: true, email: true, phone: true },
          },
          rider: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      });

      // 2. Decrement stock for each product
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // 3. Clear cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return this.formatOrder(order);
  }

  async getCustomerOrders(customerId: string) {
    const orders = await this.prisma.order.findMany({
      where: { customerId },
      include: {
        rider: {
          select: { id: true, name: true, phone: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatOrder(order));
  }

  async getCustomerOrder(customerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        rider: {
          select: { id: true, name: true, phone: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order || order.customerId !== customerId) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.formatOrder(order);
  }

  async getAllOrders(status?: OrderStatus) {
    const orders = await this.prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        rider: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatOrder(order));
  }

  async getAdminOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        rider: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.formatOrder(order);
  }

  async assignRider(orderId: string, riderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(
        `Cannot assign rider to an order that is already ${order.status}`,
      );
    }

    const rider = await this.prisma.user.findUnique({
      where: { id: riderId },
    });

    if (!rider) {
      throw new NotFoundException(`Rider with ID ${riderId} not found`);
    }

    if (rider.role !== Role.RIDER) {
      throw new BadRequestException('User must have RIDER role to be assigned to an order');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        riderId: rider.id,
        status: OrderStatus.ASSIGNED,
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        rider: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: { product: true },
        },
      },
    });

    return this.formatOrder(updatedOrder);
  }

  async updateAdminOrderStatus(orderId: string, newStatus: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    this.validateStatusTransition(order.status, newStatus, Role.ADMIN);

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        rider: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: { product: true },
        },
      },
    });

    return this.formatOrder(updatedOrder);
  }

  async getRiderOrders(riderId: string) {
    const orders = await this.prisma.order.findMany({
      where: { riderId },
      include: {
        customer: {
          select: { id: true, name: true, phone: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatOrder(order));
  }

  async getRiderOrder(riderId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: { id: true, name: true, phone: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order || order.riderId !== riderId) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.formatOrder(order);
  }

  async updateRiderOrderStatus(
    riderId: string,
    orderId: string,
    newStatus: OrderStatus,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.riderId !== riderId) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    this.validateStatusTransition(order.status, newStatus, Role.RIDER);

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        rider: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: { product: true },
        },
      },
    });

    return this.formatOrder(updatedOrder);
  }
}
