import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Fazer o login' })
  @UseGuards(AuthGuard('local'))
  @Post('auth/signin')
  async login(@Body() signinDto: SigninDto) {
    return this.authService.login(signinDto);
  }

  @ApiOperation({ summary: 'Criar usuário' })
  @Post('auth/signup')
  async signup(@Body() signupDto: SignupDto) {
    await this.authService.signup(signupDto);
    return;
  }
}
