import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService, jest.Mocked<AuthService>>(
      AuthService,
    );
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if validation is successful', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(
        'test@example.com',
        'password',
      );

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if validation fails', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        localStrategy.validate('test@example.com', 'wrongpassword'),
      ).rejects.toThrowError('Unauthorized');
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'wrongpassword',
      );
    });
  });
});
