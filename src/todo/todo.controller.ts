import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodoListDto } from './dto/todo.list.dto';
import { TodoDto } from './dto/todo.dto';
import { CreateTodoDto } from './dto/todo.create.dto';
import { TodoService } from './todo.service';
import { UserDto } from './dto/user.dto';

@Controller('api/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll(@Req() req: any): Promise<TodoListDto> {
    const todos = await this.todoService.getAllTodo();
    return { todos };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TodoDto> {
    return await this.todoService.getOneTodo(id);
  }

  @Post()
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: any,
  ): Promise<TodoDto> {
    const { userId } = createTodoDto;

    return await this.todoService.createTodo(userId, createTodoDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() todoDto: TodoDto,
  ): Promise<TodoDto> {
    return await this.todoService.updateTodo(id, todoDto);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string): Promise<TodoDto> {
    return await this.todoService.destoryTodo(id);
  }
}
