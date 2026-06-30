import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'argon2';
import { User, UserDocument } from './schemas/user.schema.js';
import { SafeUser } from '@/common/constants/safe-user.constant.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { OnboardingDto } from './dto/onboarding.dto.js';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(name: string, email: string, password: string): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException('Email already in use');
    const hashedPassword = await hash(password);
    return this.userModel.create({ name, email, password: hashedPassword });
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<SafeUser> {
    const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    return this.toSafeUser(user!);
  }

  async completeOnboarding(id: string, dto: OnboardingDto): Promise<SafeUser> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { ...dto, isOnboarded: true }, { new: true })
      .exec();
    return this.toSafeUser(user!);
  }

  toSafeUser(user: UserDocument): SafeUser {
    return {
      id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      university: user.university,
      courseOfStudy: user.courseOfStudy,
      yearOfStudy: user.yearOfStudy,
      goals: user.goals,
      isOnboarded: user.isOnboarded,
      createdAt: (user as any).createdAt,
    };
  }
}
