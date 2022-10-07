import { Injectable, ImATeapotException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IBooksRepository } from './repositories/interfaces/books-repository.interface';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: IBooksRepository) {}

  async create({ title, pages }: CreateBookDto) {
    if (!pages) throw new ImATeapotException('Zero páginas.');

    const book = await this.booksRepository.create({ title, pages });
    return book;
  }

  findAll() {
    return `This action returns all books`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
