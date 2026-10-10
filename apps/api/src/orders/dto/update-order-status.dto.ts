import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message:
      'Status must be PLACED, ASSIGNED, PICKED_UP, OUT_FOR_DELIVERY, DELIVERED, or CANCELLED',
  })
  @IsNotEmpty({ message: 'Status is required' })
  status: OrderStatus;
}
