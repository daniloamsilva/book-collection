import { Injectable } from '@nestjs/common';
import { UpdateBookDto } from 'src/books/dto/update-book.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBookDto } from '../../dto/create-book.dto';
import { BookEntity } from '../../entities/book.entity';
import { IBooksRepository } from '../interfaces/books-repository.interface';

@Injectable()
export class BooksRepository implements IBooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    user_id: string,
    { title, pages }: CreateBookDto,
  ): Promise<BookEntity> {
    const book = await this.prisma.book.create({
      data: {
        title,
        pages,
        user_id,
      },
    });

    return book;
  }

  async findAll(user_id: string): Promise<BookEntity[]> {
    const books = await this.prisma.book.findMany({ where: { user_id } });
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

  async delete(id: string): Promise<void> {
    await this.prisma.book.delete({ where: { id } });
    return;
  }
}
