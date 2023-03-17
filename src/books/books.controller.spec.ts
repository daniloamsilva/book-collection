import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from './books.service';
import { BooksRepository } from './repositories/implementations/books.repository';
import { BooksController } from './books.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthController } from '../auth/auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { LocalStrategy } from '../auth/local.strategy';
import { UsersRepository } from '../users/repositories/implementations/users.repository';
import { IBooksRepository } from './repositories/interfaces/books-repository.interface';
import { IUsersRepository } from '../users/repositories/interfaces/users-repository.interface';

describe('BooksController', () => {
  let app: INestApplication;
  let primaryToken: string;
  let secondaryToken: string;

  beforeAll(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
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
          provide: IUsersRepository,
          useClass: UsersRepository,
        },
      ],
    }).compile();

    app = authModule.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: 'primary user', password: 'primary user' })
      .expect(201);

    let loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username: 'primary user', password: 'primary user' })
      .expect(201);

    primaryToken = loginResponse.body.access_token;

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: 'secondary user', password: 'secondary user' })
      .expect(201);

    loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username: 'secondary user', password: 'secondary user' })
      .expect(201);

    secondaryToken = loginResponse.body.access_token;

    const booksModule: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        PrismaService,
        JwtStrategy,
        {
          provide: IBooksRepository,
          useClass: BooksRepository,
        },
      ],
    }).compile();

    app = booksModule.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  describe('POST /books', () => {
    it('should be able to create a new book', () => {
      return request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ title: 'Book name', pages: 100 })
        .expect(201);
    });

    it('should not be able to create a book without a title', () => {
      return request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ pages: 100 })
        .expect(400);
    });

    it('should not be able to create a book with zero pages', () => {
      return request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ title: 'Book name', pages: 0 })
        .expect(418);
    });
  });

  describe('GET /books', () => {
    it('should be able to list all books', async () => {
      await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${secondaryToken}`)
        .send({ title: 'Book name', pages: 100 })
        .expect(201);

      return request(app.getHttpServer())
        .get('/books')
        .set('Authorization', `Bearer ${primaryToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body.length).toBe(1);
        });
    });
  });

  describe('GET /books/:id', () => {
    it('should be able to find a book', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ title: 'Book name', pages: 100 });

      const { id } = response.body;

      return request(app.getHttpServer())
        .get(`/books/${id}`)
        .set('Authorization', `Bearer ${primaryToken}`)
        .expect(200);
    });

    it('should not be able to find a non-existent book', () => {
      return request(app.getHttpServer())
        .get('/books/nonexistentbook')
        .set('Authorization', `Bearer ${primaryToken}`)
        .expect(404);
    });

    it('should not be able find a book that does not belong to the user', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${secondaryToken}`)
        .send({ title: 'Book name', pages: 100 });

      const { id } = response.body;

      return request(app.getHttpServer())
        .get(`/books/${id}`)
        .set('Authorization', `Bearer ${primaryToken}`)
        .expect(403);
    });
  });

  describe('PATCH /books/:id', () => {
    it('should be able to update a book', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ title: 'Book name', pages: 100 });

      const { id } = response.body;
      return request(app.getHttpServer())
        .patch(`/books/${id}`)
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ title: 'Book name 2', pages: 200 })
        .expect(200);
    });

    it('should not be able to update a non-existent book', () => {
      return request(app.getHttpServer())
        .patch('/books/nonexistentbook')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ title: 'Book name 2', pages: 200 })
        .expect(404);
    });

    it('should not be able to update a book that does not belong to the user', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${secondaryToken}`)
        .send({ title: 'Book name', pages: 100 });

      const { id } = response.body;

      return request(app.getHttpServer())
        .patch(`/books/${id}`)
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ title: 'Book name 2', pages: 200 })
        .expect(403);
    });
  });

  describe('DELETE /books/:id', () => {
    it('should be able to delete a book', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ title: 'Book name', pages: 100 });

      const { id } = response.body;

      return request(app.getHttpServer())
        .delete(`/books/${id}`)
        .set('Authorization', `Bearer ${primaryToken}`)
        .expect(200);
    });

    it('should not be able to delete a non-existent book', () => {
      return request(app.getHttpServer())
        .delete('/books/nonexistentbook')
        .set('Authorization', `Bearer ${primaryToken}`)
        .expect(404);
    });

    it('should not be able to delete a book that does not belong to the user', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${secondaryToken}`)
        .send({ title: 'Book name', pages: 100 });

      const { id } = response.body;

      return request(app.getHttpServer())
        .delete(`/books/${id}`)
        .set('Authorization', `Bearer ${primaryToken}`)
        .expect(403);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
