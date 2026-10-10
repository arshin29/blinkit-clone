import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a valid number' })
  @IsPositive({ message: 'Price must be greater than 0' })
  price: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'MRP must be a valid number' })
  @IsPositive({ message: 'MRP must be greater than 0' })
  mrp: number;

  @IsString()
  @IsNotEmpty({ message: 'Unit is required (e.g. 500 ml, 1 kg)' })
  unit: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: string;
}
