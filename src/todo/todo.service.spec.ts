import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/todo.create.dto';
import { TodoDto } from './dto/todo.dto';
import { UserDto } from './dto/user.dto';
import { TodoEntity } from './entity/todo.entity';
import { UserEntity } from './entity/user.entity';
import {
  mockTodoRepository,
  mockUserRepository,
} from './test-artifacts/repositories/mocks';
import { TodoService } from './todo.service';
import { UsersService } from './users.service';

describe('TodoService', () => {
  let service: TodoService;
  const mockTodoService = {
    getAllTodo: jest.fn(async () => mockTodoRepository.find()),
    getOneTodo: jest.fn(async (id: string) => {
      const todo = mockTodoRepository.findOne(id);
      if (!todo) {
        throw new HttpException(
          `Todo list doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return todo;
    }),
    createTodo: jest.fn(
      async (userId: string, createTodoDto: CreateTodoDto) => {
        const { name, description } = createTodoDto;
        const owner = await mockUserRepository.findOne(userId);
        const todo: TodoEntity = await mockTodoRepository.create(
          {
            name,
            description,
            owner,
          },
          createTodoDto,
        );
        await mockTodoRepository.save(todo);
        return todo;
      },
    ),
    updateTodo: jest.fn(
      async (id: string, todoDto: TodoDto): Promise<TodoEntity> => {
        const { name, description } = todoDto;
        const todo: TodoEntity = await mockTodoRepository.findOne(id);
        todo.name = name;
        todo.description = description;
        await mockTodoRepository.save(todo);
        return todo;
      },
    ),
    destroyTodo: jest.fn(async (id: string) => {
      const todo = await mockTodoRepository.findOne(id);
      if (!todo) {
        throw new HttpException(
          `Todo list doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      await mockTodoRepository.delete(id);
      return todo;
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: mockTodoRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        UsersService,
      ],
    })
      .overrideProvider(TodoService)
      .useValue(mockTodoService)
      .compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return all todos', async () => {
    const todos = await service.getAllTodo();
    expect(todos).toBeDefined();
    expect(todos).toBeInstanceOf(Array);
    expect(todos.length).toBeGreaterThanOrEqual(1);
  });
  it('should return one todo', async () => {
    const todo = await service.getOneTodo('test-todo-id-1');
    expect(todo).toBeDefined();
    expect(todo.name).toBe('test-todo-name-1');
  });
  it('should create a todo', async () => {
    const userdto: UserDto = {
      id: 'test-owner-id',
      username: 'test-owner-name',
      email: 'test-owner-email',
    };
    const createTodoDto: CreateTodoDto = {
      name: 'test-todo-name-1',
      description: 'test-todo-description-1',
      userId: userdto.id,
    };
    const todo = await service.createTodo('test-owner-id', createTodoDto);
    expect(todo).toBeDefined();
    expect(todo.name).toBe('test-todo-name-1');
  });
  it('should destroy a todo', async () => {
    const res = await service.destroyTodo('test-todo-id-1');
    expect(res).toBeDefined();
    expect(res).toBeTruthy();
  });
});
