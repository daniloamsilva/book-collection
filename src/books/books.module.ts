import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BooksRepository } from './repositories/implementations/books.repository';

@Module({
  controllers: [BooksController],
  providers: [
    BooksService,
    PrismaService,
    {
      provide: 'IBooksRepository',
      useClass: BooksRepository,
    },
  ],
})
export class BooksModule {}
