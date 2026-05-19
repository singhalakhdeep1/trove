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
import { FoodService } from './food.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Food')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  @ApiOperation({ summary: 'Get all food' })
  findAll(@Query() filters: any) {
    return this.foodService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get food by id' })
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create food' })
  create(@Body() dto: any) {
    return this.foodService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update food' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.foodService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete food' })
  remove(@Param('id') id: string) {
    return this.foodService.remove(id);
  }

  // Feature-specific endpoints

  @Post('get-restaurants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getRestaurants' })
  async getRestaurants(@Body() dto: any) {
    return this.foodService.getRestaurants(dto);
  }

  @Post('get-restaurant')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getRestaurant' })
  async getRestaurant(@Body() dto: any) {
    return this.foodService.getRestaurant(dto);
  }

  @Post('search-restaurants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'searchRestaurants' })
  async searchRestaurants(@Body() dto: any) {
    return this.foodService.searchRestaurants(dto);
  }

  @Post('get-menu-items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getMenuItems' })
  async getMenuItems(@Body() dto: any) {
    return this.foodService.getMenuItems(dto);
  }

  @Post('get-menu-item')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getMenuItem' })
  async getMenuItem(@Body() dto: any) {
    return this.foodService.getMenuItem(dto);
  }

  @Post('add-to-cart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'addToCart' })
  async addToCart(@Body() dto: any) {
    return this.foodService.addToCart(dto);
  }

  @Post('update-cart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'updateCart' })
  async updateCart(@Body() dto: any) {
    return this.foodService.updateCart(dto);
  }

  @Post('remove-from-cart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'removeFromCart' })
  async removeFromCart(@Body() dto: any) {
    return this.foodService.removeFromCart(dto);
  }

  @Post('get-cart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getCart' })
  async getCart(@Body() dto: any) {
    return this.foodService.getCart(dto);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'checkout' })
  async checkout(@Body() dto: any) {
    return this.foodService.checkout(dto);
  }
}
