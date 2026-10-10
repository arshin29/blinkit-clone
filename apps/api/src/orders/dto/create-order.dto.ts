import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @IsEnum(PaymentMethod, { message: 'Payment method must be COD or MOCK_PAYMENT' })
  @IsOptional()
  paymentMethod?: PaymentMethod;
}
