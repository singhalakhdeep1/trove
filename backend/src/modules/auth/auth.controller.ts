import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Req,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
    RegisterDto,
    LoginDto,
    ChangePasswordDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    RefreshTokenDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout user' })
    async logout(@Req() req: any) {
        const token = req.headers.authorization?.split(' ')[1];
        return this.authService.logout(req.user.id, token);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    async refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshToken(dto.refreshToken);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user' })
    async getProfile(@Req() req: any) {
        return this.authService.validateUser(req.user.id);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change password' })
    async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
        return this.authService.changePassword(
            req.user.id,
            dto.oldPassword,
            dto.newPassword,
        );
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request password reset' })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto.email);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password' })
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }
}
