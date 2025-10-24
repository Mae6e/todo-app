import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IResponse } from '../interfaces/response.interface';
import { IPagination } from '../interfaces/pagination.interface';
import { FindTasksDto } from './dto/find-task.dto';
import { RESPONSE_MESSAGES } from '../constants/messages';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(
    userId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<IResponse> {
    const task = await this.taskModel.create({ ...createTaskDto, userId });

    return {
      success: true,
      message: RESPONSE_MESSAGES.TASK.CREATED,
      data: task,
    };
  }

  async findAll(
    userId: string,
    query: FindTasksDto,
  ): Promise<IResponse<IPagination<Task>>> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const filter: any = { userId };
    if (status) filter.status = status;

    // const tasks = await this.taskModel
    //   .find(filter)
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 })
    //   .exec();

    const matchStage: any = { userId };
    if (status) matchStage.status = status;

    const tasksAggregate = await this.taskModel.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          userId: 0,
          description: 0,
          __v: 0,
        },
      },
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    const items = tasksAggregate[0].items;
    const total = tasksAggregate[0].totalCount[0]?.count || 0;

    return {
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string): Promise<IResponse> {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException(RESPONSE_MESSAGES.TASK.NOT_FOUND);

    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    if (!task) throw new NotFoundException(RESPONSE_MESSAGES.TASK.NOT_FOUND);
    return { success: true, data: task };
  }

  async update(
    userId: string,
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<IResponse> {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException(RESPONSE_MESSAGES.TASK.NOT_FOUND);

    const task = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, updateTaskDto, { new: true })
      .exec();

    if (!task) throw new NotFoundException(RESPONSE_MESSAGES.TASK.NOT_FOUND);
    return {
      success: true,
      message: RESPONSE_MESSAGES.TASK.UPDATED,
      data: task,
    };
  }

  async remove(userId: string, id: string): Promise<IResponse> {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException(RESPONSE_MESSAGES.TASK.NOT_FOUND);

    const task = await this.taskModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
    if (!task) throw new NotFoundException(RESPONSE_MESSAGES.TASK.NOT_FOUND);

    return {
      success: true,
      message: RESPONSE_MESSAGES.TASK.DELETED,
    };
  }
}
