import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsString({ message: 'Product ID must be a string' })
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;

  @Type(() => Number)
  @IsInt({ message: 'Quantity must be an integer' })
  @IsPositive({ message: 'Quantity must be a positive integer' })
  @IsOptional()
  quantity?: number;
}

