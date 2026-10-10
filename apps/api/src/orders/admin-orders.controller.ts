import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AssignRiderDto } from './dto/assign-rider.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrderStatus, Role } from '@prisma/client';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAllOrders(@Query('status') status?: OrderStatus) {
    return this.ordersService.getAllOrders(status);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getAdminOrder(id);
  }

  @Patch(':id/assign-rider')
  async assignRider(
    @Param('id') orderId: string,
    @Body() dto: AssignRiderDto,
  ) {
    return this.ordersService.assignRider(orderId, dto.riderId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateAdminOrderStatus(orderId, dto.status);
  }
}
