import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
  @Type(() => Number)
  @IsInt({ message: 'Quantity must be an integer' })
  @IsPositive({ message: 'Quantity must be a positive integer' })
  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;
}

