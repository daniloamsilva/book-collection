import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from './books.service';
import { BooksRepository } from './repositories/implementations/books.repository';
import { BooksController } from './books.controller';

describe('BooksController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        PrismaService,
        {
          provide: 'IBooksRepository',
          useClass: BooksRepository,
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

  describe('POST /books', () => {
    it('should be able to create a new book', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({ title: 'Book name', pages: 100 })
        .expect(201);
    });

    it('should not be able to create a book without a title', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({ pages: 100 })
        .expect(400);
    });

    it('should not be able to create a book with zero pages', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({ title: 'Book name', pages: 0 })
        .expect(418);
    });
  });

  describe('GET /books', () => {
    it('should be able to list all books', () => {
      return request(app.getHttpServer()).get('/books').expect(200);
    });
  });

  describe('GET /books/:id', () => {
    it('should be able to find a book', async () => {
      const response = await request(app.getHttpServer())
        .post('/books')
        .send({ title: 'Book name', pages: 100 });

      const { id } = response.body;

      return request(app.getHttpServer()).get(`/books/${id}`).expect(200);
    });

    it('should not be able to find a non-existent book', () => {
      return request(app.getHttpServer())
        .get('/books/nonexistentbook')
        .expect(404);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
