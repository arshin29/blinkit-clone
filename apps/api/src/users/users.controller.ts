import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role);
  }

  @Roles(Role.ADMIN)
  @Get('riders')
  async findRiders() {
    return this.usersService.findRiders();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
