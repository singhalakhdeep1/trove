import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, CreateAddressDto, UpdateAddressDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.usersService.findAll(page, limit);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@Req() req: any) {
        return this.usersService.findOne(req.user.id);
    }

    @Get('me/stats')
    @ApiOperation({ summary: 'Get user statistics' })
    getStats(@Req() req: any) {
        return this.usersService.getStats(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    update(@Req() req: any, @Body() dto: UpdateUserDto) {
        return this.usersService.update(req.user.id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user (Admin only)' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    // Address management
    @Get('me/addresses')
    @ApiOperation({ summary: 'Get user addresses' })
    getAddresses(@Req() req: any) {
        return this.usersService.getAddresses(req.user.id);
    }

    @Post('me/addresses')
    @ApiOperation({ summary: 'Add new address' })
    addAddress(@Req() req: any, @Body() dto: CreateAddressDto) {
        return this.usersService.addAddress(req.user.id, dto);
    }

    @Patch('me/addresses/:id')
    @ApiOperation({ summary: 'Update address' })
    updateAddress(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateAddressDto,
    ) {
        return this.usersService.updateAddress(req.user.id, id, dto);
    }

    @Delete('me/addresses/:id')
    @ApiOperation({ summary: 'Delete address' })
    deleteAddress(@Req() req: any, @Param('id') id: string) {
        return this.usersService.deleteAddress(req.user.id, id);
    }
}
