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
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  findAll(@Query() filters: any) {
    return this.reviewsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reviews by id' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create reviews' })
  create(@Body() dto: any) {
    return this.reviewsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update reviews' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.reviewsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete reviews' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }

  // Feature-specific endpoints

  @Post('create-review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'createReview' })
  async createReview(@Body() dto: any) {
    return this.reviewsService.createReview(dto);
  }

  @Post('update-review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'updateReview' })
  async updateReview(@Body() dto: any) {
    return this.reviewsService.updateReview(dto);
  }

  @Post('delete-review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'deleteReview' })
  async deleteReview(@Body() dto: any) {
    return this.reviewsService.deleteReview(dto);
  }

  @Post('get-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getReviews' })
  async getReviews(@Body() dto: any) {
    return this.reviewsService.getReviews(dto);
  }

  @Post('get-product-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getProductReviews' })
  async getProductReviews(@Body() dto: any) {
    return this.reviewsService.getProductReviews(dto);
  }

  @Post('get-service-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getServiceReviews' })
  async getServiceReviews(@Body() dto: any) {
    return this.reviewsService.getServiceReviews(dto);
  }

  @Post('get-user-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getUserReviews' })
  async getUserReviews(@Body() dto: any) {
    return this.reviewsService.getUserReviews(dto);
  }

  @Post('mark-helpful')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'markHelpful' })
  async markHelpful(@Body() dto: any) {
    return this.reviewsService.markHelpful(dto);
  }

  @Post('report-review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'reportReview' })
  async reportReview(@Body() dto: any) {
    return this.reviewsService.reportReview(dto);
  }

  @Post('moderate-review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'moderateReview' })
  async moderateReview(@Body() dto: any) {
    return this.reviewsService.moderateReview(dto);
  }
}
