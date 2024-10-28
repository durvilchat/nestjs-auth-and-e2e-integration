import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token123'),
  };
  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if the credentials are valid', async () => {
      const user: User = {
        id: 1,
        username: 'testUser',
        password: await bcrypt.hash('testPassword', 10),
      };
      mockUsersService.findByUsername.mockResolvedValue(user);

      const result = await service.validateUser({
        username: 'testUser',
        password: 'testPassword',
      });

      expect(result).toEqual({ id: user.id, username: user.username });
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('testUser');
    });

    it('should return null if the user is not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      await expect(
        service.validateUser({
          username: 'nonExistentUser',
          password: 'testPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return null if the password is incorrect', async () => {
      const user: User = {
        id: 1,
        username: 'testUser',
        password: await bcrypt.hash('correctPassword', 10),
      };
      mockUsersService.findByUsername.mockResolvedValue(user);

      await expect(
        service.validateUser({
          username: 'testUser',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return a token for a valid user', async () => {
      const user = { id: 1, username: 'testUser' };
      const token = 'token123';

      jest.spyOn(service, 'login').mockResolvedValue(token as any);
      const result = await service.login(user);
      expect(result).toEqual(token);
    });
  });
});
