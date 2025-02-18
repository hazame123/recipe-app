import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEmail, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    email?: string;
    
    @IsOptional()
    username?: string;
    
    @IsOptional()
    password?: string;
}