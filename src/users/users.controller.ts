import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PassportLocalGuard } from 'src/auth/guards/passport-local.guard';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signup(@Body() input: { username: string; email: string; password: string }) {
        return this.usersService.create(input.username, input.email, input.password);
    }

    // GET all users
    @HttpCode(HttpStatus.OK)
    @Get()
    @UseGuards(PassportJwtAuthGuard)
    getUsers() {
        return this.usersService.findAll()
    }

    // GET user by ID
    @HttpCode(HttpStatus.FOUND)
    @Get(':id')
    @UseGuards(PassportJwtAuthGuard)
    getOneUser(@Param('id') id: string) {
        return this.usersService.findUserByUserId(id);
    }

    // Edit current user
    @HttpCode(HttpStatus.OK)
    @Put('edit')
    @UseGuards(PassportJwtAuthGuard)
    updateUser(@Request() request, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.editUser(request.user.userId, updateUserDto);
    }
}
