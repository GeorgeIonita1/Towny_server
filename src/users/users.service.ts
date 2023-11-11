import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";

import { FirebaseService } from 'src/firebase/firebase.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      email: 123
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      email: 34456
    },
  ];

  constructor(private db: FirebaseService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(userDetails) {
    console.log(userDetails);
    const encryptedPassword = await bcrypt.hashSync(userDetails.password, 10);
    console.log(encryptedPassword)

    const createdUsed = this.db.createUser(userDetails, encryptedPassword);

    return createdUsed;
  }
}
