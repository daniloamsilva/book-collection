import { Injectable, Inject } from '@nestjs/common';
import { UsersRepository } from './repositories/implementations/users.repository';

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository') private usersRepository: UsersRepository,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findByUsername(username);
  }
}
