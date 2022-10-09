import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { errors } from '../books.error';

export class CreateBookDto {
  @IsString({ message: errors.TITLE_IS_STRING })
  @IsNotEmpty({ message: errors.TITLE_IS_NOT_EMPTY })
  title: string;

  @IsNumber({}, { message: errors.PAGES_IS_NUMBER })
  @IsNotEmpty({ message: errors.PAGES_IS_NOT_EMPTY })
  pages: number;
}
