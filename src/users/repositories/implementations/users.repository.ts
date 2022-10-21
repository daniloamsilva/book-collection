import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common/decorators';
import { SignupDto } from '../../../auth/dto/signup.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserEntity } from '../../entities/user.entity';
import { IUsersRepository } from '../interfaces/users-repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create({ username, password }: SignupDto): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, 10),
      },
    });
    return user;
  }

  async findOne(username: string): Promise<UserEntity | undefined> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return user;
  }
}
