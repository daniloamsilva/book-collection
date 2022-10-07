import { ImATeapotException } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksRepository } from './repositories/in-memory/books.repository';

describe('BooksService', () => {
  let booksService: BooksService;
  let booksRepository: BooksRepository;

  beforeEach(async () => {
    booksRepository = new BooksRepository();
    booksService = new BooksService(booksRepository);
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
});
