import { User } from '@prisma/client';
import { v4 as uuid } from 'uuid';

export class UserEntity implements User {
  id: string;
  username: string;
  password: string;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
