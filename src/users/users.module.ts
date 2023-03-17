import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from './repositories/implementations/users.repository';
import { IUsersRepository } from './repositories/interfaces/users-repository.interface';
import { UsersService } from './users.service';

@Module({
  exports: [UsersService],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: IUsersRepository,
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
