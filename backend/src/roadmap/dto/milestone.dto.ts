import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  opportunityId?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class UpdateMilestoneDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['pending', 'in_progress', 'done'])
  @IsOptional()
  status?: 'pending' | 'in_progress' | 'done';

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
