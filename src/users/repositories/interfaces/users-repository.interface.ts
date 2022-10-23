import { SignupDto } from '../../../auth/dto/signup.dto';
import { UserEntity } from '../../entities/user.entity';

export interface IUsersRepository {
  findByUsername(username: string): Promise<UserEntity | undefined>;
  create(data: SignupDto): Promise<UserEntity>;
}
