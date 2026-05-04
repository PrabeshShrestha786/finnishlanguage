import {
  Injectable, UnauthorizedException, ConflictException,
  BadRequestException, NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

interface RegisterDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  nativeLanguage?: string;
  finnishLevel?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) throw new ConflictException('Email already registered');

    const existingUsername = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (existingUsername) throw new ConflictException('Username already taken');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        username: dto.username.toLowerCase(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        passwordHash,
        nativeLanguage: (dto.nativeLanguage as any) || 'ENGLISH',
        finnishLevel: (dto.finnishLevel as any) || 'A1',
        subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
      },
      include: { subscription: true },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role);
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { subscription: true },
    });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    if (user.isBanned) throw new UnauthorizedException('Account suspended');

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role);
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('jwt.refreshSecret'),
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async googleLogin(googleUser: any) {
    let user = await this.prisma.user.findFirst({
      where: { OR: [{ googleId: googleUser.id }, { email: googleUser.email }] },
      include: { subscription: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          username: `user_${Date.now()}`,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          avatar: googleUser.photo,
          googleId: googleUser.id,
          isEmailVerified: true,
          subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
        },
        include: { subscription: true },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.id },
        include: { subscription: true },
      });
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        achievements: { include: { achievement: true }, take: 5 },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  private generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('jwt.refreshSecret'),
      expiresIn: this.config.get('jwt.refreshExpiresIn'),
    });
    return { accessToken, refreshToken, expiresIn: 900 };
  }
}
