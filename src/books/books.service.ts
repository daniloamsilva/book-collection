import { Inject, Injectable } from '@nestjs/common/decorators';
import {
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { errors } from './books.error';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IBooksRepository } from './repositories/interfaces/books-repository.interface';

@Injectable()
export class BooksService {
  constructor(
    @Inject('IBooksRepository') private booksRepository: IBooksRepository,
  ) {}

  async create(user_id: string, { title, pages }: CreateBookDto) {
    if (!pages) throw new ImATeapotException(errors.ZERO_PAGES);

    const book = await this.booksRepository.create(user_id, { title, pages });
    return book;
  }

  async findAll(user_id: string) {
    const books = await this.booksRepository.findAll(user_id);
    return books;
  }

  async findOne(user_id: string, id: string) {
    const book = await this.booksRepository.findOne(id);

    if (!book) throw new NotFoundException(errors.NON_EXISTENT_BOOK);
    if (book.user_id !== user_id)
      throw new ForbiddenException(errors.NOT_BELONG_TO_THE_USER);

    return book;
  }

  async update(user_id: string, id: string, updateCrudDto: UpdateBookDto) {
    let book = await this.booksRepository.findOne(id);

    if (!book) throw new NotFoundException(errors.NON_EXISTENT_BOOK);
    if (book.user_id !== user_id)
      throw new ForbiddenException(errors.NOT_BELONG_TO_THE_USER);

    book = await this.booksRepository.update(id, updateCrudDto);
    return book;
  }

  async delete(id: string) {
    const book = await this.booksRepository.findOne(id);

    if (!book) throw new NotFoundException(errors.NON_EXISTENT_BOOK);

    return this.booksRepository.delete(id);
  }
}
