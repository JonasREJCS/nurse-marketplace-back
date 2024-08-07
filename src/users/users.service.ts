import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<User | any> {
    if (!email || !name || !password) throw new Error('Dados inválidos');
    
    const foundUser = await this.findOne(email);
    if (foundUser) throw new Error('Um usuário com esse email já está cadastrado!');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    return { ...savedUser, password: undefined };
  }
}
