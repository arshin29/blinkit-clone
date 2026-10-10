import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: { categoryId?: string; search?: string }) {
    const where: any = {};

    if (query?.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description || null,
        price: dto.price,
        mrp: dto.mrp,
        unit: dto.unit,
        stock: dto.stock !== undefined ? dto.stock : 20,
        image: dto.image || null,
        categoryId: dto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.mrp !== undefined && { mrp: dto.mrp }),
        ...(dto.unit && { unit: dto.unit }),
        ...(dto.stock !== undefined && { stock: dto.stock }),
        ...(dto.image !== undefined && { image: dto.image }),
        ...(dto.categoryId && { categoryId: dto.categoryId }),
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
