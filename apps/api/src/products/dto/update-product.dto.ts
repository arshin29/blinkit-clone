import { IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  mrp?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
