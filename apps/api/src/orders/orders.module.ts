import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { AdminOrdersController } from './admin-orders.controller';
import { RiderOrdersController } from './rider-orders.controller';
import { OrdersService } from './orders.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController, AdminOrdersController, RiderOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
