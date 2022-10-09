import { ImATeapotException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BooksRepository } from './repositories/in-memory/books.repository';

describe('BooksService', () => {
  let booksService: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: 'IBooksRepository',
          useClass: BooksRepository,
        },
      ],
    }).compile();

    booksService = module.get<BooksService>(BooksService);
  });

  describe('Create a new book', () => {
    it('should be able to create a new book', async () => {
      const book = await booksService.create({
        title: 'Book title',
        pages: 100,
      });

      expect(book).toHaveProperty('id');
    });

    it('should not be able to create a book with zero pages', async () => {
      await expect(
        booksService.create({
          title: 'Book title',
          pages: 0,
        }),
      ).rejects.toEqual(new ImATeapotException('Zero páginas.'));
    });
  });

  describe('List all books', () => {
    it('should be able to list all books', async () => {
      const book1 = await booksService.create({
        title: 'Book 1',
        pages: 10,
      });
      const book2 = await booksService.create({
        title: 'Book 2',
        pages: 20,
      });
      const book3 = await booksService.create({
        title: 'Book 3',
        pages: 30,
      });

      const books = await booksService.findAll();

      expect(books).toStrictEqual([book1, book2, book3]);
    });
  });
});
