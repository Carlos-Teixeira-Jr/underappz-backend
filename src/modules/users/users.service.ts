import { Injectable } from "@nestjs/common";
import { User } from "./users.module";


@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: "Mario",
      username: 'mariozin',
      password: 'encanador'
    },
    {
      id: 2,
      name: "Luigi",
      username: 'luigin',
      password: 'encanadorVerde'
    }
  ]

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}