import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify, hash } from 'argon2';
import { UsersService } from '@/users/users.service.js';
import type { SafeUser } from '@/common/constants/safe-user.constant.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto.name, dto.email, dto.password);
    const safeUser = this.usersService.toSafeUser(user);
    const accessToken = await this.jwtService.signAsync({ sub: safeUser.id });
    return { message: 'Registration successful', data: { user: safeUser, accessToken } };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await verify(user.password, dto.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const safeUser = this.usersService.toSafeUser(user);
    const accessToken = await this.jwtService.signAsync({ sub: safeUser.id });
    return { message: 'Login successful', data: { user: safeUser, accessToken } };
  }

  getMe(user: SafeUser) {
    return { message: 'Profile fetched', data: { user } };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    const currentValid = await verify(user.password, dto.currentPassword);
    if (!currentValid) throw new UnauthorizedException('Current password is incorrect');

    const hashedPassword = await hash(dto.newPassword);
    await this.usersService.updateProfile(userId, { } as any);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }
}
