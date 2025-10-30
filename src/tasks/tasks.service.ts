import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private repo: Repository<Task>
  ) {}

  async create(createDto: CreateTaskDto, userId: number): Promise<Task> {
    const task = this.repo.create({ ...createDto, user: { id: userId } as any });
    return this.repo.save(task);
  }

  async findAll(userId: number, page = 1, limit = 10) {
    const [data, total] = await this.repo.findAndCount({
      where: { user: { id: userId } as any },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.repo.findOne({
      where: { id, user: { id: userId } as any }
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, updateDto: UpdateTaskDto, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, updateDto);
    return this.repo.save(task);
  }

  async remove(id: number, userId: number) {
    const task = await this.findOne(id, userId);
    await this.repo.remove(task);
    return { message: 'Task deleted' };
  }
}


 