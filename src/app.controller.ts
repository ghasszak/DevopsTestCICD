import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './todo/entity/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
