import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../src/tasks/tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../../src/tasks/entities/task.entity';
import { Repository, ObjectLiteral } from 'typeorm';

type MockRepo<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn()
});

describe('TasksService', () => {
  let service: TasksService;
  let repo: MockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: createMockRepo() }
      ]
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call repo.create and repo.save', async () => {
    repo.create!.mockReturnValue({ title: 't', user: { id: 1 } });
    repo.save!.mockResolvedValue({ id: 1, title: 't' });

    const res = await service.create({ title: 't' } as any, 1);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(res).toEqual({ id: 1, title: 't' });
  });

  it('findAll should return pagination structure', async () => {
    repo.findAndCount!.mockResolvedValue([[], 0]);
    const res = await service.findAll(1, 1, 10);
    expect(repo.findAndCount).toHaveBeenCalled();
    expect(res).toHaveProperty('data');
    expect(res).toHaveProperty('meta');
  });
});
