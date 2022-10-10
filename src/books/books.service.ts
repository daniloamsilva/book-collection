import { Inject, Injectable } from '@nestjs/common/decorators';
import {
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { errors } from './books.error';
import { CreateBookDto } from './dto/create-book.dto';
import { IBooksRepository } from './repositories/interfaces/books-repository.interface';

@Injectable()
export class BooksService {
  constructor(
    @Inject('IBooksRepository') private booksRepository: IBooksRepository,
  ) {}

  async create({ title, pages }: CreateBookDto) {
    if (!pages) throw new ImATeapotException(errors.ZERO_PAGES);

    const book = await this.booksRepository.create({ title, pages });
    return book;
  }

  async findAll() {
    const books = await this.booksRepository.findAll();
    return books;
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findOne(id);

    if (!book) throw new NotFoundException(errors.NON_EXISTENT_BOOK);

    return book;
  }
}
