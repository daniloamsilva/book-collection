import { SignupDto } from '../../../auth/dto/signup.dto';
import { UserEntity } from '../../entities/user.entity';

export interface IUsersRepository {
  findById(id: string): Promise<UserEntity | undefined>;
  findByUsername(id: string): Promise<UserEntity | undefined>;
  create(data: SignupDto): Promise<UserEntity>;
}
