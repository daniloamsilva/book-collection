import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { errors } from '../books.error';

export class CreateBookDto {
  @IsString({ message: errors.TITLE_IS_STRING })
  @IsNotEmpty({ message: errors.TITLE_IS_NOT_EMPTY })
  @ApiProperty({
    description: 'Título do livro',
    example: 'Harry Potter e a Pedra Filosofal',
  })
  title: string;

  @IsNumber({}, { message: errors.PAGES_IS_NUMBER })
  @IsNotEmpty({ message: errors.PAGES_IS_NOT_EMPTY })
  @ApiProperty({
    description: 'Número de páginas',
    minimum: 1,
    example: 320,
  })
  pages: number;
}
