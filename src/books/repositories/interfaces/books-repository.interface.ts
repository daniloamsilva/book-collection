import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { UpdateBookDto } from 'src/books/dto/update-book.dto';
import { BookEntity } from 'src/books/entities/book.entity';

export interface IBooksRepository {
  create(user_id: string, data: CreateBookDto): Promise<BookEntity>;
  findAll(user_id: string): Promise<BookEntity[]>;
  findOne(id: string): Promise<BookEntity>;
  update(id: string, data: UpdateBookDto): Promise<BookEntity>;
  delete(id: string): Promise<void>;
}
