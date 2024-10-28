import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('all', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        { id: 1, username: 'testuser', password: 'hashedPassword' } as User,
      ];
      jest.spyOn(usersRepository, 'find').mockResolvedValue(users);

      const result = await service.all();
      expect(result).toEqual(users);
      expect(usersRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create and save a user with hashed password', async () => {
      const username = 'newUser';
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      jest
        .spyOn(usersRepository, 'create')
        .mockImplementation((user) => user as User);
      jest.spyOn(usersRepository, 'save').mockResolvedValue({
        id: 1,
        username,
        password: hashedPassword,
      } as User);

      const result = await service.create(username, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(usersRepository.create).toHaveBeenCalledWith({
        username,
        password: hashedPassword,
      });
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 1, username, password: hashedPassword });
    });
  });

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'existingUser';
      const user = { id: 1, username, password: 'hashedPassword' } as User;
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findByUsername(username);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const username = 'nonExistentUser';
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findByUsername(username);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toBeNull();
    });
  });
});
