import { CreateBookDto } from '../../dto/create-book.dto';
import { BookEntity } from '../../entities/book.entity';
import { IBooksRepository } from '../interfaces/books-repository.interface';

export class BooksRepository implements IBooksRepository {
  books: BookEntity[] = [];

  async create(data: CreateBookDto): Promise<BookEntity> {
    const book = new BookEntity();
    Object.assign(book, data);
    this.books.push(book);
    return book;
  }
}
