import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from '../entity/todo.entity';
import { TaskEntity } from '../entity/task.entity';
import { TaskService } from './task.service';
import {
  mockTaskRepository,
  mockTodoRepository,
  testTodos,
} from '../test-artifacts/repositories/mocks';
import { HttpException, HttpStatus } from '@nestjs/common';
import { todos } from '../mock/todos.mock';
import { CreateTaskDto } from '../dto/task.create.dto';

describe('TaskService', () => {
  let service: TaskService;
  const mockTaskService = {
    getTask: jest.fn(async (id: string): Promise<TaskEntity> => {
      const task = mockTaskRepository.findOne(id);
      if (!task) {
        throw new HttpException(`Task doesn't exist`, HttpStatus.BAD_REQUEST);
      }
      return task;
    }),
    getTasksByTodo: jest.fn(async (id: string): Promise<TaskEntity[]> => {
      const tasks = testTodos.filter((todo) => todo.id === id)[0].tasks;
      if (!tasks) {
        throw new HttpException(`Tasks doesn't exist`, HttpStatus.BAD_REQUEST);
      }
      return tasks;
    }),
    createTask: jest.fn(
      async (todoId: string, taskDto: CreateTaskDto): Promise<TaskEntity> => {
        const { name } = taskDto;
        const todo = await mockTodoRepository.findOne(todoId);
        const task: TaskEntity = await mockTaskRepository.create(
          todoId,
          taskDto,
        );
        await mockTaskRepository.save(task);
        return task;
      },
    ),
    destroyTask: jest.fn(async (id: string): Promise<TaskEntity> => {
      const task = mockTaskRepository.findOne(id);
      if (!task) {
        throw new HttpException(`Task doesn't exist`, HttpStatus.BAD_REQUEST);
        return Promise.reject('Task not found');
      }
      return Promise.resolve(task);
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: mockTodoRepository,
        },
        TaskService,
      ],
    })
      .overrideProvider(TaskService)
      .useValue(mockTaskService)
      .compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should find a task', async () => {
    const task = await service.getTask('12138-1egaze-1e1e1e-1e1e1e');
    expect(task).toBeDefined();
    expect(task.name).toBe('Task 1');
  });
  it('should return tasks by todo', async () => {
    const tasks = await service.getTasksByTodo('test-todo-id-1');
    expect(tasks).toBeDefined();
    expect(tasks[0].name).toBe('Task 1');
  });
  it('should create task', async () => {
    const task = await service.createTask('test-todo-id-3', { name: 'Task 3' });
    expect(task).toBeDefined();
    expect(task.name).toBe('Task 3');
  });
  it('should destroy task', async () => {
    const task = await service.destroyTask('12138-1egaze-1e1e1e-1e1e1e');
    expect(task).toBeDefined();
    expect(task.name).toBe('Task 1');
  });
});
