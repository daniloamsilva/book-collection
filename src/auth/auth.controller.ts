import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/signin')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
