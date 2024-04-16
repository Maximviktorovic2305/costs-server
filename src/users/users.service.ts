import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<User>) {}

  async registration(createUserDto: CreateUserDto): Promise<User | null> {
    const existingUserByUsername = await this.usersModel.findOne({
      username: createUserDto.username,
    });

    const existingUserByEmail = await this.usersModel.findOne({
      email: createUserDto.email,
    });

    if (existingUserByEmail || existingUserByUsername) {
      return null;
    }

    const createdUser = new this.usersModel({
      username: createUserDto.username,
      password: await hash(createUserDto.password, 10),
      email: createUserDto.email,
    });

    return createdUser.save();
  }

  async login(createUserDto: CreateUserDto): Promise<User | null> {
    const user = await this.usersModel.findOne({
      username: createUserDto.username,
    });
    if (!user) {
      return null;
    }

    return user as User;
  }

  async findOne(username: string): Promise<User> {
    return this.usersModel.findOne({ username });
  }
}
