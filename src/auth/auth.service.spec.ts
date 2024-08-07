import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { sign, verify } from './utils/jwt.utils';

jest.mock('bcrypt');
jest.mock('./utils/jwt.utils');

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: jest.Mocked<UsersService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService, jest.Mocked<UsersService>>(UsersService);
    });

    describe('validateUser', () => {
        it('should return user without password if validation succeeds', async () => {
            const mockUser = { id: 1, name: 'Jon', email: 'email@example.com', password: 'hashedPassword' };
            usersService.findOne.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await authService.validateUser('email@example.com', 'password');

            expect(usersService.findOne).toHaveBeenCalledWith('email@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
            expect(result).toEqual({ id: 1, name: 'Jon', email: 'email@example.com', password: 'hashedPassword' });
        });

        it('should return null if validation fails', async () => {
            usersService.findOne.mockResolvedValue(null);

            const result = await authService.validateUser('john', 'password');

            expect(usersService.findOne).toHaveBeenCalledWith('john');
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return an access token', async () => {
            const mockUser = { email: 'john@example.com' };
            const mockToken = 'mockAccessToken';
            (sign as jest.Mock).mockReturnValue(mockToken);

            const result = await authService.login(mockUser);

            expect(sign).toHaveBeenCalledWith({ email: 'john@example.com' }, authService['secretKey']);
            expect(result).toEqual({ access_token: mockToken });
        });
    });

    describe('verifyToken', () => {
        it('should return decoded token if verification is successful', async () => {
            const mockToken = 'mockToken';
            const mockPayload = { email: 'john@example.com' };
            (verify as jest.Mock).mockReturnValue(mockPayload);

            const result = await authService.verifyToken(mockToken);

            expect(verify).toHaveBeenCalledWith(mockToken, authService['secretKey']);
            expect(result).toEqual(mockPayload);
        });

        it('should return null if verification fails', async () => {
            (verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            const result = await authService.verifyToken('invalidToken');

            expect(result).toBeNull();
        });
    });
});
