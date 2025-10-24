import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../common/guards/auth.guards';
import { IResponse } from '../interfaces/response.interface';
import {
  CurrentUser,
  UserDecorator as User,
} from 'src/common/decorators/user.decorators';
import { FindTasksDto } from './dto/find-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<IResponse> {
    return this.taskService.create(user.id, createTaskDto);
  }

  @Get()
  findAll(
    @CurrentUser() user,
    @Query(new ValidationPipe({ transform: true })) query: FindTasksDto,
  ): Promise<IResponse> {
    return this.taskService.findAll(user.id, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user, @Param('id') id: string): Promise<IResponse> {
    return this.taskService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<IResponse> {
    return this.taskService.update(user.id, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user, @Param('id') id: string): Promise<IResponse> {
    return this.taskService.remove(user.id, id);
  }
}
