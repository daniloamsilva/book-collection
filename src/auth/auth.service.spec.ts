import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/repositories/in-memory/users.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UserEntity } from '../users/entities/user.entity';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { errors } from './auth.error';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
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
        JwtStrategy,
        {
          provide: 'IUsersRepository',
          useClass: UsersRepository,
        },
      ],
    }).compile();

    authService = authModule.get<AuthService>(AuthService);
  });

  describe('Create a new user', () => {
    it('should be able to create a new user', async () => {
      const user = await authService.signup({
        username: 'user test',
        password: 'user test',
      });

      expect(user).toBeInstanceOf(UserEntity);
    });

    it('should not be able to create a user with username duplicated', async () => {
      await authService.signup({
        username: 'user test',
        password: 'user test',
      });

      await expect(
        authService.signup({
          username: 'user test',
          password: 'user test',
        }),
      ).rejects.toEqual(new ForbiddenException(errors.USERNAME_ALREADY_EXISTS));
    });
  });

  describe('Token generate', () => {
    it('should be able to generate a new JWT token', async () => {
      const response = await authService.login({
        username: 'user test',
        password: 'user test',
      });

      expect(response).toHaveProperty('access_token');
    });
  });

  describe('User validation', () => {
    it('should not be able to validate a non-existent user', async () => {
      const result = await authService.validateUser(
        'non-existent user',
        '1234',
      );

      expect(result).toBe(null);
    });
  });
});
