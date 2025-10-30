import { IsOptional, MinLength, IsIn } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @MinLength(3)
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsIn(['pending', 'completed'])
  status?: 'pending' | 'completed';
}

