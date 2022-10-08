import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { BookEntity } from 'src/books/entities/book.entity';

export interface IBooksRepository {
  create(data: CreateBookDto): Promise<BookEntity>;
  findAll(): Promise<BookEntity[]>;
}
