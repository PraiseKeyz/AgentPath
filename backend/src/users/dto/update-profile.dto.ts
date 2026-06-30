import { IsString, IsOptional, IsNumber, IsArray, Min, Max } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  university?: string;

  @IsString()
  @IsOptional()
  courseOfStudy?: string;

  @IsNumber()
  @Min(1)
  @Max(6)
  @IsOptional()
  yearOfStudy?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  goals?: string[];
}
