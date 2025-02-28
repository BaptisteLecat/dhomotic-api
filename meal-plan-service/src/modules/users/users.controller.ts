import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';


@ApiTags('users')
@Controller({
  version: '1',
  path: 'users'
})
export class UsersController {
  constructor(private readonly userService: UsersService, private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'The found record' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | undefined> {
    let user = await this.userService.findOne(id);
    if(!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'The found records', type: [User] })
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }
}
