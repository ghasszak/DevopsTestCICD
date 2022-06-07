import { TaskDto } from '../dto/task.dto';
import { TodoEntity } from '../entity/todo.entity';
import { TodoDto } from '../dto/todo.dto';
import { TaskEntity } from '../entity/task.entity';
import { UserEntity } from '../entity/user.entity';
import { UserDto } from '../dto/user.dto';

export const toTodoDto = (data: TodoEntity): TodoDto => {
  const { id, name, description, tasks, owner } = data;

  let todoDto: TodoDto = {
    id,
    name,
    description,
    owner: owner ? toUserDto(owner) : null,
  };

  if (tasks) {
    todoDto = {
      ...todoDto,
      tasks: tasks.map((task: TaskEntity) => toTaskDto(task)),
    };
  }

  return todoDto;
};

export const toTaskDto = (data: TaskEntity): TaskDto => {
  const { id, name } = data;

  const taskDto: TaskDto = {
    id,
    name,
  };

  return taskDto;
};

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email } = data;

  const userDto: UserDto = {
    id,
    username,
    email,
  };

  return userDto;
};
