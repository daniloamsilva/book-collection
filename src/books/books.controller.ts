import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Criar um livro' })
  @Post()
  create(@User() user: UserEntity, @Body() createBookDto: CreateBookDto) {
    return this.booksService.create(user.id, createBookDto);
  }

  @ApiOperation({ summary: 'Listar todos os livros' })
  @Get()
  findAll(@User() user: UserEntity) {
    return this.booksService.findAll(user.id);
  }

  @ApiOperation({ summary: 'Encontrar um livro' })
  @Get(':id')
  findOne(@User() user: UserEntity, @Param('id') id: string) {
    return this.booksService.findOne(user.id, id);
  }

  @ApiOperation({ summary: 'Editar um livro' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @ApiOperation({ summary: 'Remover um livro' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.delete(id);
  }
}
