import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { FastifyRequest } from 'fastify';
import { Result } from 'src/types/common/result.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-list-users')
  async getListUsers(@Req() request: FastifyRequest): Promise<Result> {
    return await this.userService.getListUsers(request);
  }

  @Get('get-dump-user')
  async getDumpUser(@Req() request: FastifyRequest): Promise<Result> {
    return await this.userService.dumUser(request);
  }
}
