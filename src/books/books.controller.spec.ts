import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
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
    await app.init();
  });

  it('POST /books', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({ title: 'Book name', pages: 100 })
      .expect(201);
  });

  it('GET /books', () => {
    return request(app.getHttpServer()).get('/books').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
