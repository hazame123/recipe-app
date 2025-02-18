import { IsOptional, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
