import * as bcrypt from 'bcrypt';
import { SignupDto } from '../../../auth/dto/signup.dto';
import { UserEntity } from '../../entities/user.entity';
import { IUsersRepository } from '../interfaces/users-repository.interface';

export class UsersRepository implements IUsersRepository {
  users: UserEntity[] = [];

  async findByUsername(username: string): Promise<UserEntity> {
    const user = this.users.find((u) => u.username === username);
    return user;
  }

  async create({ username, password }: SignupDto): Promise<UserEntity> {
    const user = new UserEntity();

    Object.assign(user, {
      username,
      password: await bcrypt.hash(password, 10),
    });

    this.users.push(user);
    return user;
  }
}
