import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  getTask: jest.fn(),
  findOneBy: jest.fn(),
});

const mockUser = {
  id: '31337',
  username: 'James',
  password: 'secret',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  // let tasksRepository: TasksRepository;
  let tasksRepository;

  beforeEach(async () => {
    // Init NestJS Module with tasksService and tasksRepository.
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks() and returns the results', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const results = await tasksService.getTasks(null, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(results).toEqual('someValue');
    });
  });

  describe('getTask', () => {
    it('calls TasksRepository.findOneBy() and returns the results', async () => {
      const mockTask = {
        id: '31337',
        title: 'Some title',
        description: 'Some description',
        status: TaskStatus.OPEN,
      };
      tasksRepository.findOneBy.mockResolvedValue(mockTask);
      const results = await tasksService.getTask('31337', mockUser);
      expect(results).toEqual(mockTask);
    });

    it('calls TasksRepository.findOneBy() and handles error', async () => {
      tasksRepository.findOneBy.mockResolvedValue(null);
      expect(tasksService.getTask('31337', mockUser)).rejects.toThrow(
        'Task with ID "31337" not found',
      );
    });
  });
});
