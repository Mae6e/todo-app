import { IsOptional, IsEnum, IsString } from 'class-validator';
import { TaskStatus } from './../../constants/enums';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
