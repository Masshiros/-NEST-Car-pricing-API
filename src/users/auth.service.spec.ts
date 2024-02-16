import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of AuthService', async () => {
    expect(service).toBeDefined();
  });
  it('creates new user with a salted and hashed password', async () => {
    const user = await service.signUp('abc@gmail.com', 'asdasd');
    expect(user.password).not.toEqual('asdasd');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if user sign up with email that is in use', async () => {
    await service.signUp('asdf@asdf.com', 'mypassword');
    await expect(
      service.signUp('asdf@asdf.com', 'mypassword'),
    ).rejects.toThrow(BadRequestException);
  });
  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signIn('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });
  it('throws if an invalid password is provided', async () => {
    await service.signUp('laskdjf@alskdfj.com', 'passowrd');
    await expect(
      service.signIn('laskdjf@alskdfj.com', 'passowrd1'),
    ).rejects.toThrow(BadRequestException);
  });
  it('returns a user if correct password is provided', async () => {
    await service.signUp('asdf@asdf.com', 'mypassword');
    const user = await service.signIn('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
