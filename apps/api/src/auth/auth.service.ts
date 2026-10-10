import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new ConflictException('An account with this email address already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Registration creates CUSTOMER accounts only
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: dto.name.trim(),
        phone: dto.phone?.trim() || null,
        role: Role.CUSTOMER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Automatically create empty cart for new customer
    await this.prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    const accessToken = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'Registration successful',
      accessToken,
      user,
    };
  }

  // Alias for backward compatibility if signup is called
  async signup(dto: RegisterDto) {
    return this.register(dto);
  }

  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.generateToken(user.id, user.email, user.role);

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      message: 'Login successful',
      accessToken,
      user: safeUser,
    };
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private generateToken(userId: string, email: string, role: string): string {
    return this.jwtService.sign({
      sub: userId,
      email,
      role,
    });
  }
}
