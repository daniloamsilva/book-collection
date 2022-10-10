import { Injectable } from '@nestjs/common';
import { UpdateBookDto } from 'src/books/dto/update-book.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBookDto } from '../../dto/create-book.dto';
import { BookEntity } from '../../entities/book.entity';
import { IBooksRepository } from '../interfaces/books-repository.interface';

@Injectable()
export class BooksRepository implements IBooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create({ title, pages }: CreateBookDto): Promise<BookEntity> {
    const book = await this.prisma.book.create({
      data: {
        title,
        pages,
      },
    });

    return book;
  }

  async findAll(): Promise<BookEntity[]> {
    const books = await this.prisma.book.findMany();
    return books;
  }

  async findOne(id: string): Promise<BookEntity> {
    const book = await this.prisma.book.findUnique({ where: { id } });
    return book;
  }

  async update(id: string, data: UpdateBookDto): Promise<BookEntity> {
    const book = await this.prisma.book.update({ where: { id }, data });
    return book;
  }
}
