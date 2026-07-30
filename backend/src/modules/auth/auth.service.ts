import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private redis: RedisService,
        private config: ConfigService,
    ) { }

    async register(dto: RegisterDto) {
        // Check if user exists
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.email }, { phone: dto.phone }],
            },
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(dto.password, 12);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                phone: dto.phone,
                firstName: dto.firstName,
                lastName: dto.lastName,
                passwordHash,
                role: dto.role || 'BUYER',
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email);

        // Save session
        await this.saveSession(user.id, tokens.accessToken, tokens.refreshToken);

        return {
            user,
            ...tokens,
        };
    }

    async login(dto: LoginDto) {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user || !user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new UnauthorizedException('Account is disabled');
        }

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email);

        // Save session
        await this.saveSession(user.id, tokens.accessToken, tokens.refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
            ...tokens,
        };
    }

    async logout(userId: string, token: string) {
        // Delete session from database
        await this.prisma.session.deleteMany({
            where: {
                userId,
                token,
            },
        });

        // Remove from Redis
        await this.redis.del(`session:${token}`);

        return { success: true };
    }

    async refreshToken(refreshToken: string) {
        try {
            // Verify refresh token
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });

            // Find session
            const session = await this.prisma.session.findFirst({
                where: {
                    userId: payload.sub,
                    refreshToken,
                },
                include: {
                    user: true,
                },
            });

            if (!session) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Generate new tokens
            const tokens = await this.generateTokens(
                session.user.id,
                session.user.email,
            );

            // Update session
            await this.prisma.session.update({
                where: { id: session.id },
                data: {
                    token: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
            });

            // Update Redis
            await this.saveSession(
                session.user.id,
                tokens.accessToken,
                tokens.refreshToken,
            );

            return tokens;
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async validateUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                isActive: true,
            },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return user;
    }

    async googleLogin(profile: any) {
        // Check if user exists
        let user = await this.prisma.user.findUnique({
            where: { email: profile.email },
        });

        if (!user) {
            // Create new user
            user = await this.prisma.user.create({
                data: {
                    email: profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    avatar: profile.picture,
                    isVerified: true,
                },
            });
        }

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email);

        // Save session
        await this.saveSession(user.id, tokens.accessToken, tokens.refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
            },
            ...tokens,
        };
    }

    private async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: this.config.get('JWT_EXPIRES_IN') || '7d',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: '30d',
            }),
        ]);

        return {
            accessToken,
            refreshToken,
            expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
        };
    }

    private async saveSession(
        userId: string,
        accessToken: string,
        refreshToken: string,
    ) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Save to database
        await this.prisma.session.create({
            data: {
                userId,
                token: accessToken,
                refreshToken,
                expiresAt,
            },
        });

        // Cache in Redis (7 days)
        await this.redis.set(
            `session:${accessToken}`,
            JSON.stringify({ userId }),
            7 * 24 * 60 * 60,
        );
    }

    async changePassword(
        userId: string,
        oldPassword: string,
        newPassword: string,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.passwordHash) {
            throw new BadRequestException('User not found');
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new BadRequestException('Invalid old password');
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        // Update password
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });

        // Invalidate all sessions
        await this.prisma.session.deleteMany({
            where: { userId },
        });

        return { success: true };
    }

    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists
            return { success: true };
        }

        // Generate reset token
        const resetToken = this.jwtService.sign(
            { sub: user.id, type: 'reset' },
            { expiresIn: '1h' },
        );

        // Save to Redis (1 hour)
        await this.redis.set(`reset:${resetToken}`, user.id, 3600);

        // Send email with reset link (would use nodemailer in production)
        // For now, return the token for testing purposes
        // In production, use email service like:
        // await this.emailService.sendPasswordReset(user.email, resetToken);

        return { success: true, resetToken };
    }

    async resetPassword(token: string, newPassword: string) {
        // Verify token
        const userId = await this.redis.get(`reset:${token}`);

        if (!userId) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 12);

        // Update password
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });

        // Delete reset token
        await this.redis.del(`reset:${token}`);

        // Invalidate all sessions
        await this.prisma.session.deleteMany({
            where: { userId },
        });

        return { success: true };
    }
}
