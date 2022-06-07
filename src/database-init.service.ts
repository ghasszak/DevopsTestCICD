import { Injectable, Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './todo/entity/user.entity';
import { todos } from './todo/mock/todos.mock';
import { TodoEntity } from './todo/entity/todo.entity';
import { TaskEntity } from './todo/entity/task.entity';
@Injectable()
export class DatabaseInitService {
  private logger: Logger;
  private userEntity: UserEntity;

  constructor(
    @InjectRepository(UserEntity) userRepo: Repository<UserEntity>,
    @InjectRepository(TodoEntity) todoRepo: Repository<TodoEntity>,
    @InjectRepository(TaskEntity) taskRepo: Repository<TaskEntity>,
  ) {
    this.logger = new Logger('DatabaseInitService');
    userRepo
      .findOne({ where: { username: 'ghassen.zakraoui' } })
      .then(async (user) => {
        if (!user) {
          this.userEntity = userRepo.create({
            username: 'ghassen.zakraoui',
            password: '@dF%^hGb03W~',
            email: 'ghassen.zakraoui@gmail.com',
          });
          await userRepo.save(this.userEntity);
        }
        todoRepo.find().then((queriedTodos) => {
          if (queriedTodos.length === 0) {
            this.logger.log('No todos found in db. Creating mock data...');
            todos.forEach(async (todo) => {
              const dbTodo = todoRepo.create({
                ...todo,
                owner: this.userEntity,
              });
              await todoRepo.save(dbTodo);
              if (todo.tasks) {
                const tasks = todo.tasks.reduce((acc, task) => {
                  const newTask = taskRepo.create({ ...task, todo: dbTodo });
                  acc.push(newTask);
                  return acc;
                }, []);
                todoRepo.merge(dbTodo, this.userEntity);
                await taskRepo.save(tasks);
              }
              this.logger.log(`Created todo: ${dbTodo.name}`);
            });
          } else {
            this.logger.log('Todos already exist in db');
          }
        });
      });
  }
}
