import { Controller, Get, Patch, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { OnboardingDto } from './dto/onboarding.dto.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { SafeUser } from '@/common/constants/safe-user.constant.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: SafeUser) {
    return { message: 'Profile fetched', data: { user } };
  }

  @Patch('profile')
  async updateProfile(@CurrentUser() user: SafeUser, @Body() dto: UpdateProfileDto) {
    const updated = await this.usersService.updateProfile(user.id, dto);
    return { message: 'Profile updated', data: { user: updated } };
  }

  @Post('onboarding')
  async completeOnboarding(@CurrentUser() user: SafeUser, @Body() dto: OnboardingDto) {
    const updated = await this.usersService.completeOnboarding(user.id, dto);
    return { message: 'Onboarding complete', data: { user: updated } };
  }
}
