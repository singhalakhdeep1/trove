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
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all analytics' })
  findAll(@Query() filters: any) {
    return this.analyticsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get analytics by id' })
  findOne(@Param('id') id: string) {
    return this.analyticsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create analytics' })
  create(@Body() dto: any) {
    return this.analyticsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update analytics' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.analyticsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete analytics' })
  remove(@Param('id') id: string) {
    return this.analyticsService.remove(id);
  }

  // Feature-specific endpoints

  @Post('get-dashboard-stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getDashboardStats' })
  async getDashboardStats(@Body() dto: any) {
    return this.analyticsService.getDashboardStats(dto);
  }

  @Post('get-sales-analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getSalesAnalytics' })
  async getSalesAnalytics(@Body() dto: any) {
    return this.analyticsService.getSalesAnalytics(dto);
  }

  @Post('get-revenue-analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getRevenueAnalytics' })
  async getRevenueAnalytics(@Body() dto: any) {
    return this.analyticsService.getRevenueAnalytics(dto);
  }

  @Post('get-user-analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getUserAnalytics' })
  async getUserAnalytics(@Body() dto: any) {
    return this.analyticsService.getUserAnalytics(dto);
  }

  @Post('get-product-analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getProductAnalytics' })
  async getProductAnalytics(@Body() dto: any) {
    return this.analyticsService.getProductAnalytics(dto);
  }

  @Post('get-traffic-analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getTrafficAnalytics' })
  async getTrafficAnalytics(@Body() dto: any) {
    return this.analyticsService.getTrafficAnalytics(dto);
  }

  @Post('get-conversion-rate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getConversionRate' })
  async getConversionRate(@Body() dto: any) {
    return this.analyticsService.getConversionRate(dto);
  }

  @Post('get-abandoned-carts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getAbandonedCarts' })
  async getAbandonedCarts(@Body() dto: any) {
    return this.analyticsService.getAbandonedCarts(dto);
  }

  @Post('get-customer-lifetime-value')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getCustomerLifetimeValue' })
  async getCustomerLifetimeValue(@Body() dto: any) {
    return this.analyticsService.getCustomerLifetimeValue(dto);
  }

  @Post('get-retention-rate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getRetentionRate' })
  async getRetentionRate(@Body() dto: any) {
    return this.analyticsService.getRetentionRate(dto);
  }
}
