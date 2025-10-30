import { Controller, Get, Query, UseGuards, Req, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { PaginationDto } from './dto/pagination.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private service: TasksService) {}

  @Get()
  async list(@Query() q: PaginationDto, @GetUser() user: any) {
    const page = q.page || 1;
    const limit = q.limit || 10;
    return this.service.findAll(user.id, page, limit);
  }

  @Post()
  async create(@Body() dto: CreateTaskDto, @GetUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Get(':id')
  async get(@Param('id') id: string, @GetUser() user: any) {
    return this.service.findOne(Number(id), user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @GetUser() user: any) {
    return this.service.update(Number(id), dto, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: any) {
    return this.service.remove(Number(id), user.id);
  }
}


