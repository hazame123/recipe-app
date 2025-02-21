import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.entity';

type AuthInput = { username: string, password: string };
type SignInData = { userId: string; username: string };
type AuthResult = { accessToken: string; userId: string; username: string };

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);

        if (!user) {
            throw new UnauthorizedException();
        }

        return this.signIn(user);
    }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.userService.findUserByUsername(input.username);

        if (user && bcrypt.compare(input.password, user.password)) {
            return {
                userId: user.userId,
                username: user.username,
            }
        }
        return null;
    }

    async signIn(user: SignInData): Promise<AuthResult> {
        const tokenPayload = {
            sub: user.userId,
            username: user.username,
        };

        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return { accessToken, username: user.username, userId: user.userId };
    }
}
