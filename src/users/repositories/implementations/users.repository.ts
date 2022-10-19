import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserEntity } from '../../entities/user.entity';
import { IUsersRepository } from '../interfaces/users-repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string): Promise<UserEntity | undefined> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return user;
  }
}
