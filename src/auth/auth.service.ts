import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUsersRepository } from '../users/repositories/interfaces/users-repository.interface';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';

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

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: SignupDto): Promise<boolean> {
    const user = this.usersRepository.create(signupDto);
    return !!user;
  }
}
