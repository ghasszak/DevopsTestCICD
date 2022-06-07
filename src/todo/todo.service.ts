import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { TodoEntity } from './entity/todo.entity';
import { TodoDto } from './dto/todo.dto';
import { toTodoDto } from './mapper/mapper';
import { CreateTodoDto } from './dto/todo.create.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Injectable()
export class TodoService {
  [x: string]: any;
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
    private readonly usersService: UsersService,
  ) {}

  async getAllTodo(): Promise<TodoDto[]> {
    const todos = await this.todoRepo.find({ relations: ['tasks', 'owner'] });
    return todos.map((todo) => toTodoDto(todo));
  }

  async getOneTodo(id: string): Promise<TodoDto> {
    const todo = await this.todoRepo.findOne({
      where: { id },
      relations: ['tasks', 'owner'],
    });

    if (!todo) {
      throw new HttpException(
        `Todo list doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return toTodoDto(todo);
  }

  async createTodo(
    userId: string,
    createTodoDto: CreateTodoDto,
  ): Promise<TodoDto> {
    const { name, description } = createTodoDto;
    const { username } = await this.usersService.findOne({ id: userId });
    // get the user from db
    const owner = await this.usersService.findOne({ where: { username } });

    const todo: TodoEntity = await this.todoRepo.create({
      name,
      description,
      owner,
    });

    await this.todoRepo.save(todo);

    return toTodoDto(todo);
  }

  async updateTodo(id: string, todoDto: TodoDto): Promise<TodoDto> {
    const { name, description } = todoDto;

    let todo: TodoEntity = await this.todoRepo.findOne({ where: { id } });

    if (!todo) {
      throw new HttpException(
        `Todo list doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    todo = {
      id,
      name,
      description,
    };

    await this.todoRepo.update({ id }, todo); // update

    todo = await this.todoRepo.findOne({
      where: { id },
      relations: ['tasks', 'owner'],
    }); // re-query

    return toTodoDto(todo);
  }

  async destroyTodo(id: string): Promise<TodoDto> {
    const todo: TodoEntity = await this.todoRepo.findOne({
      where: { id },
      relations: ['tasks', 'owner'],
    });

    if (!todo) {
      throw new HttpException(
        `Todo list doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (todo.tasks && todo.tasks.length > 0) {
      throw new HttpException(
        `Cannot delete this Todo list, it has existing tasks`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.todoRepo.delete({ id }); // delete todo list

    return toTodoDto(todo);
  }
}
