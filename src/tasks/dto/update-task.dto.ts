import { IsOptional, IsString, MinLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Título actualizado', required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @ApiProperty({ example: 'Descripción actualizada', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'completed', enum: ['pending', 'completed'], required: false })
  @IsString()
  @IsOptional()
  @IsIn(['pending', 'completed'])
  status?: string;
}

