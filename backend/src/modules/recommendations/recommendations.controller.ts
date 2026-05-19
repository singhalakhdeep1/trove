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
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all recommendations' })
  findAll(@Query() filters: any) {
    return this.recommendationsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recommendations by id' })
  findOne(@Param('id') id: string) {
    return this.recommendationsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create recommendations' })
  create(@Body() dto: any) {
    return this.recommendationsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update recommendations' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.recommendationsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete recommendations' })
  remove(@Param('id') id: string) {
    return this.recommendationsService.remove(id);
  }

  // Feature-specific endpoints

  @Post('get-recommended-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getRecommendedProducts' })
  async getRecommendedProducts(@Body() dto: any) {
    return this.recommendationsService.getRecommendedProducts(dto);
  }

  @Post('get-personalized-recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getPersonalizedRecommendations' })
  async getPersonalizedRecommendations(@Body() dto: any) {
    return this.recommendationsService.getPersonalizedRecommendations(dto);
  }

  @Post('get-similar-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getSimilarProducts' })
  async getSimilarProducts(@Body() dto: any) {
    return this.recommendationsService.getSimilarProducts(dto);
  }

  @Post('get-frequently-bought-together')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getFrequentlyBoughtTogether' })
  async getFrequentlyBoughtTogether(@Body() dto: any) {
    return this.recommendationsService.getFrequentlyBoughtTogether(dto);
  }

  @Post('get-trending-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getTrendingProducts' })
  async getTrendingProducts(@Body() dto: any) {
    return this.recommendationsService.getTrendingProducts(dto);
  }

  @Post('get-new-arrivals')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getNewArrivals' })
  async getNewArrivals(@Body() dto: any) {
    return this.recommendationsService.getNewArrivals(dto);
  }

  @Post('get-best-sellers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getBestSellers' })
  async getBestSellers(@Body() dto: any) {
    return this.recommendationsService.getBestSellers(dto);
  }

  @Post('get-deals-for-you')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getDealsForYou' })
  async getDealsForYou(@Body() dto: any) {
    return this.recommendationsService.getDealsForYou(dto);
  }

  @Post('get-category-recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getCategoryRecommendations' })
  async getCategoryRecommendations(@Body() dto: any) {
    return this.recommendationsService.getCategoryRecommendations(dto);
  }

  @Post('get-brand-recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getBrandRecommendations' })
  async getBrandRecommendations(@Body() dto: any) {
    return this.recommendationsService.getBrandRecommendations(dto);
  }
}
