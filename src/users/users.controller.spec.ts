import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: jest.Mocked<UsersService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        usersController = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService, jest.Mocked<UsersService>>(
            UsersService,
        );
    });

    it('should be defined', () => {
        expect(usersController).toBeDefined();
    });

    describe('create', () => {
        it('should call usersService.create and return result on success', async () => {
            const mockUser = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
            };
            usersService.create.mockResolvedValue(mockUser);

            const result = await usersController.create({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password',
            });

            expect(usersService.create).toHaveBeenCalledWith(
                'John Doe',
                'john@example.com',
                'password',
            );
            expect(result).toEqual(mockUser);
        });

        it('should reject if usersService.create receives undefined name', async () => {
            await expect(
                usersController.create({
                    name: undefined,
                    email: 'john@example.com',
                    password: 'password',
                }),
            ).rejects;
        });

        it('should reject if usersService.create receives undefined email', async () => {
            await expect(
                usersController.create({
                    name: 'John Doe',
                    email: undefined,
                    password: 'password',
                }),
            ).rejects;
        });

        it('should reject if usersService.create receives undefined password', async () => {
            await expect(
                usersController.create({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: undefined,
                }),
            ).rejects;
        });
    });
});
