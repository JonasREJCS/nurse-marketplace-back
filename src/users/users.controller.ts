import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('create')
  async create(
    @Body() body: { name: string; email: string; password: string },
  ) {
    try {
      return this.usersService.create(body.name, body.email, body.password);
    } catch (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
}
