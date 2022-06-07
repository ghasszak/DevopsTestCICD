import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import {
  mockTaskRepository,
  mockTodoRepository,
} from '../test-artifacts/repositories/mocks';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskEntity } from '../entity/task.entity';
import { TodoEntity } from '../entity/todo.entity';
describe('Task Controller', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: mockTodoRepository,
        },
      ],
      controllers: [TaskController],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
