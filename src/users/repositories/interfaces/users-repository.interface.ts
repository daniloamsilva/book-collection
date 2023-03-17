import { SignupDto } from '../../../auth/dto/signup.dto';
import { UserEntity } from '../../entities/user.entity';

export abstract class IUsersRepository {
  abstract findByUsername(username: string): Promise<UserEntity | undefined>;
  abstract create(data: SignupDto): Promise<UserEntity>;
}
