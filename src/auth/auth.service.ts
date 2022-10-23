import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUsersRepository } from '../users/repositories/interfaces/users-repository.interface';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { errors } from './auth.error';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('IUsersRepository') private usersRepository: IUsersRepository,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(body: any) {
    const user = await this.usersRepository.findByUsername(body.username);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup({ username, password }: SignupDto): Promise<UserEntity> {
    let user = await this.usersRepository.findByUsername(username);
    if (user) throw new ForbiddenException(errors.USERNAME_ALREADY_EXISTS);
    user = await this.usersRepository.create({ username, password });
    return user;
  }
}
