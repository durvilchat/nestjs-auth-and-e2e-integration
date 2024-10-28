import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    all: jest.fn(),
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('all', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, username: 'testUser' }];
      mockUsersService.all.mockResolvedValue(result);

      expect(await usersController.all()).toBe(result);
      expect(mockUsersService.all).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register a new user and return the user object', async () => {
      const registerDto = { username: 'newUser', password: 'newPass' };
      const user = { id: 1, username: 'newUser' };

      mockUsersService.findByUsername.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(user);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await usersController.register(registerDto, res);

      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(
        registerDto.username,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(
        registerDto.username,
        registerDto.password,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should throw an error if the username already exists', async () => {
      const registerDto = { username: 'existingUser', password: 'newPass' };
      const existingUser = { id: 1, username: 'existingUser' };

      mockUsersService.findByUsername.mockResolvedValue(existingUser);

      await expect(
        usersController.register(registerDto, {} as Response),
      ).rejects.toThrow(HttpException);
      await expect(
        usersController.register(registerDto, {} as Response),
      ).rejects.toThrow('Username already exists');
    });
  });
});
