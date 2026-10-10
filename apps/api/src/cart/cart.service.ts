import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const fullCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const rawItems = fullCart?.items || [];
    const items = rawItems.map((item) => {
      const subtotal = Math.round(item.quantity * item.product.price * 100) / 100;
      return {
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          description: item.product.description,
          mrp: item.product.mrp,
          unit: item.product.unit,
          stock: item.product.stock,
          categoryId: item.product.categoryId,
        },
        subtotal,
      };
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: cart.id,
      items,
      totalItems,
      subtotal: Math.round(subtotal * 100) / 100,
    };
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const cart = await this.getOrCreateCart(userId);

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    const qtyToAdd = dto.quantity ?? 1;

    if (qtyToAdd <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    // Check if item already exists in customer's cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
    });

    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const newQty = currentQtyInCart + qtyToAdd;

    if (product.stock < newQty) {
      throw new BadRequestException(
        `Insufficient stock for ${product.name}. Only ${product.stock} available.`,
      );
    }

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: qtyToAdd,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    dto: UpdateCartItemDto,
  ) {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        OR: [
          { productId },
          { id: productId },
        ],
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Product with ID ${productId} not found in your cart`,
      );
    }

    if (dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    if (cartItem.product.stock < dto.quantity) {
      throw new BadRequestException(
        `Insufficient stock for ${cartItem.product.name}. Only ${cartItem.product.stock} available.`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: dto.quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        OR: [
          { productId },
          { id: productId },
        ],
      },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Product with ID ${productId} not found in your cart`,
      );
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getCart(userId);
  }
}

