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
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all wishlist' })
  findAll(@Query() filters: any) {
    return this.wishlistService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wishlist by id' })
  findOne(@Param('id') id: string) {
    return this.wishlistService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create wishlist' })
  create(@Body() dto: any) {
    return this.wishlistService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update wishlist' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.wishlistService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete wishlist' })
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(id);
  }

  // Feature-specific endpoints

  @Post('add-to-wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'addToWishlist' })
  async addToWishlist(@Body() dto: any) {
    return this.wishlistService.addToWishlist(dto);
  }

  @Post('remove-from-wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'removeFromWishlist' })
  async removeFromWishlist(@Body() dto: any) {
    return this.wishlistService.removeFromWishlist(dto);
  }

  @Post('get-wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getWishlist' })
  async getWishlist(@Body() dto: any) {
    return this.wishlistService.getWishlist(dto);
  }

  @Post('clear-wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'clearWishlist' })
  async clearWishlist(@Body() dto: any) {
    return this.wishlistService.clearWishlist(dto);
  }

  @Post('move-to-cart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'moveToCart' })
  async moveToCart(@Body() dto: any) {
    return this.wishlistService.moveToCart(dto);
  }

  @Post('share-wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'shareWishlist' })
  async shareWishlist(@Body() dto: any) {
    return this.wishlistService.shareWishlist(dto);
  }

  @Post('create-wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'createWishlist' })
  async createWishlist(@Body() dto: any) {
    return this.wishlistService.createWishlist(dto);
  }

  @Post('delete-wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'deleteWishlist' })
  async deleteWishlist(@Body() dto: any) {
    return this.wishlistService.deleteWishlist(dto);
  }

  @Post('update-wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'updateWishlist' })
  async updateWishlist(@Body() dto: any) {
    return this.wishlistService.updateWishlist(dto);
  }

  @Post('get-wishlist-stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getWishlistStats' })
  async getWishlistStats(@Body() dto: any) {
    return this.wishlistService.getWishlistStats(dto);
  }
}
