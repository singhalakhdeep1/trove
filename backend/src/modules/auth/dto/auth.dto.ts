import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '+1234567890', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    lastName: string;

    @ApiProperty({ enum: ['BUYER', 'SELLER', 'SERVICE_PROVIDER'], default: 'BUYER' })
    @IsOptional()
    @IsEnum(['BUYER', 'SELLER', 'SERVICE_PROVIDER', 'DRIVER'])
    role?: string;
}

export class LoginDto {
    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    password: string;
}

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    newPassword: string;
}

export class ForgotPasswordDto {
    @ApiProperty()
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    token: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    newPassword: string;
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    refreshToken: string;
}
