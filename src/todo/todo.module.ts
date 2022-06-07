import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { TodoEntity } from './entity/todo.entity';
import { TaskEntity } from './entity/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity, TaskEntity, UserEntity])],
  controllers: [TodoController, TaskController],
  providers: [TodoService, TaskService, UsersService],
})
export class TodoModule {}
