import { UpdateBookDto } from 'src/books/dto/update-book.dto';
import { CreateBookDto } from '../../dto/create-book.dto';
import { BookEntity } from '../../entities/book.entity';
import { IBooksRepository } from '../interfaces/books-repository.interface';

export class BooksRepository implements IBooksRepository {
  books: BookEntity[] = [];

  async create(user_id: string, data: CreateBookDto): Promise<BookEntity> {
    const book = new BookEntity();
    Object.assign(book, { user_id, ...data });
    this.books.push(book);
    return book;
  }

  async findAll(): Promise<BookEntity[]> {
    return this.books;
  }

  async findOne(id: string): Promise<BookEntity> {
    const book = this.books.find((b) => b.id === id);
    return book;
  }

  async update(
    id: string,
    { title, pages }: UpdateBookDto,
  ): Promise<BookEntity> {
    const findIndex = this.books.findIndex((b) => b.id === id);
    const book = this.books[findIndex];

    this.books[findIndex] = {
      id: book.id,
      title,
      pages,
      user_id: 'user_id',
    };

    return this.books[findIndex];
  }

  async delete(id: string): Promise<void> {
    const index = this.books.findIndex((b) => b.id === id);
    this.books.splice(index, 1);
    return;
  }
}
