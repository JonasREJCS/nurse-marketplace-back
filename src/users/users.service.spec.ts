import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and save user', async () => {
      const createUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password',
      };
      const hashedPassword = 'hashedPassword';
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      repository.create.mockReturnValue(createUserDto as any);
      repository.save.mockResolvedValue(createUserDto as any);

      const result = await service.create(
        createUserDto.name,
        createUserDto.email,
        createUserDto.password,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual( { ...createUserDto, password: undefined });
    });

    it('[ERROR] should throw error if email is already associated with an user', async () => {
      const createUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password',
      };
      const hashedPassword = 'hashedPassword';
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      repository.create.mockReturnValue(createUserDto as any);
      repository.save.mockResolvedValue(createUserDto as any);
      repository.findOneBy.mockResolvedValue(createUserDto as any);
      await expect(
        service.create(
          createUserDto.name,
          createUserDto.email,
          createUserDto.password,
        ),
      ).rejects.toThrow('Um usuário com esse email já está cadastrado!');
    });
  });
});
