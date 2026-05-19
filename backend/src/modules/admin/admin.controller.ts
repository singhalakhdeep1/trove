import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get all admin' })
  findAll(@Query() filters: any) {
    return this.adminService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by id' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create admin' })
  create(@Body() dto: any) {
    return this.adminService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.adminService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete admin' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  // Feature-specific endpoints

  @Post('get-dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getDashboard' })
  async getDashboard(@Body() dto: any) {
    return this.adminService.getDashboard(dto);
  }

  @Post('manage-users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'manageUsers' })
  async manageUsers(@Body() dto: any) {
    return this.adminService.manageUsers(dto);
  }

  @Post('manage-sellers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'manageSellers' })
  async manageSellers(@Body() dto: any) {
    return this.adminService.manageSellers(dto);
  }

  @Post('manage-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'manageProducts' })
  async manageProducts(@Body() dto: any) {
    return this.adminService.manageProducts(dto);
  }

  @Post('manage-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'manageOrders' })
  async manageOrders(@Body() dto: any) {
    return this.adminService.manageOrders(dto);
  }

  @Post('manage-categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'manageCategories' })
  async manageCategories(@Body() dto: any) {
    return this.adminService.manageCategories(dto);
  }

  @Post('manage-payments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'managePayments' })
  async managePayments(@Body() dto: any) {
    return this.adminService.managePayments(dto);
  }

  @Post('manage-refunds')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'manageRefunds' })
  async manageRefunds(@Body() dto: any) {
    return this.adminService.manageRefunds(dto);
  }

  @Post('system-settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'systemSettings' })
  async systemSettings(@Body() dto: any) {
    return this.adminService.systemSettings(dto);
  }

  @Post('email-templates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'emailTemplates' })
  async emailTemplates(@Body() dto: any) {
    return this.adminService.emailTemplates(dto);
  }
}
