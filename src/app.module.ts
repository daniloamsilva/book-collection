import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), BooksModule, AuthModule, UsersModule],
})
export class AppModule {}
