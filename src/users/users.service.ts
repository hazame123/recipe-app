import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(username: string, email: string, password: string): Promise<Partial<User>> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ username, email, password: hashedPassword });
        const saveUser = await this.userRepository.save(user);
        return instanceToPlain(saveUser);
      }

    async findUserByUsername(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { username } });
    }

    async findUserByUserId(userId: string): Promise<Partial<User> | undefined> {
        const user = this.userRepository.findOne({ where: { userId } });
        if (user) return instanceToPlain(user);
        return undefined;
    }

    async findAll(): Promise<Partial<User>[]> {
        const users = await this.userRepository.find();
        return instanceToPlain(users) as Partial<User>[];
    }

    async editUser(userId: string, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({ where: { userId } });
        user.username = updateUserDto.username;
        user.email = updateUserDto.email;
        if (updateUserDto.password) {
            const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
            user.password = hashedPassword;
        }
        await this.userRepository.save(user);
        return instanceToPlain(user);
    }
}
