/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateTaskDto } from '../../dto/task.create.dto';
import { CreateTodoDto } from '../../dto/todo.create.dto';
import { CreateUserDto } from '../../dto/user.create.dto';
import { UserDto } from '../../dto/user.dto';
import { TaskEntity } from '../../entity/task.entity';
import { TodoEntity } from '../../entity/todo.entity';
import { UserEntity } from '../../entity/user.entity';

export const testOwner: UserEntity = {
  id: 'test-owner-id',
  username: 'test-owner-name',
  email: 'test-owner-email',
  password: 'test-owner-password',
  hashPassword: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
};
export const testTasks: TaskEntity[] = [
  {
    id: '12138-1egaze-1e1e1e-1e1e1e',
    name: 'Task 1',
    createdOn: new Date(),
  },
  {
    id: 'e123f-1egaze-1e1e1e-1e1e1e',
    name: 'Task 2',
    createdOn: new Date(),
  },
];
export const testTodos: TodoEntity[] = [
  {
    id: 'test-todo-id-1',
    name: 'test-todo-name-1',
    description: 'test-todo-description-1',
    createdOn: new Date(),
    updatedOn: new Date(),
    owner: testOwner,
    tasks: [testTasks[0]],
  },
  {
    id: 'test-todo-id-2',
    name: 'test-todo-name-2',
    description: 'test-todo-description-2',
    createdOn: new Date(),
    updatedOn: new Date(),
    owner: testOwner,
    tasks: [testTasks[1]],
  },
];
export const mockTaskRepository = {
  find: jest.fn().mockImplementation(async (): Promise<TaskEntity[]> => {
    return Promise.resolve(testTasks);
  }),
  findOne: jest
    .fn()
    .mockImplementation(
      async (id: string): Promise<TaskEntity> =>
        testTasks.find((task) => task.id === id),
    ),
  create: jest
    .fn()
    .mockImplementation(
      (todoId: string, taskDto: CreateTaskDto): TaskEntity => {
        const task = new TaskEntity();
        const todo = mockTodoRepository.findOne(todoId);
        task.name = taskDto.name;
        task.id = 'some-random-id';
        task.todo = todo;
        return task;
      },
    ) as (todoId: string, taskDto: CreateTaskDto) => TaskEntity,
  save: jest.fn().mockImplementation((task: TaskEntity): TaskEntity => task),
  destroy: jest.fn().mockImplementation((task: TaskEntity) => true),
};
export const mockTodoRepository = {
  find: jest
    .fn()
    .mockImplementation(
      async (): Promise<TodoEntity[]> => Promise.resolve(testTodos),
    ),
  findOne: jest
    .fn()
    .mockImplementation(
      async (id: string): Promise<TodoEntity> =>
        Promise.resolve(testTodos.find((todo) => todo.id === id)),
    ),
  create: jest
    .fn()
    .mockImplementation(
      (userDto: UserDto, createTodoDto: CreateTodoDto): TodoEntity => {
        const todo = new TodoEntity();
        todo.name = createTodoDto.name;
        todo.id = 'some-random-id';
        todo.owner = testOwner;
        return todo;
      },
    ),
  save: jest.fn((todo: TodoEntity): TodoEntity => todo),
  delete: jest.fn((id: string) => Promise.resolve(true)),
};
export const mockUserRepository = {
  find: jest.fn(
    async (): Promise<UserEntity[]> => Promise.resolve([testOwner]),
  ),
  findOne: jest.fn(async (id: string): Promise<UserEntity> => {
    if (id == testOwner.id) {
      return Promise.resolve(testOwner);
    }
    return Promise.reject('User not found');
  }),
  create: jest.fn((userDto: CreateUserDto): UserEntity => {
    const user = new UserEntity();
    user.username = userDto.username;
    user.email = userDto.email;
    user.password = userDto.password;
    return user;
  }),
  save: jest.fn((user: UserEntity): UserEntity => user),
};
