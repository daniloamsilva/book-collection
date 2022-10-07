import { Book } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export class BookEntity implements Book {
  id: string;
  title: string;
  pages: number;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
