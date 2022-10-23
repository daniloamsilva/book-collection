import { Injectable, Inject } from '@nestjs/common';
import { IUsersRepository } from './repositories/interfaces/users-repository.interface';

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository') private usersRepository: IUsersRepository,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findByUsername(username);
  }
}
