import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return credentials on successful login', async () => {
      const loginDto = { username: 'testUser', password: 'testPass' };
      const user = { id: 1, username: 'testUser' };
      const successResponse = { accessToken: 'token123' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(successResponse);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await authController.login(loginDto, res);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(successResponse);
    });

    it('should handle invalid login', async () => {
      const loginDto = { username: 'wrongUser', password: 'wrongPass' };

      mockAuthService.validateUser.mockImplementation(() => {
        throw new UnauthorizedException();
      });

      await expect(
        authController.login(loginDto, {} as Response),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto);
    });
  });
});
