import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './todo/entity/task.entity';
import { TodoEntity } from './todo/entity/todo.entity';
import { UserEntity } from './todo/entity/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    TodoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ghassen.zakraoui',
      password: 'ghassen.zakraoui',
      database: 'testDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([UserEntity, TodoEntity, TaskEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
