import { IsString } from 'class-validator';
import { errors } from '../auth.error';

export class SignupDto {
  @IsString({ message: errors.USERNAME_IS_STRING })
  username: string;
  @IsString({ message: errors.PASSWORD_IS_STRING })
  password: string;
}
