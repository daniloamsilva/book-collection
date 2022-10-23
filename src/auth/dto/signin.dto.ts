import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { errors } from '../auth.error';

export class SigninDto {
  @IsString({ message: errors.USERNAME_IS_STRING })
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Joe Doe',
  })
  username: string;

  @IsString({ message: errors.PASSWORD_IS_STRING })
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha1234',
  })
  password: string;
}
