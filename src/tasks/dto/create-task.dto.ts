import { IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsOptional()
  description?: string;
}

