import { TodoEntity } from 'src/todo/entity/todo.entity';

export const todos: TodoEntity[] = [
  {
    id: '9104c0ef-d6af-47ef-9bbd-7b71ab0e4e26',
    name: 'House chores',
    tasks: [
      {
        id: '0166fa6b-22f1-4bac-b715-6e878cdece90',
        name: 'Buy groceries',
      },
      {
        id: '5ec85af9-ecf2-4a39-b772-5c8df018967c',
        name: 'Wash dishes',
      },
    ],
  },
  {
    id: 'f794689b-a9e2-4404-8aa4-34192f6b8003',
    name: 'Office Chores',
    tasks: [
      {
        id: '098fd1ea-ecb0-4693-9128-8e2a5b96eeb4',
        name: 'Shred the outdated documents',
      },
      {
        id: 'afc3f140-c4e0-4770-a014-095de6a9fb4f',
        name: 'Archive the old files',
      },
    ],
  },
  {
    id: 'fd097652-1cfa-4c98-bff8-d85efc43b007',
    name: 'Traveling Todo  list',
  },
  {
    id: 'd9e6d085-6602-43e0-a4f6-2a0c1363d4bc',
    name: 'Studying Todo list',
  },
  {
    id: '45123a60-ae65-4911-8ee3-d5a2e7b4a87d',
    name: 'Monday Todo list',
  },
  {
    id: '8d1a2250-b4bf-4c91-8ad7-7c973b65962f',
    name: 'Some random Todo list',
    description: 'A new awesome and cool todo list',
  },
];
