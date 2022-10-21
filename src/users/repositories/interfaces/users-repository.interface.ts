import { SignupDto } from '../../../auth/dto/signup.dto';
import { UserEntity } from '../../entities/user.entity';

export interface IUsersRepository {
  findOne(id: string): Promise<UserEntity>;
  create(data: SignupDto): Promise<UserEntity>;
}
