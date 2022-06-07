import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';
import { UserEntity } from './entity/user.entity';
import {
  mockTodoRepository,
  mockUserRepository,
} from './test-artifacts/repositories/mocks';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { UsersService } from './users.service';

describe('Todo Controller', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: mockTodoRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        TodoService,
        UsersService,
      ],
      controllers: [TodoController],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
