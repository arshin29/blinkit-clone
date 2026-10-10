import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('rider/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.RIDER)
export class RiderOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getRiderOrders(@CurrentUser('id') riderId: string) {
    return this.ordersService.getRiderOrders(riderId);
  }

  @Get(':id')
  async getRiderOrderById(
    @Param('id') id: string,
    @CurrentUser('id') riderId: string,
  ) {
    return this.ordersService.getRiderOrder(riderId, id);
  }

  @Patch(':id/status')
  async updateDeliveryStatus(
    @Param('id') orderId: string,
    @CurrentUser('id') riderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateRiderOrderStatus(riderId, orderId, dto.status);
  }
}
