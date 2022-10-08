import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { BooksModule } from './books.module';
import { BooksService } from './books.service';
import { BooksRepository } from './repositories/implementations/books.repository';

describe('BooksController', () => {
  let app: INestApplication;
  let booksService: BooksService;
  let booksRepository: BooksRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    prismaService = new PrismaService();
    booksRepository = new BooksRepository(prismaService);
    booksService = new BooksService(booksRepository);

    const module: TestingModule = await Test.createTestingModule({
      imports: [BooksModule],
    })
      .overrideProvider(BooksService)
      .useValue(booksService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('POST /books', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({ title: 'Book name', pages: 100 })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
