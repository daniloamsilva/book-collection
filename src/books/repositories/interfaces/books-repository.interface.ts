import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { UpdateBookDto } from 'src/books/dto/update-book.dto';
import { BookEntity } from 'src/books/entities/book.entity';

export abstract class IBooksRepository {
  abstract create(user_id: string, data: CreateBookDto): Promise<BookEntity>;
  abstract findAll(user_id: string): Promise<BookEntity[]>;
  abstract findOne(id: string): Promise<BookEntity>;
  abstract update(id: string, data: UpdateBookDto): Promise<BookEntity>;
  abstract delete(id: string): Promise<void>;
}
