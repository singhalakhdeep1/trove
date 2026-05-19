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
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new product (Seller only)' })
    create(@Req() req: any, @Body() dto: CreateProductDto) {
        return this.productsService.create(req.user.sellerProfile.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products with filters' })
    findAll(@Query() filters: ProductFilterDto) {
        return this.productsService.findAll(filters);
    }

    @Get('featured')
    @ApiOperation({ summary: 'Get featured products' })
    getFeatured(@Query('limit') limit?: number) {
        return this.productsService.getFeaturedProducts(limit);
    }

    @Get('popular')
    @ApiOperation({ summary: 'Get popular products' })
    getPopular(@Query('limit') limit?: number) {
        return this.productsService.getPopularProducts(limit);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search products' })
    search(@Query('q') query: string, @Query() filters: any) {
        return this.productsService.searchProducts(query, filters);
    }

    @Get('seller/my-products')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get seller products' })
    getSellerProducts(@Req() req: any, @Query() filters: ProductFilterDto) {
        return this.productsService.getSellerProducts(req.user.sellerProfile.id, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get product by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }

    @Get(':id/related')
    @ApiOperation({ summary: 'Get related products' })
    getRelated(@Param('id') id: string, @Query('limit') limit?: number) {
        return this.productsService.getRelatedProducts(id, limit);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product (Seller only)' })
    update(
        @Param('id') id: string,
        @Req() req: any,
        @Body() dto: UpdateProductDto,
    ) {
        return this.productsService.update(id, req.user.sellerProfile.id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete product (Seller only)' })
    remove(@Param('id') id: string, @Req() req: any) {
        return this.productsService.remove(id, req.user.sellerProfile.id);
    }
}
