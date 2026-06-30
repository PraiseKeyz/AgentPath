import { IsString, IsNotEmpty, IsNumber, IsArray, Min, Max } from 'class-validator';

export class OnboardingDto {
  @IsString()
  @IsNotEmpty()
  university: string;

  @IsString()
  @IsNotEmpty()
  courseOfStudy: string;

  @IsNumber()
  @Min(1)
  @Max(6)
  yearOfStudy: number;

  @IsArray()
  @IsString({ each: true })
  goals: string[];
}
