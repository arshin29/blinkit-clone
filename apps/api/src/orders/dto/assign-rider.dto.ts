import { IsNotEmpty, IsString } from 'class-validator';

export class AssignRiderDto {
  @IsString()
  @IsNotEmpty({ message: 'riderId is required' })
  riderId: string;
}
