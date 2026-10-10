import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CUSTOMER)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @HttpCode(HttpStatus.OK)
  async addItem(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(req.user.id, dto);
  }

  @Patch('items/:productId')
  async updateQuantity(
    @Req() req: any,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(req.user.id, productId, dto);
  }

  @Delete('items/:productId')
  async removeItem(
    @Req() req: any,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  @Delete()
  async clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}

