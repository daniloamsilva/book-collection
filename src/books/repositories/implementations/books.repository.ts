import { Injectable } from '@nestjs/common';
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
}
