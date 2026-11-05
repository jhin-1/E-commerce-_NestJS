import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { IAuthReq } from '../../common/Interfaces/auth.interface.js';
import { UserRole } from '../../common/Enums/user.enum.js';
import { auth, User } from '../../common/Decorator/index.js';
import type { UserDocument } from '../../DB/index.js';

@auth([UserRole.ADMIN])
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(ValidationPipe) data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  findAll(@Req() req: IAuthReq) {
    console.log({
      userID: req.credentials.userId,
      DecodeDATA: req.credentials.decodeData,
    });
    return {
      userID: req.credentials.userId,
      DecodeDATA: req.credentials.decodeData,
    };
  }

  @Get('getUser')
  findOne(@Req() req: IAuthReq) {
    return this.userService.findOne(req.credentials.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('profile')
  profile(@Req() req: IAuthReq) {
    return { message: 'Done', data: req.credentials.user };
  }

  @Get('newprofile')
  newprofile(@User() user: UserDocument) {
    return { message: 'Done', data: user };
  }
}
