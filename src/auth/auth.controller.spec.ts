import 'reflect-metadata';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from '../users/repositories/implementations/users.repository';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  describe('POST /auth/signup', () => {
    it('should be able to create a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ username: 'test user', password: 'test user' })
        .expect(201);
    });

    it('should not be able to create a user with username duplicated', async () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ username: 'test user', password: 'test user' })
        .expect(403);
    });
  });

  describe('POST /auth/signin', () => {
    it('should be able to login', async () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: 'test user', password: 'test user' })
        .expect(201);
    });

    it('should not be able to login with wrong password', async () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: 'test user', password: 'wrong password' })
        .expect(401);
    });

    it('should not be able to login a non-existent user', async () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: 'non-existent user', password: 'test user' })
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
