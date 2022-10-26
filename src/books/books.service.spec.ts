import { ImATeapotException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { errors } from './books.error';
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
      const book = await booksService.create('user_id', {
        title: 'Book title',
        pages: 100,
      });

      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('user_id');
    });

    it('should not be able to create a book with zero pages', async () => {
      await expect(
        booksService.create('user_id', {
          title: 'Book title',
          pages: 0,
        }),
      ).rejects.toEqual(new ImATeapotException(errors.ZERO_PAGES));
    });
  });

  describe('List all books', () => {
    it('should be able to list all books', async () => {
      const book1 = await booksService.create('user_id', {
        title: 'Book 1',
        pages: 10,
      });
      const book2 = await booksService.create('user_id', {
        title: 'Book 2',
        pages: 20,
      });
      const book3 = await booksService.create('user_id', {
        title: 'Book 3',
        pages: 30,
      });

      await booksService.create('user_id2', {
        title: 'Book 4',
        pages: 30,
      });

      const books = await booksService.findAll('user_id');

      expect(books).toStrictEqual([book1, book2, book3]);
    });
  });

  describe('Find a book', () => {
    it('should be able to find a book', async () => {
      await booksService.create('user_id', {
        title: 'Book 1',
        pages: 10,
      });
      const book2 = await booksService.create('user_id', {
        title: 'Book 2',
        pages: 20,
      });
      await booksService.create('user_id', {
        title: 'Book 3',
        pages: 30,
      });

      const book = await booksService.findOne('user_id', book2.id);
      expect(book).toBe(book2);
    });

    it('should not be able find a non-existent book', async () => {
      await booksService.create('user_id', {
        title: 'Book 1',
        pages: 10,
      });
      await booksService.create('user_id', {
        title: 'Book 2',
        pages: 20,
      });
      await booksService.create('user_id', {
        title: 'Book 3',
        pages: 30,
      });

      await expect(
        booksService.findOne('user_id', 'not-existent-book'),
      ).rejects.toEqual(new NotFoundException(errors.NON_EXISTENT_BOOK));
    });

    it('should not be able find a book that does not belong to the user', async () => {
      const book = await booksService.create('another_user', {
        title: 'Book 1',
        pages: 10,
      });

      await expect(booksService.findOne('user_id', book.id)).rejects.toEqual(
        new NotFoundException(errors.NOT_BELONG_TO_THE_USER),
      );
    });
  });

  describe('Update a book', () => {
    it('should be to update a book', async () => {
      let book = await booksService.create('user_id', {
        title: 'Book 1',
        pages: 10,
      });

      book = await booksService.update(book.id, {
        title: 'Book 2',
        pages: 20,
      });

      expect(book).toBe(book);
    });

    it('should not be able to update a non-existent book', async () => {
      await expect(
        booksService.update('nonexistentbook', {
          title: 'Book title',
          pages: 100,
        }),
      ).rejects.toEqual(new NotFoundException(errors.NON_EXISTENT_BOOK));
    });
  });

  describe('Delete a book', () => {
    it('should be able to delete a book', async () => {
      const book1 = await booksService.create('user_id', {
        title: 'Book 1',
        pages: 10,
      });

      const book2 = await booksService.create('user_id', {
        title: 'Book 2',
        pages: 20,
      });

      const book3 = await booksService.create('user_id', {
        title: 'Book 3',
        pages: 30,
      });

      await booksService.delete(book2.id);

      const books = await booksService.findAll('user_id');
      expect(books).toStrictEqual([book1, book3]);
    });

    it('should not be able to delete a non-existent book', async () => {
      await expect(booksService.delete('nonexistentbook')).rejects.toEqual(
        new NotFoundException(errors.NON_EXISTENT_BOOK),
      );
    });
  });
});
