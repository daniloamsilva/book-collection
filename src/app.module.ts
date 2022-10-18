import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot(), BooksModule, AuthModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
