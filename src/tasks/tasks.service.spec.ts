import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const userId = 'user-123';
      const mockTask = { id: 'task-123', ...createTaskDto, userId };

      mockRepository.create.mockReturnValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, userId);

      expect(result).toEqual(mockTask);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        userId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('findAll', () => {
    it('should list tasks with pagination', async () => {
      const userId = 'user-123';
      const paginationDto = { page: 1, limit: 10 };
      const mockTasks = [
        { id: 'task-1', title: 'Task 1', userId },
        { id: 'task-2', title: 'Task 2', userId },
      ];

      mockRepository.findAndCount.mockResolvedValue([mockTasks, 2]);

      const result = await service.findAll(userId, paginationDto);

      expect(result.data).toEqual(mockTasks);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const mockTask = { id: taskId, title: 'Task', userId };

      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(taskId, userId);

      expect(result).toEqual(mockTask);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
    });

    it('should throw error when task not found', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const updateTaskDto = { title: 'Updated Task', status: 'completed' };
      const existingTask = { id: taskId, title: 'Task', userId, status: 'pending' };
      const updatedTask = { ...existingTask, ...updateTaskDto };

      mockRepository.findOne.mockResolvedValue(existingTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateTaskDto, userId);

      expect(result.title).toBe('Updated Task');
      expect(result.status).toBe('completed');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const taskId = 'task-123';
      const userId = 'user-123';
      const mockTask = { id: taskId, title: 'Task', userId };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.remove.mockResolvedValue(mockTask);

      await service.remove(taskId, userId);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockTask);
    });
  });
});
