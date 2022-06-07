import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TodoService } from '../src/todo/todo.service';
import { UsersService } from '../src/todo/users.service';
import { UserDto } from '../src/todo/dto/user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const owner = {
    username: 'ghassen.zakraoui',
    email: 'ghassen.zakraoui@gmail.com',
  };
  let dbOwner: UserDto;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbOwner = await app
      .get<UsersService>(UsersService)
      .findOne({ username: owner.username });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  it('/api/todos (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/todos')
      .expect(200)
      .expect({ todos: await app.get(TodoService).getAllTodo() });
  });
  it('/api/todos/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/todos/fd097652-1cfa-4c98-bff8-d85efc43b007')
      .expect(200)
      .then((resp) => {
        const payload = resp.body;
        delete payload.owner.id;
        expect({
          id: 'fd097652-1cfa-4c98-bff8-d85efc43b007',
          name: 'Traveling Todo  list',
          description: null,
          owner: dbOwner,
          tasks: [],
        });
      });
  });
  it('/api/todos (POST)', async () => {
    return request(app.getHttpServer())
      .post('/api/todos')
      .send({
        name: 'Newly Posted todo for Test purpose',
        description: 'Random description',
        userId: dbOwner.id,
      })
      .expect(201)
      .then((response) => {
        const payload = response.body;
        delete payload.id;
        expect(payload).toStrictEqual({
          name: 'Newly Posted todo for Test purpose',
          description: 'Random description',
          owner: dbOwner,
        });
      });
  });
  it('/api/todos (PUT)', async () => {
    return request(app.getHttpServer())
      .put('/api/todos/fd097652-1cfa-4c98-bff8-d85efc43b007')
      .send({
        name: 'Edited Name',
        description: 'Edited description of the Office Chores',
        userId: dbOwner.id,
      })
      .expect(200)
      .then((resp) => {
        const payload = resp.body;
        expect({
          id: 'fd097652-1cfa-4c98-bff8-d85efc43b007',
          name: 'Edited Name',
          description: 'Edited description of the Office Chores',
          owner: dbOwner,
          tasks: [],
        }).toStrictEqual(payload);
      });
  });
  afterAll(async () => {
    await app.close();
  });
});
