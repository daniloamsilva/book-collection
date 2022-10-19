import { UserEntity } from '../../entities/user.entity';

export interface IUsersRepository {
  findOne(id: string): Promise<UserEntity>;
}
