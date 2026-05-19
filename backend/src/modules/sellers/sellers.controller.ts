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
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sellers')
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sellers' })
  findAll(@Query() filters: any) {
    return this.sellersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sellers by id' })
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create sellers' })
  create(@Body() dto: any) {
    return this.sellersService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update sellers' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.sellersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete sellers' })
  remove(@Param('id') id: string) {
    return this.sellersService.remove(id);
  }

  // Feature-specific endpoints

  @Post('register-seller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'registerSeller' })
  async registerSeller(@Body() dto: any) {
    return this.sellersService.registerSeller(dto);
  }

  @Post('verify-seller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'verifySeller' })
  async verifySeller(@Body() dto: any) {
    return this.sellersService.verifySeller(dto);
  }

  @Post('get-sellers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getSellers' })
  async getSellers(@Body() dto: any) {
    return this.sellersService.getSellers(dto);
  }

  @Post('get-seller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getSeller' })
  async getSeller(@Body() dto: any) {
    return this.sellersService.getSeller(dto);
  }

  @Post('update-seller-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'updateSellerProfile' })
  async updateSellerProfile(@Body() dto: any) {
    return this.sellersService.updateSellerProfile(dto);
  }

  @Post('suspend-seller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'suspendSeller' })
  async suspendSeller(@Body() dto: any) {
    return this.sellersService.suspendSeller(dto);
  }

  @Post('activate-seller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'activateSeller' })
  async activateSeller(@Body() dto: any) {
    return this.sellersService.activateSeller(dto);
  }

  @Post('get-seller-stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getSellerStats' })
  async getSellerStats(@Body() dto: any) {
    return this.sellersService.getSellerStats(dto);
  }

  @Post('get-seller-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getSellerOrders' })
  async getSellerOrders(@Body() dto: any) {
    return this.sellersService.getSellerOrders(dto);
  }

  @Post('get-seller-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getSellerProducts' })
  async getSellerProducts(@Body() dto: any) {
    return this.sellersService.getSellerProducts(dto);
  }
}
