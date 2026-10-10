import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CUSTOMER)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @CurrentUser('id') customerId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(customerId, dto);
  }

  @Get()
  async getOrders(@CurrentUser('id') customerId: string) {
    return this.ordersService.getCustomerOrders(customerId);
  }

  @Get(':id')
  async getOrder(
    @Param('id') id: string,
    @CurrentUser('id') customerId: string,
  ) {
    return this.ordersService.getCustomerOrder(customerId, id);
  }
}
