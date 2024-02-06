import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async signUp(email: string, password: string) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already exists');
    }
    // generate salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and password
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // join the hashed result and the salt
    const result = salt + '.' + hash.toString('hex');
    // create user
    const newUser = await this.userService.create(email, result);
    return newUser;
  }
  async signIn(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong username/password');
    }
    return user;
  }
}
