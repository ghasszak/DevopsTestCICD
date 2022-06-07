/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/user.create.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import {
  mockUserRepository,
  testOwner,
} from './test-artifacts/repositories/mocks';
import { TodoService } from './todo.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserService = {
    findOne: jest.fn((options) => {
      return mockUserRepository.findOne(options.id);
    }),
    create: jest.fn(
      async (userDto: CreateUserDto): Promise<UserEntity> =>
        mockUserRepository.create(userDto),
    ),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('user creation unit test', async () => {
    const user = await service.create({
      username: 'ghassen.zakraoui',
      email: 'ghassen.zakraoui@gmail.com',
      password: '123456',
    });
    expect(user).toBeDefined();
    expect(user.username).toBe('ghassen.zakraoui');
    expect(user.email).toBe('ghassen.zakraoui@gmail.com');
  });
  it('user find one unit test', async () => {
    const user = await service.findOne({ id: testOwner.id });
    expect(user).toBeDefined();
    expect(user).toMatchObject(testOwner);

    service
      .findOne({ id: '123' })
      .catch((e) => expect(e).toEqual('User not found'));
  });
});
