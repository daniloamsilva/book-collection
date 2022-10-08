import { Inject, Injectable } from '@nestjs/common/decorators';
import { ImATeapotException } from '@nestjs/common/exceptions';
import { CreateBookDto } from './dto/create-book.dto';
import { IBooksRepository } from './repositories/interfaces/books-repository.interface';

@Injectable()
export class BooksService {
  constructor(
    @Inject('IBooksRepository') private booksRepository: IBooksRepository,
  ) {}

  async create({ title, pages }: CreateBookDto) {
    if (!pages) throw new ImATeapotException('Zero páginas.');

    const book = await this.booksRepository.create({ title, pages });
    return book;
  }

  async findAll() {
    const books = await this.booksRepository.findAll();
    return books;
  }
}
