import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../users/repositories/implementations/users.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    PrismaService,
    JwtStrategy,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
