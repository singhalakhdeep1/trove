import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;
    let redisService: RedisService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        session: {
            create: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
    };

    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn(),
    };

    const mockRedisService = {
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: RedisService, useValue: mockRedisService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
        redisService = module.get<RedisService>(RedisService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const mockUser = {
                id: '1',
                email: registerDto.email,
                name: registerDto.name,
                password: hashedPassword,
                role: 'BUYER',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockPrismaService.user.create.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            const result = await service.register(registerDto);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
            expect(mockPrismaService.user.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    email: registerDto.email,
                    name: registerDto.name,
                }),
            });
        });

        it('should throw error if email already exists', async () => {
            const registerDto = {
                email: 'existing@example.com',
                password: 'password123',
                name: 'Test User',
            };

            mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

            await expect(service.register(registerDto)).rejects.toThrow('Email already exists');
        });
    });

    describe('login', () => {
        it('should login user with valid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            const hashedPassword = await bcrypt.hash(loginDto.password, 10);
            const mockUser = {
                id: '1',
                email: loginDto.email,
                password: hashedPassword,
                role: 'BUYER',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            const result = await service.login(loginDto);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
            expect(mockJwtService.sign).toHaveBeenCalled();
        });

        it('should throw error with invalid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
        });
    });

    describe('validateToken', () => {
        it('should validate a valid token', async () => {
            const mockPayload = { userId: '1', email: 'test@example.com' };
            mockJwtService.verify.mockReturnValue(mockPayload);
            mockRedisService.get.mockResolvedValue(null);

            const result = await service.validateToken('valid-token');

            expect(result).toEqual(mockPayload);
            expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token');
        });

        it('should throw error for blacklisted token', async () => {
            mockRedisService.get.mockResolvedValue('blacklisted');

            await expect(service.validateToken('blacklisted-token')).rejects.toThrow(
                'Token has been revoked'
            );
        });
    });

    describe('logout', () => {
        it('should logout user and blacklist token', async () => {
            const userId = '1';
            const token = 'mock-token';

            mockRedisService.set.mockResolvedValue('OK');
            mockPrismaService.session.delete.mockResolvedValue({});

            await service.logout(userId, token);

            expect(mockRedisService.set).toHaveBeenCalledWith(
                expect.stringContaining('blacklist:'),
                'true',
                expect.any(Number)
            );
        });
    });
});
